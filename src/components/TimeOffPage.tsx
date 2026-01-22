/**
 *  TimeOffPage.tsx
 *
 */

import { useEffect, useState, FormEvent } from "react";
import {
  Box,
  Button,
  Card,
  TextField,
  Typography,
  Table,
  Grid,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Divider,
} from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useVolunteer } from '../hooks/useVolunteer';
import { supabaseClient } from "@digitalaidseattle/supabase";
import * as styles from "./TimeOffPageStyles";

dayjs.extend(utc);

export interface TimeOffEntry {
  id: string;
  start: string; 
  end: string;   
  reason?: string;
}

const TimeOffPage = () => {
  const [entries, setEntries] = useState<TimeOffEntry[]>([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [reason, setReason] = useState("");
  const { volunteer } = useVolunteer();

  useEffect(() => {
    const load = async () => {
      if (!volunteer?.id) return;
  
      const { data, error } = await supabaseClient
        .from("time_off")
        .select("id, start_at, end_at, reason")
        .eq("volunteer_id", volunteer.id)
        .order("start_at", { ascending: true });
  
      if (error) {
        console.error("Failed to load time off:", error);
        return;
      }
  
      setEntries(
        (data ?? []).map((row) => ({
          id: row.id,
          start: row.start_at,
          end: row.end_at,
          reason: row.reason ?? undefined,
        }))
      );
    };
  
    load();
  }, [volunteer?.id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  
    if (!start || !end || !volunteer?.id) return;
  
    const startIso = dayjs(start).utc().toISOString();
    const endIso = dayjs(end).utc().toISOString();
  
    if (dayjs(endIso).isBefore(dayjs(startIso))) {
      console.warn("End date must be after start date");
      return;
    }
  
    const { data, error } = await supabaseClient
      .from("time_off")
      .insert([
        {
          volunteer_id: volunteer.id,   
          start_at: startIso,
          end_at: endIso,
          reason: reason.trim() || null,
        },
      ])
      .select("id, start_at, end_at, reason")
      .single();
  
    if (error) {
      console.error("Failed to create time off:", error);
      return;
    }
  
    // Update UI
    setEntries((prev) => [
      ...prev,
      {
        id: data.id,
        start: data.start_at,
        end: data.end_at,
        reason: data.reason ?? undefined,
      },
    ]);
  
    setStart("");
    setEnd("");
    setReason("");
  };

  // Time displayed in military time
  const formatDate = (value: string) => {
    if (!value) return "—";
  
    const d = dayjs(value);
    return d.isValid() ? d.format("DD/MM/YYYY HH:mm") : value;
  };

  return (
    <Box sx={styles.rootBox}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Time off of DAS entirely?
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Enter the time span below.
          </Typography>

          <Card elevation={0} sx={styles.leftCard}>
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
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card elevation={0} sx={styles.rightCard}>
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
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TimeOffPage;
