import { TabbedPanelsCard } from '@digitalaidseattle/mui';
import {
  Breadcrumbs,
  Link,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { StaffingTable } from '../../components/StaffingTable';
import { EntityProps } from '../../components/utils';
import VentureReportDisplay from '../../components/VentureReportDisplay';
import { Staffing, staffingService } from '../../services/dasStaffingService';
import { VentureReport, VentureReportService } from '../../services/dasVentureReportService';
import { Venture, ventureService } from '../../services/dasVentureService';

const StaffingPanel: React.FC<EntityProps<Venture>> = ({ entity }) => {
  const [current, setCurrent] = useState<Staffing[]>([]);

  useEffect(() => {
    if (entity) {
      staffingService.findByVentureId(entity.id)
        .then((staffing) => {
          setCurrent(staffing)
        });
    }
  }, [entity]);

  return <StaffingTable title="Staffing" items={current} />
}

const ReportPanel: React.FC<EntityProps<Venture>> = ({ entity }) => {
  const ventureReportService = VentureReportService.instance();

  const [reports, setReports] = useState<VentureReport[]>([]);

  useEffect(() => {
    if (entity) {
      ventureReportService.findByVentureId(entity.id)
        .then(data => setReports(data))
        .catch(err => {
          console.error('Failed to load venture reports', err);
          setReports([]);
        });
    } else {
      setReports([]);
    }
  }, [entity]);

  return <VentureReportDisplay reports={reports} />;
}

const VentureDetails: React.FC<EntityProps<Venture>> = ({ entity, onChange }) => {

  function handleStaffingChange(evt: any) {
    onChange(evt)
  }

  function handleReportChange(evt: any) {
    onChange(evt);
  }

  return (entity &&
    <>
      <Stack gap={3}>
        <TextField id="outlined-basic" label="Name" variant="outlined" value={entity.venture_code} />
      </Stack>
      <>
        <TabbedPanelsCard panels={
          [
            {
              header: 'Staffing',
              children: <StaffingPanel entity={entity} onChange={handleStaffingChange} />
            },
            {
              header: 'Report',
              children: <ReportPanel entity={entity} onChange={handleReportChange} />
            },
          ]
        } />
      </>
    </>
  )

}

const VenturePage = () => {
  const [entity, setEntity] = useState<Venture>();
  const { id } = useParams<string>();

  useEffect(() => {
    refresh();
  }, [id]);

  function refresh() {
    if (id) {
      ventureService.getById(id)
        .then((en) => setEntity(en!));
    }
  }

  return (entity &&
    <Stack gap={3}>
      <Breadcrumbs>
        <Link color="inherit" href="/">
          Home
        </Link>
        <Link color="inherit" href="/ventures">
          Ventures
        </Link>
        <Typography>{entity.venture_code}</Typography>
      </Breadcrumbs>
      <VentureDetails entity={entity} onChange={refresh} />
    </Stack>
  )
}
export { VentureDetails, VenturePage };
