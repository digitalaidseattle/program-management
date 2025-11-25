import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ventureReportService, VentureReportWithVenture } from '../../services/dasVentureReportService';
import { HEALTH_STATUS_CHIPS, HEALTH_STATUS_INDICATOR_COLORS } from '../../components/StatusChip';

const ReportingPage = () => {
  const [reports, setReports] = useState<VentureReportWithVenture[]>([]);

  //TODO: Look into loadingContext
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    ventureReportService.findRecentReports()
      .then(data => {
        setReports(data);
        setError(null);
      })
      .catch(err => {
        console.error('Failed to load reports', err);
        setError('Unable to load reports right now.');
      })
      .finally(() => setLoading(false));
  }, []);

  const latestPerVenture = useMemo(() => {
    const seen = new Set<string>();
    const unique: VentureReportWithVenture[] = [];

    reports.forEach(report => {
      if (!seen.has(report.venture_id)) {
        seen.add(report.venture_id);
        unique.push(report);
      }
    });

    return unique;
  }, [reports]);

  const selectedReport = useMemo(
    () => latestPerVenture.find(report => report.id === selectedReportId) ?? null,
    [latestPerVenture, selectedReportId]
  );

  const parsePeriodDate = (period?: string): Date | null => {
    if (!period) return null;
    const parsed = new Date(period);
    if (Number.isNaN(parsed.getTime())) return null;
    return new Date(Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth(), 1));
  };

  const formatPeriodLabel = (date: Date | null, fallback: string) => {
    if (!date) return fallback || 'Unknown';
    const month = date.toLocaleString(undefined, { month: 'long', timeZone: 'UTC' });
    const year = date.getUTCFullYear();
    return `${month}, ${year}`;
  };

  const formatPeriodString = (period?: string) => {
    const date = parsePeriodDate(period);
    return formatPeriodLabel(date, period || 'Unknown');
  };

  const formatReportingDate = (date?: string | null) => {
    if (!date) return 'Unknown';
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return date;
    return parsed.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const latestPeriodLabel = useMemo(() => {
    const sortedByPeriod = [...latestPerVenture].sort((a, b) => {
      const aDate = parsePeriodDate(a.report_period)?.getTime() ?? 0;
      const bDate = parsePeriodDate(b.report_period)?.getTime() ?? 0;
      return bDate - aDate;
    });
    const latest = sortedByPeriod[0];
    return latest ? formatPeriodString(latest.report_period) : 'Latest reports';
  }, [latestPerVenture]);

  const REPORT_FIELDS = [
    { key: 'successes', label: 'Successes' },
    { key: 'challenges', label: 'Challenges / Problems' },
    { key: 'changes_by_partner', label: 'Changes by Partner' },
    { key: 'staffing_need', label: 'Staffing Needs' },
    { key: 'asks', label: 'Asks' },
    { key: 'next_steps', label: 'Next Steps' }
  ] as const;

  const handleBackToTable = () => setSelectedReportId(null);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h2" component="h1" gutterBottom>
          Reporting Overview
        </Typography>
        <Typography variant="body1">
          Latest venture reports across the program. Select a venture to drill into the detailed record.
        </Typography>
      </Box>

      {!selectedReport ? (
        <Paper sx={{ p: 2 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">{latestPeriodLabel} (Latest)</Typography>
            <Typography variant="body2" color="text.secondary">
              Click a venture row to view report details
            </Typography>
          </Stack>
          {loading && (
            <Stack direction="row" alignItems="center" justifyContent="center" sx={{ py: 4 }}>
              <CircularProgress size={32} />
            </Stack>
          )}
          {!loading && error && (
            <Box sx={{ py: 2 }}>
              <Typography color="error">{error}</Typography>
            </Box>
          )}
          {/* #TODO Look into DataGrid instead */}
          {!loading && !error && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Venture</TableCell>
                  <TableCell>Reporting Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Highlights</TableCell>
                  <TableCell>Updated By</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {latestPerVenture.map(report => (
                  <TableRow
                    key={report.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => setSelectedReportId(report.id)}
                  >
                    <TableCell>
                      <Typography variant="subtitle2">{report.venture?.venture_code || report.venture_id}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {report.venture?.title}
                      </Typography>
                    </TableCell>
                    <TableCell>{formatReportingDate(report.reporting_date)}</TableCell>
                    <TableCell>{HEALTH_STATUS_CHIPS[report.health]}</TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 260 }}>
                        {report.successes || report.challenges || '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>{report.reported_by || 'Unknown'}</TableCell>
                    <TableCell align="right">
                      <Button
                        component={RouterLink}
                        to={`/venture/${report.venture_id}`}
                        size="small"
                        variant="outlined"
                        onClick={e => e.stopPropagation()}
                      >
                        View Venture
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {latestPerVenture.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Typography align="center" sx={{ py: 4 }} color="text.secondary">
                        No reports available yet.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </Paper>
      ) : (
        <Paper sx={{ p: 2 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <Box minWidth={{ xs: '100%', md: 280 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Ventures
                </Typography>
                <Button size="small" onClick={handleBackToTable}>
                  Back to table
                </Button>
              </Stack>
              <List
                component="nav"
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 2,
                  maxHeight: 400,
                  overflow: 'auto'
                }}
              >
                {latestPerVenture.map(report => (
                  <ListItemButton
                    key={report.id}
                    selected={report.id === selectedReportId}
                    onClick={() => setSelectedReportId(report.id)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight={600}>
                          {report.venture?.venture_code || report.venture_id}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary" noWrap>
                          {report.venture?.title || 'Untitled'}
                        </Typography>
                      }
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', minWidth: 16 }}>
                      <Box
                        component="span"
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          backgroundColor: HEALTH_STATUS_INDICATOR_COLORS[report.health] ?? 'grey.400'
                        }}
                      />
                    </Box>
                  </ListItemButton>
                ))}
              </List>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
            <Box flex={1}>
              {selectedReport && (
                <Card>
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: 'none' }}>
                          {formatPeriodString(selectedReport.report_period)}
                        </Typography>
                        <Typography variant="h6">
                          {selectedReport.venture?.title || selectedReport.venture?.venture_code}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Reported by {selectedReport.reported_by || 'Unknown'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Reporting date: {formatReportingDate(selectedReport.reporting_date)}
                        </Typography>
                      </Box>
                      {HEALTH_STATUS_CHIPS[selectedReport.health]}
                    </Stack>
                    <Divider sx={{ my: 2 }} />
                    {REPORT_FIELDS.map(field => {
                      const value = (selectedReport as any)[field.key];
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
                    })}
                    {REPORT_FIELDS.every(field => !(selectedReport as any)[field.key]) && (
                      <Typography variant="body2" color="text.secondary">
                        No detailed notes recorded for this report.
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              )}
            </Box>
          </Stack>
        </Paper>
      )}
    </Stack>
  );
};

export default ReportingPage;
