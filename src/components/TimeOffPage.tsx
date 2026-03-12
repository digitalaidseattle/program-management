/**
 *  TimeOffPage.tsx
 *
 */

import { useEffect, useState, FormEvent } from "react";
import {
  Box,
  Button,
  Card,
  CardHeader,
  TextField,
  Typography,
  Table,
  Grid,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Divider,
  Checkbox,
  IconButton,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useVolunteer } from "../hooks/useVolunteer";
import { supabaseClient } from "@digitalaidseattle/supabase";
import * as styles from "./TimeOffPageStyles";

dayjs.extend(utc);

export interface TimeOffEntry {
  id: string;
  start: string;
  end: string;
  reason?: string;
}

type MeetingInfo = {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  type?: string | null;
};

type MyMeeting = {
  attendee_id: string;
  status: string | null;
  meeting: MeetingInfo;
};

type TimeOffRow = {
  id: string;
  start_at: string;
  end_at: string;
  reason: string | null;
};

type MeetingRelation = MeetingInfo | MeetingInfo[] | null;

type MeetingAttendeeRow = {
  id: string;
  status: string | null;
  meeting: MeetingRelation;
};

type MeetingTimeInfo = {
  start_date: string;
  end_date: string;
};

type MeetingTimeRelation = MeetingTimeInfo | MeetingTimeInfo[] | null;

type MeetingOverlapRow = {
  id: string;
  status: string | null;
  meeting: MeetingTimeRelation;
};

const getSingleMeeting = (meeting: MeetingRelation): MeetingInfo | null => {
  if (!meeting) return null;
  return Array.isArray(meeting) ? meeting[0] ?? null : meeting;
};

const getMeetingTime = (
  meeting: MeetingTimeRelation
): MeetingTimeInfo | null => {
  if (!meeting) return null;
  return Array.isArray(meeting) ? meeting[0] ?? null : meeting;
};

const isMeetingOverlapping = (
  startA: string,
  endA: string,
  startB: string,
  endB: string
) => {
  return dayjs(startA).isBefore(dayjs(endB)) && dayjs(endA).isAfter(dayjs(startB));
};

const formatDate = (value: string) => {
  if (!value) return "—";
  const d = dayjs(value);
  return d.isValid() ? d.format("DD/MM/YYYY HH:mm") : value;
};

