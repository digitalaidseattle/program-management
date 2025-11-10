// src/components/VentureReportDisplay.tsx
import { useMemo, useState } from 'react'
import { Box, Card, CardContent, Divider, List, ListItemButton, ListItemText, Stack, Typography } from '@mui/material'
import { VentureReport } from '../services/dasVentureReportService'
import { HEALTH_STATUS_CHIPS, HEALTH_STATUS_INDICATOR_COLORS } from '../pages/venture/Utils'

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

  type FieldComponent = 'Select' | 'TextField'

  type FieldOption = { value: string, label: string }

  type ReportFieldConfig = {
    name: string,
    label: string,
    component: FieldComponent,
    options?: FieldOption[]
  }

  // Define known fields/report questions here
  // if field in db but not here it'll just be rendered as a TextField
  // this orders the report too
  const REPORT_FIELDS: readonly ReportFieldConfig[] = [
    {
      name: 'health',
      label: 'Health',
      component: 'Select',
      options: [
        { value: 'on_track', label: 'On Track' },
        { value: 'at_risk', label: 'At Risk' },
        { value: 'blocked', label: 'Blocked' },
      ]
    },
    {
      name: 'successes',
      label: 'Successes',
      component: 'TextField'
    },
    {
      name: 'challenges',
      label: 'Challenges/Problems',
      component: 'TextField'
    },
    {
      name: 'changes_by_partner',
      label: 'Changes by Partner',
      component: 'TextField'
    },
    {
      name: 'staffing_need',
      label: 'Staffing Needs',
      component: 'TextField'
    },
    {
      name: 'asks',
      label: 'Asks',
      component: 'TextField'
    },
    {
      name: 'next_steps',
      label: 'Next Steps',
      component: 'TextField'
    },
  ] as const;

  const toTitleCase = (value: string) => value
    .split('_')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

  const getFieldConfig = (fieldName: string): ReportFieldConfig => {
    return REPORT_FIELDS.find(field => field.name === fieldName) ?? {
      name: fieldName,
      label: toTitleCase(fieldName),
      component: 'TextField'
    }
  }

  // find field label from list above or generate new one if not present
  const getFieldLabel = (fieldName: string): string => {
    const field = getFieldConfig(fieldName)
    return field.label
  }

  const formatValue = (fieldName: string, value: any): string => {
    const field = getFieldConfig(fieldName)

    if (field.component === 'Select') {
      const option = field.options?.find(opt => opt.value === value)
      return option?.label || value
    }

    return value
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const getReportPeriodParts = (period?: string) => {
    if (!period) {
      return undefined
    }
    const date = new Date(period)
    if (Number.isNaN(date.getTime())) {
      return undefined
    }
    return {
      monthName: monthNames[date.getUTCMonth()],
      year: date.getUTCFullYear()
    }
  }

  const renderHealthChip = (status?: VentureReport['health']) => status ? (HEALTH_STATUS_CHIPS[status] ?? null) : null;

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
    
    const knownFieldNames = REPORT_FIELDS.map(field => field.name)
    const metadata = new Set(['id', 'venture_id', 'reported_by', 'report_period', 'health'])
    const reportRecord = report as Record<string, any>

    const knownEntries = REPORT_FIELDS
      .filter(field => field.name !== 'health')
      .map<[string, any]>((field) => [field.name, reportRecord[field.name]])
      .filter(([, value]) => Boolean(value));

    const fallbackEntries: [string, any][] = Object.entries(reportRecord)
      .filter(([key, value]) => !knownFieldNames.includes(key) && !metadata.has(key) && Boolean(value))
      .map(([key, value]) => [key, value])

    const contentEntries = [...knownEntries, ...fallbackEntries]
    const periodParts = getReportPeriodParts(report.report_period);

    return (
      <Card>
        <CardContent>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
            <Typography variant="h6">
              {periodParts ? `${periodParts.monthName} ${periodParts.year} Report` : 'Report'}
            </Typography>
            {renderHealthChip(report.health)}
          </Stack>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Reported by: {report.reported_by}
          </Typography>

          {contentEntries.map(([key, value]) => renderFieldSection(key, value))}
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
            const periodParts = getReportPeriodParts(period.report_period)
            const label = periodParts ? `${periodParts.monthName} ${periodParts.year}` : 'Unknown Period'
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
        {renderReportDetail()}
      </Box>
    </Stack>
  )
}
