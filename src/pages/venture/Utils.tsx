import { ReactElement } from 'react';
import { StatusChip, STATUS_CHIP_COLORS } from '../../components/StatusChip';
import { HealthStatus } from '../../services/dasVentureReportService';

export const HEALTH_STATUS_CHIPS: Record<HealthStatus, ReactElement> = {
  on_track: <StatusChip label="On Track" color="green" />,
  at_risk: <StatusChip label="At Risk" color="yellow" />,
  blocked: <StatusChip label="Blocked" color="red" />
};

export const HEALTH_STATUS_INDICATOR_COLORS: Record<HealthStatus, string> = {
  on_track: STATUS_CHIP_COLORS['green'].border,
  at_risk: STATUS_CHIP_COLORS['yellow'].border,
  blocked: STATUS_CHIP_COLORS['red'].border
};
