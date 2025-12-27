// src/components/VentureReportDisplay.tsx
import { Box, Card, CardContent, Divider, List, ListItemButton, ListItemText, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { HEALTH_STATUS_INDICATOR_COLORS } from '../components/StatusChip.tsx';
import { VentureReport } from '../services/dasVentureReportService';
import { VentureReportDetails } from './VentureReportDetails.tsx';

interface VentureReportDisplayProps {
  reports: VentureReport[]
  initialReportId?: string
}
const MONTH_YEAR_FORMAT = 'MMMM YYYY';
export default function VentureReportDisplay({ reports, initialReportId }: VentureReportDisplayProps) {
  const [selectedReportId, setSelectedReportId] = useState<string>(initialReportId ?? reports[0]?.id ?? '')

  const report = useMemo(() => {
    if (reports.length === 0) {
      return undefined
    }
    return reports.find(r => r.id === selectedReportId) ?? reports[0]
  }, [reports, selectedReportId])

  if (reports.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="body1">No venture reports available.</Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Stack direction={{ xs: 'column', md: 'row' }} gap={3} sx={{ minHeight: 400 }}>
      <Box minWidth={240} maxWidth={300}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          Reporting Periods
        </Typography>
        <List component="nav" sx={{ border: 1, borderColor: 'divider', borderRadius: 2 }}>
          {reports.map(period => {
            const label = report?.reporting_date ? `${dayjs(report?.reporting_date).format(MONTH_YEAR_FORMAT)}` : 'Unknown Period'
            const indicatorColor = (period.health && HEALTH_STATUS_INDICATOR_COLORS[period.health]) ?? '#4f4f4f'
            return (
              <ListItemButton
                key={period.id}
                selected={period.id === report?.id}
                onClick={() => setSelectedReportId(period.id)}
              >
                <ListItemText
                  primary={
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Typography variant="body2">{label}</Typography>
                      <Box
                        component="span"
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: indicatorColor,
                          display: 'inline-block'
                        }}
                      />
                    </Stack>
                  }
                />
              </ListItemButton>
            )
          })}
        </List>
      </Box>
      <Divider orientation={"vertical"} flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
      <Box flex={1} width="100%">
        {report && <VentureReportDetails report={report} />}
      </Box>
    </Stack>
  )
}
