import { SxProps, Theme } from "@mui/material";

export const rootBox: SxProps<Theme> = {
  width: "100%",
  borderRadius: 3,
  p: 3,
};

export const leftCard: SxProps<Theme> = (theme: Theme) => ({
  mt: 2,
  borderRadius: 3,
  border: `1px solid ${theme.palette.grey[200]}`,
  bgcolor: "rgba(255,255,255,0.7)",
  overflow: "hidden",
});

export const headerCell: SxProps<Theme> = {
  fontWeight: 500,
};

export const emptyCell: SxProps<Theme> = {
  color: "text.secondary",
};

export const rightCard: SxProps<Theme> = (theme: Theme) => ({
  height: "100%",
  borderRadius: 3,
  border: `1px solid ${theme.palette.grey[200]}`,
  bgcolor: "rgba(255,255,255,0.7)",
  p: 2.5,
  display: "flex",
  flexDirection: "column",
  gap: 2,
});

export const rightDivider: SxProps<Theme> = {
  my: 1,
};

export const formBox: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

export const formButtonRow: SxProps<Theme> = {
  display: "flex",
  justifyContent: "flex-end",
  mt: 1,
};
