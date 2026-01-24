import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography
} from '@mui/material';
import { blue } from '@mui/material/colors';
import dayjs from 'dayjs';
import { VentureReport } from '../services/dasVentureReportService';
import { HEALTH_STATUS_CHIPS } from './StatusChip';

export const VentureReportDetails = ({ report }: { report: VentureReport }) => {
  const REPORT_FIELDS = [
    { key: 'successes', label: 'Successes' },
    { key: 'challenges', label: 'Challenges / Problems' },
    { key: 'changes_by_partner', label: 'Changes by Partner' },
    { key: 'staffing_need', label: 'Staffing Needs' },
    { key: 'asks', label: 'Asks' },
    { key: 'next_steps', label: 'Next Steps' }
  ] as const;

  return (
    <>
      <Card>
        <CardHeader
          slotProps={{ title: { fontSize: 16, fontWeight: 600 } }}
          avatar={<Avatar sx={{ fontSize: 10, bgcolor: blue[500] }}>{dayjs(report.reporting_date).format('MM YYYY')}</Avatar>}
          title={report.venture?.title || report.venture?.venture_code}
          subheader={
            <Stack direction={'row'}>
              <Typography component="span">Reported by {report.reported_by || 'Unknown'}</Typography>
              <Typography component="span">Reporting date: {dayjs(report.reporting_date).format('MM/DD/YYYY')}</Typography>
            </Stack>
          }
          action={HEALTH_STATUS_CHIPS[report.health]} />
        <CardContent>
          {
            REPORT_FIELDS.map(field => {
              const value = (report as any)[field.key];
              if (!value) return null;
              return (
                <Box key={field.key} mb={2}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {field.label}
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {value}
                  </Typography>
                </Box>
              );
            })
          }
          {
            REPORT_FIELDS.every(field => !(report as any)[field.key]) && (
              <Typography variant="body2" color="text.secondary">
                No detailed notes recorded for this report.
              </Typography>
            )
          }
        </CardContent>
      </Card>

    </>
  );
}
