// src/components/VentureReportDisplay.tsx
import { useMemo, useState } from 'react'
import { Box, Card, CardContent, Chip, Divider, List, ListItemButton, ListItemText, Stack, Typography } from '@mui/material'
import { ventureReportSchema } from '../config/ventureReportSchema'
import { VentureReport } from '../services/dasVentureReportService'

interface VentureReportDisplayProps {
  reports: VentureReport[]
  initialReportId?: string
}

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
          <Typography variant="body1">No venture reports available yet.</Typography>
        </CardContent>
      </Card>
    )
  }

  const getFieldLabel = (fieldName: string): string => {
    const field = ventureReportSchema.fields.find(f => f.name === fieldName)
    return field?.label || fieldName
  }

  const formatValue = (fieldName: string, value: any): string => {
    const field = ventureReportSchema.fields.find(f => f.name === fieldName)
    
    if (field?.component === 'Select') {
      const option = field.options?.find(opt => opt.value === value)
      return option?.label || value
    }
    
    if (field?.component === 'Switch') {
      return value ? 'Yes' : 'No'
    }
    
    return value
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const HEALTH_CHIP_STYLES: Record<string, { label: string, text: string, border: string, background: string }> = {
    on_track: {
      label: 'On Track',
      text: '#13AD53',
      border: '#80CA85',
      background: '#E9FCE3'
    },
    at_risk: {
      label: 'At Risk',
      text: '#CF7617',
      border: '#E8B473',
      background: '#FFF4D5'
    },
    blocked: {
      label: 'Blocked',
      text: '#CF171D',
      border: '#F1A2A6',
      background: '#FCE3E4'
    }
  };

  const renderHealthChip = (value?: string) => {
    if (!value) {
      return null;
    }
    const chipDef = HEALTH_CHIP_STYLES[value] ?? {
      label: formatValue('health', value),
      text: '#4f4f4f',
      border: '#e0e0e0',
      background: '#fafafa'
    };
    return (
      <Chip
        size="small"
        label={chipDef.label}
        sx={{
          fontWeight: 600,
          color: chipDef.text,
          borderColor: chipDef.border,
          backgroundColor: chipDef.background,
          borderWidth: 1,
          borderStyle: 'solid'
        }}
      />
    );
  };

  const orderedFields = ['successes', 'challenges', 'changes_by_partner', 'staffing_need', 'asks', 'next_steps'];

  const renderFieldSection = (key: string, value: any) => (
    <Box key={key} mb={2}>
      <Typography variant="subtitle2" color="text.secondary">
        {getFieldLabel(key)}
      </Typography>
      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
        {formatValue(key, value)}
      </Typography>
    </Box>
  );

  const renderReportDetail = () => {
    if (!report) return null
    const contentEntries = Object.entries(report.report_content ?? {}).filter(([key, value]) => key !== 'version' && value);
    const orderedSections = orderedFields
      .map(key => contentEntries.find(entry => entry[0] === key))
      .filter((entry): entry is [string, any] => Boolean(entry));
    const remainingSections = contentEntries.filter(([key]) =>
      key !== 'health' && !orderedFields.includes(key)
    );

    return (
      <Card>
        <CardContent>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
            <Typography variant="h6">
              {monthNames[report.report_month - 1]} {report.report_year} Report
            </Typography>
            {renderHealthChip(report.report_content?.health)}
          </Stack>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Reported by: {report.reported_by}
          </Typography>

          {orderedSections.map(([key, value]) => renderFieldSection(key, value))}
          {remainingSections.map(([key, value]) => renderFieldSection(key, value))}
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
            const monthName = monthNames[period.report_month - 1]
            const chipStyles = HEALTH_CHIP_STYLES[period.report_content?.health ?? ''] ?? { text: '#4f4f4f' }
            return (
              <ListItemButton
                key={period.id}
                selected={period.id === report?.id}
                onClick={() => setSelectedReportId(period.id)}
              >
                <ListItemText
                  primary={
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Typography variant="body2">{`${monthName} ${period.report_year}`}</Typography>
                      <Box
                        component="span"
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: chipStyles.border,
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
        {renderReportDetail()}
      </Box>
    </Stack>
  )
}