const TimeOffPage = () => {
  const [entries, setEntries] = useState<TimeOffEntry[]>([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [reason, setReason] = useState("");
  const [myMeetings, setMyMeetings] = useState<MyMeeting[]>([]);
  const { volunteer } = useVolunteer();

  useEffect(() => {
    const loadTimeOff = async () => {
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

      const rows = (data ?? []) as unknown as TimeOffRow[];

      setEntries(
        rows.map((row) => ({
          id: row.id,
          start: row.start_at,
          end: row.end_at,
          reason: row.reason ?? undefined,
        }))
      );
    };

    loadTimeOff();
  }, [volunteer?.id]);

  useEffect(() => {
    const loadMyMeetings = async () => {
      const profileId = volunteer?.profile_id;
      if (!profileId) return;

      const { data, error } = await supabaseClient
        .from("meeting_attendee")
        .select(`
          id,
          status,
          meeting:meeting_id (
            id,
            name,
            start_date,
            end_date,
            type
          )
        `)
        .eq("profile_id", profileId);

      if (error) {
        console.error("Failed to load my meetings:", error);
        return;
      }

      const rows = (data ?? []) as unknown as MeetingAttendeeRow[];

      const normalizedMeetings = rows
        .map((row) => {
          const meeting = getSingleMeeting(row.meeting);
          if (!meeting) return null;

          return {
            attendee_id: row.id,
            status: row.status ?? null,
            meeting,
          };
        })
        .filter((row): row is MyMeeting => row !== null)
        .sort((a, b) =>
          dayjs(a.meeting.start_date).valueOf() - dayjs(b.meeting.start_date).valueOf()
        );

      setMyMeetings(normalizedMeetings);
    };

    loadMyMeetings();
  }, [volunteer?.profile_id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!start || !end || !volunteer?.id || !volunteer?.profile_id) return;

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

    const inserted = data as unknown as TimeOffRow;

    setEntries((prev) =>
      [...prev, {
        id: inserted.id,
        start: inserted.start_at,
        end: inserted.end_at,
        reason: inserted.reason ?? undefined,
      }].sort((a, b) => dayjs(a.start).valueOf() - dayjs(b.start).valueOf())
    );

    setStart("");
    setEnd("");
    setReason("");

    const { data: overlaps, error: overlapErr } = await supabaseClient
      .from("meeting_attendee")
      .select(`
        id,
        status,
        meeting:meeting_id (
          start_date,
          end_date
        )
      `)
      .eq("profile_id", volunteer.profile_id);

    if (overlapErr) {
      console.error("Failed to check meeting overlaps:", overlapErr);
      return;
    }

    const overlapRows = (overlaps ?? []) as unknown as MeetingOverlapRow[];

    const overlappingAttendeeIds = overlapRows
      .map((row) => {
        const meeting = getMeetingTime(row.meeting);
        if (!meeting) return null;

        const status = (row.status ?? "").toLowerCase();

        return isMeetingOverlapping(
          meeting.start_date,
          meeting.end_date,
          startIso,
          endIso
        ) && status !== "absent"
          ? row.id
          : null;
      })
      .filter((id): id is string => id !== null);

    if (overlappingAttendeeIds.length > 0) {
      const { error: updateError } = await supabaseClient
        .from("meeting_attendee")
        .update({ status: "absent" })
        .in("id", overlappingAttendeeIds);

      if (updateError) {
        console.error("Failed to mark meeting absences:", updateError);
        return;
      }

      setMyMeetings((prev) =>
        prev.map((meeting) =>
          overlappingAttendeeIds.includes(meeting.attendee_id)
            ? { ...meeting, status: "absent" }
            : meeting
        )
      );
    }
  };

  const handleDeleteTimeOff = async (entry: TimeOffEntry) => {
    if (!volunteer?.profile_id) return;

    const startIso = entry.start;
    const endIso = entry.end;

    const { data: overlaps, error: overlapErr } = await supabaseClient
      .from("meeting_attendee")
      .select(`
        id,
        status,
        meeting:meeting_id (
          start_date,
          end_date
        )
      `)
      .eq("profile_id", volunteer.profile_id);

    if (overlapErr) {
      console.error("Failed to check meeting overlaps for delete:", overlapErr);
      return;
    }

    const overlapRows = (overlaps ?? []) as unknown as MeetingOverlapRow[];

    const overlappingAbsentIds = overlapRows
      .map((row) => {
        const meeting = getMeetingTime(row.meeting);
        if (!meeting) return null;

        const status = (row.status ?? "").toLowerCase();

        return status === "absent" &&
          isMeetingOverlapping(
            meeting.start_date,
            meeting.end_date,
            startIso,
            endIso
          )
          ? row.id
          : null;
      })
      .filter((id): id is string => id !== null);

    if (overlappingAbsentIds.length > 0) {
      const { error: restoreErr } = await supabaseClient
        .from("meeting_attendee")
        .update({ status: "going" })
        .in("id", overlappingAbsentIds);

      if (restoreErr) {
        console.error("Failed to restore meeting statuses:", restoreErr);
        return;
      }

      setMyMeetings((prev) =>
        prev.map((meeting) =>
          overlappingAbsentIds.includes(meeting.attendee_id)
            ? { ...meeting, status: "going" }
            : meeting
        )
      );
    }

    const { error } = await supabaseClient
      .from("time_off")
      .delete()
      .eq("id", entry.id);

    if (error) {
      console.error("Failed to delete time off:", error);
      return;
    }

    setEntries((prev) => prev.filter((e) => e.id !== entry.id));
  };

  const toggleAbsent = async (attendeeId: string, makeAbsent: boolean) => {
    const nextStatus = makeAbsent ? "absent" : "going";
    const previousMeetings = myMeetings;

    setMyMeetings((prev) =>
      prev.map((m) =>
        m.attendee_id === attendeeId ? { ...m, status: nextStatus } : m
      )
    );

    const { error } = await supabaseClient
      .from("meeting_attendee")
      .update({ status: nextStatus })
      .eq("id", attendeeId);

    if (error) {
      console.error("Failed to update meeting status:", error);
      setMyMeetings(previousMeetings);
    }
  };

  return (
    <Box sx={styles.rootBox}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Typography variant="h5" fontWeight={600}>
            Time off of DAS entirely?
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Enter the time span below.
          </Typography>

          {/* TIME OFF TABLE CARD */}
          <Card elevation={0} sx={styles.leftCard}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={styles.headerCell}>start date</TableCell>
                  <TableCell sx={styles.headerCell}>end date</TableCell>
                  <TableCell sx={styles.headerCell}>reason</TableCell>
                  <TableCell sx={styles.headerCell} align="right" />
                </TableRow>
              </TableHead>

              <TableBody>
                {entries.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} sx={styles.emptyCell}>
                      No time off added yet.
                    </TableCell>
                  </TableRow>
                )}

                {entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{formatDate(entry.start)}</TableCell>
                    <TableCell>{formatDate(entry.end)}</TableCell>
                    <TableCell>{entry.reason || "—"}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        aria-label="delete time off"
                        onClick={() => handleDeleteTimeOff(entry)}
                        size="small"
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          {/* ADD TIME OFF CARD */}
          <Card elevation={0} sx={styles.rightCard}>
            <CardHeader
              title="Add time off"
              subheader="Set a start and end date, and optionally add a reason."
              sx={{ px: 0, pb: 0 }}
            />

            <Divider sx={styles.rightDivider} />

            <Box component="form" onSubmit={handleSubmit} sx={styles.formBox}>
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

          {/* MY MEETINGS CARD */}
          <Card elevation={0} sx={styles.leftCard}>
            <CardHeader
              title="My meetings"
              subheader="Mark meetings you will miss"
              sx={{ pb: 0 }}
            />
            <Divider sx={{ mx: 2, my: 2 }} />

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={styles.headerCell}>absent</TableCell>
                  <TableCell sx={styles.headerCell}>meeting</TableCell>
                  <TableCell sx={styles.headerCell}>time</TableCell>
                  <TableCell sx={styles.headerCell}>status</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {myMeetings.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} sx={styles.emptyCell}>
                      No meetings found.
                    </TableCell>
                  </TableRow>
                )}

                {myMeetings.map((row) => {
                  const isAbsent = (row.status ?? "").toLowerCase() === "absent";

                  return (
                    <TableRow key={row.attendee_id}>
                      <TableCell>
                        <Checkbox
                          checked={isAbsent}
                          onChange={(e) =>
                            toggleAbsent(row.attendee_id, e.target.checked)
                          }
                        />
                      </TableCell>
                      <TableCell>{row.meeting.name}</TableCell>
                      <TableCell>
                        {formatDate(row.meeting.start_date)}
                      </TableCell>
                      <TableCell>{row.status ?? "—"}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TimeOffPage;