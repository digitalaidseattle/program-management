
// material-ui
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
import { Staffing, staffingService } from '../../services/dasStaffingService';
import { Venture, ventureService } from '../../services/dasVentureService';

const VolunteersCard: React.FC<EntityProps<Venture>> = ({ entity, onChange }) => {
  const [current, setCurrent] = useState<Staffing[]>([]);
  const [available, setAvailable] = useState<Staffing[]>([]);
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);

  useEffect(() => {
    if (entity) {
      staffingService.findByVentureId(entity.id)
        .then((staffing) => {
          setCurrent(staffing)
        });
    }
  }, [entity]);

  function handleRemove(index: number): Promise<boolean> {
    throw new Error('handleRemove')
    // return team2VolunteerService.removeVolunteerFromTeam(current[index], entity!)
    //   .then(() => {
    //     onChange(true);
    //     return true;
    //   })
  }

  function handleAdd(value: string | null | undefined): Promise<boolean> {
    throw new Error('handleAdd')

    //   const selected = available.find(vol => vol.id === value);
    //   if (selected) {
    //     return team2VolunteerService.addVolunteerToTeam(selected, entity!)
    //       .then(() => {
    //         onChange(true);
    //         setShowAddDialog(false);
    //         return true;
    //       })
    //   } else {
    //     return Promise.resolve(true)
    //   }
    // }
  }

  return (< >
    <StaffingTable title="Staffing" items={current} />
  </>)
}


const VentureDetails: React.FC<EntityProps<Venture>> = ({ entity, onChange }) => {
  return (entity &&
    <>
      <Stack gap={3}>
        <TextField id="outlined-basic" label="Name" variant="outlined" value={entity.venture_code} />
      </Stack>
      <VolunteersCard entity={entity} onChange={onChange} />
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

