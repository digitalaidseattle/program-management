import {
  Box,
  Divider,
  Stack,
  Typography
} from '@mui/material';
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
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
        <Box>
          <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: 'none' }}>
            {dayjs(report.reporting_date).format('MM YYYY')}
          </Typography>
          <Typography variant="h6">
            {report.venture?.title || report.venture?.venture_code}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Reported by {report.reported_by || 'Unknown'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Reporting date: {dayjs(report.reporting_date).format('MM/DD/YYYY')}
          </Typography>
        </Box>
        {HEALTH_STATUS_CHIPS[report.health]}
      </Stack>
      <Divider sx={{ my: 2 }} />
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
    </>
  );
}
