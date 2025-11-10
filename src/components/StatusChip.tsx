import { Chip } from '@mui/material';

export type StatusColor = 'green' | 'yellow' | 'red';

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
