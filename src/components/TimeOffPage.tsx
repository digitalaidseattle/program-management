/**
 *  TimeOffPage.tsx
 *
 */

import React, { useState, FormEvent } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Divider,
} from "@mui/material";

import * as styles from "./TimeOffPageStyles";

export interface TimeOffEntry {
  id: number;
  start: string; 
  end: string;   
  reason?: string;
}

const TimeOffPage = () => {
  const [entries, setEntries] = useState<TimeOffEntry[]>([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!start || !end) return;

    const newEntry: TimeOffEntry = {
      id: Date.now(),
      start,
      end,
      reason: reason.trim() || undefined,
    };

    const updated = [...entries, newEntry];
    setEntries(updated);

    // Soft TODO: call backend API here 

    setStart("");
    setEnd("");
    setReason("");
  };

  const formatDate = (value: string) => {
    if (!value) return "—";
    const d = new Date(value);
    return isNaN(d.getTime()) ? value : d.toLocaleString();
  };

  return (
    <Box sx={styles.rootBox}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Time off of DAS entirely?
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Enter the time span below.
          </Typography>

          <Paper elevation={0} sx={styles.leftPaper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={styles.headerCell}>start date</TableCell>
                  <TableCell sx={styles.headerCell}>end date</TableCell>
                  <TableCell sx={styles.headerCell}>reason</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {entries.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} sx={styles.emptyCell}>
                      No time off added yet.
                    </TableCell>
                  </TableRow>
                )}
                {entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{formatDate(entry.start)}</TableCell>
                    <TableCell>{formatDate(entry.end)}</TableCell>
                    <TableCell>{entry.reason || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={styles.rightPaper}>
            <Typography variant="subtitle1" fontWeight={600}>
              Add time off
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Set a start and end date, and optionally add a reason.
            </Typography>

            <Divider sx={styles.rightDivider} />

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={styles.formBox}
            >
              <TextField
                label="Start date"
                type="datetime-local"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
              />

              <TextField
                label="End date"
                type="datetime-local"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
              />

              <TextField
                label="Reason (optional)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                multiline
                minRows={2}
                size="small"
              />

              <Box sx={styles.formButtonRow}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!start || !end}
                >
                  Add time off
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TimeOffPage;
