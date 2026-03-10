import { Chip } from '@mui/material';
import { ReactElement } from 'react';
import { HealthStatus } from '../services/dasVentureReportService';

// define new chip styles here
export type StatusColor = 'green' | 'yellow' | 'red' | 'blue' | 'gray';

export const STATUS_CHIP_COLORS: Record<StatusColor, { text: string; border: string; background: string }> = {
  green: {
    text: '#13AD53',
    border: '#80CA85',
    background: '#E9FCE3'
  },
  yellow: {
    text: '#CF7617',
    border: '#E8B473',
    background: '#FFF4D5'
  },
  red: {
    text: '#CF171D',
    border: '#F1A2A6',
    background: '#FCE3E4'
  },
  blue: {
    text: '#1767CF',
    border: '#9CBDEE',
    background: '#EAF2FF'
  },
  gray: {
    text: '#475467',
    border: '#D0D5DD',
    background: '#F2F4F7'
  }
};

export interface StatusChipProps {
  label: string;
  color: StatusColor;
}

export function StatusChip({ label, color }: StatusChipProps) {
  const palette = STATUS_CHIP_COLORS[color];

  return (
    <Chip
      size="small"
      label={label}
      sx={{
        fontWeight: 600,
        color: palette.text,
        borderColor: palette.border,
        backgroundColor: palette.background,
        borderWidth: 1,
        borderStyle: 'solid'
      }}
    />
  );
}

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

export const VENTURE_STATUS_CHIPS: Record<string, ReactElement> = {
  'Active': <StatusChip label="Active" color="blue" />,
  'Delivered': <StatusChip label="Delivered" color="green" />,
  'Paused': <StatusChip label="Paused" color="yellow" />,
  'Declined': <StatusChip label="Declined" color="red" />,
  'Submitted by Partner': <StatusChip label="Submitted by Partner" color="gray" />,
  'Ready for consideration': <StatusChip label="Ready for consideration" color="gray" />,
  'Under evaluation': <StatusChip label="Under evaluation" color="gray" />
};
