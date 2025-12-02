import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography
} from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { storageService } from '../../App';
import { FieldRow } from '../../components/FieldRow';
import { partnerService } from '../../services/dasPartnerService';
import { Staffing, staffingService } from '../../services/dasStaffingService';
import { VentureReport, ventureReportService } from '../../services/dasVentureReportService';
import { Venture } from '../../services/dasVentureService';
import { HEALTH_STATUS_CHIPS } from '../../components/StatusChip';

const HealthCard = ({ entity }: { entity: Venture }) => {
  const [report, setReport] = useState<VentureReport>();

  useEffect(() => {
    fetchData();
  }, [entity]);

  function fetchData() {
    ventureReportService.findByVentureId(entity.id!)
      .then(reports => {
        console.log(reports)
        setReport(reports.length > 0 ? reports[0] : undefined)
      });
  }

  return (report &&
    <Card variant="outlined" >
      <CardHeader title="Venture Health"
        subheader={dayjs(report.reporting_date).format('MMM YYYY')}
        action={HEALTH_STATUS_CHIPS[report.health]} />
    </Card >
  )
}

export const STAFFING_COMP: { [key: string]: JSX.Element } = {
  "Proposed": <Chip label='P' color='default' />,
  "Please fill": <Chip label='P' color='primary' />,
  'Cancelled': <Chip label='C' color='warning' />,
  "Concluded": <Chip label='C' color='secondary' />,
  'Filled': <Chip label='F' color='success' />,
}
const StaffingCard = ({ entity }: { entity: Venture }) => {
  const [staffing, setStaffing] = useState<Staffing[]>([]);

  useEffect(() => {
    fetchData();
  }, [entity]);

  function fetchData() {
    staffingService.findByVentureId(entity.id!)
      .then(s => setStaffing(s));
  }

  return (
    <Card key={entity.id} variant="outlined">
      <CardHeader title="Staffing" />
      <CardContent>
        {staffing.map(staff =>
          <Card>
            <CardHeader
              avatar={<Avatar
                src={staff.volunteer ? storageService.getUrl(`/profiles/${staff.volunteer.profile!.id}`) : undefined}
                alt={`${staff.volunteer ? (staff.volunteer.profile!.name + ' picture') : ''}`}
                sx={{ width: 40, height: 40, objectFit: 'contain' }}
                variant="rounded" />}

              alt={staff.volunteer ? staff.volunteer!.profile!.name : ''}
              title={staff.volunteer ? staff.volunteer!.profile!.name : 'Unfilled Position'}
              subheader={staff.role!.name}
              action={
                <Tooltip title={staff.status}>
                  <IconButton>
                    {STAFFING_COMP[staff.status]}
                  </IconButton>
                </Tooltip>
              } />
          </Card>
        )}
      </CardContent>
    </Card>
  )
}


const ReferenceVentureDetails = ({ entity }: { entity: Venture }) => {

  return (entity &&
    <>
      <Card sx={{ padding: 0 }}>
        <CardHeader title={entity.venture_code} />
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={6}>
              <Stack gap={3}>
                <Box
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    bgcolor: 'grey.50',
                    border: (t) => `1px solid ${t.palette.divider}`,
                    height: { xs: 180, sm: 220, md: 240 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2,
                  }}
                >
                  <Avatar
                    src={partnerService.getLogoUrl(entity.partner!)}
                    alt={entity.partner!.name}
                    variant="rounded"
                    sx={{
                      borderRadius: 3,
                      width: '100%',
                      height: '100%',
                      fontSize: 48,
                      bgcolor: 'grey.100',
                      color: 'text.secondary',
                      '& .MuiAvatar-img': {
                        objectFit: 'contain',
                        width: '100%',
                        height: '100%',
                      },
                    }}
                  >
                    {entity.partner!.name?.[0] ?? '?'}
                  </Avatar>
                </Box>
                <FieldRow label="Status" >
                  <Typography variant="body1">{entity.status}</Typography>
                </FieldRow>
                <FieldRow label="Partner" >
                  <Typography variant="body1">{entity.partner?.name}</Typography>
                </FieldRow>
                <FieldRow label="Title" >
                  <Typography variant="body1">{entity.title}</Typography>
                </FieldRow>
                <FieldRow label="Painpoint" >
                  <Typography variant="body1">{entity.painpoint}</Typography>
                </FieldRow>
                <FieldRow label="Problem" >
                  <Typography variant="body1">{entity.problem}</Typography>
                </FieldRow>
                <FieldRow label="Solution" >
                  <Typography variant="body1">{entity.solution}</Typography>
                </FieldRow>
                <FieldRow label="Impact" >
                  <Typography variant="body1">{entity.impact}</Typography>
                </FieldRow>
              </Stack>
            </Grid>
            <Grid size={6} >
              <Stack gap={2}>
                <HealthCard entity={entity} />
                <StaffingCard entity={entity} />
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card >

    </>
  )

}

export { ReferenceVentureDetails };
