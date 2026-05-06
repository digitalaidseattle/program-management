import { useEffect, useMemo, useState, FormEvent } from "react";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Checkbox,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { DeleteOutlined } from "@ant-design/icons";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { useVolunteer } from "../hooks/useVolunteer";
import { MyMeeting, TimeOffEntry } from "../types/timeOff";
import { formatDate } from "../utils/meetingUtils";
import { timeOffService } from "../services/timeOffService";

dayjs.extend(utc);

const TimeOffPage = () => {
  const [entries, setEntries] = useState<TimeOffEntry[]>([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [reason, setReason] = useState("");
  const [myMeetings, setMyMeetings] = useState<MyMeeting[]>([]);
  const { volunteer } = useVolunteer();

  useEffect(() => {
    const run = async () => {
      if (!volunteer?.id) return;

      try {
        const data = await timeOffService.loadTimeOffEntries(volunteer.id);
        setEntries(data);
      } catch (error) {
        console.error("Failed to load time off:", error);
      }
    };

    run();
  }, [volunteer?.id]);

  useEffect(() => {
    const run = async () => {
      if (!volunteer?.profile_id) return;

      try {
        const data = await timeOffService.loadMyMeetings(volunteer.profile_id);
        setMyMeetings(data);
      } catch (error) {
        console.error("Failed to load my meetings:", error);
      }
    };

    run();
  }, [volunteer?.profile_id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!start || !end || !volunteer?.id || !volunteer?.profile_id) return;

    try {
      const { entry, markedAbsentIds } = await timeOffService.createTimeOff({
        volunteerId: volunteer.id,
        profileId: volunteer.profile_id,
        start,
        end,
        reason,
      });

      setEntries((prev) =>
        [...prev, entry].sort(
          (a, b) => dayjs(a.start).valueOf() - dayjs(b.start).valueOf()
        )
      );

      setMyMeetings((prev) =>
        prev.map((meeting) =>
          markedAbsentIds.includes(meeting.attendee_id)
            ? { ...meeting, status: "absent" }
            : meeting
        )
      );

      setStart("");
      setEnd("");
      setReason("");
    } catch (error) {
      console.error("Failed to create time off:", error);
    }
  };

  const handleDeleteTimeOff = async (entry: TimeOffEntry) => {
    if (!volunteer?.profile_id) return;

    try {
      const { restoredIds } = await timeOffService.deleteTimeOff({
        profileId: volunteer.profile_id,
        entry,
      });

      setEntries((prev) => prev.filter((e) => e.id !== entry.id));

      setMyMeetings((prev) =>
        prev.map((meeting) =>
          restoredIds.includes(meeting.attendee_id)
            ? { ...meeting, status: "going" }
            : meeting
        )
      );
    } catch (error) {
      console.error("Failed to delete time off:", error);
    }
  };

  const toggleAbsent = async (attendeeId: string, makeAbsent: boolean) => {
    const previousMeetings = myMeetings;
    const nextStatus = makeAbsent ? "absent" : "going";

    setMyMeetings((prev) =>
      prev.map((m) =>
        m.attendee_id === attendeeId ? { ...m, status: nextStatus } : m
      )
    );

    try {
      await timeOffService.toggleMeetingAbsent(attendeeId, makeAbsent);
    } catch (error) {
      console.error("Failed to update meeting status:", error);
      setMyMeetings(previousMeetings);
    }
  };

  const timeOffColumns = useMemo<GridColDef<TimeOffEntry>[]>(
    () => [
      {
        field: "start",
        headerName: "Start date",
        flex: 1,
        minWidth: 180,
        valueFormatter: (value) => formatDate(String(value ?? "")),
      },
      {
        field: "end",
        headerName: "End date",
        flex: 1,
        minWidth: 180,
        valueFormatter: (value) => formatDate(String(value ?? "")),
      },
      {
        field: "reason",
        headerName: "Reason",
        flex: 1,
        minWidth: 180,
        renderCell: (
          params: GridRenderCellParams<TimeOffEntry, string | undefined>
        ) => params.value || "—",
      },
      {
        field: "actions",
        headerName: "",
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        align: "right",
        headerAlign: "right",
        width: 70,
        renderCell: (params: GridRenderCellParams<TimeOffEntry>) => (
          <IconButton
            aria-label="delete time off"
            onClick={() => handleDeleteTimeOff(params.row)}
            size="small"
          >
            <DeleteOutlined />
          </IconButton>
        ),
      },
    ],
    []
  );

  const meetingColumns = useMemo<GridColDef<MyMeeting>[]>(
    () => [
      {
        field: "absent",
        headerName: "Absent",
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        width: 90,
        renderCell: (params: GridRenderCellParams<MyMeeting>) => {
          const isAbsent = (params.row.status ?? "").toLowerCase() === "absent";

          return (
            <Checkbox
              checked={isAbsent}
              onChange={(e) =>
                toggleAbsent(params.row.attendee_id, e.target.checked)
              }
            />
          );
        },
      },
      {
        field: "meetingName",
        headerName: "Meeting",
        flex: 1,
        minWidth: 180,
        valueGetter: (_value, row) => row.meeting.name,
      },
      {
        field: "meetingStart",
        headerName: "Time",
        flex: 1,
        minWidth: 180,
        valueGetter: (_value, row) => row.meeting.start_date,
        valueFormatter: (value) => formatDate(String(value ?? "")),
      },
      {
        field: "status",
        headerName: "Status",
        width: 120,
        renderCell: (params: GridRenderCellParams<MyMeeting, string | null>) =>
          params.value ?? "—",
      },
    ],
    []
  );

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Typography variant="h5">Time off of DAS entirely?</Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Enter the time span below.
          </Typography>

          <Card>
            <Box sx={{ height: 420, width: "100%" }}>
              <DataGrid
                rows={entries}
                columns={timeOffColumns}
                getRowId={(row) => row.id}
                disableRowSelectionOnClick
                pageSizeOptions={[5, 10, 25]}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 5, page: 0 },
                  },
                }}
              />
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card>
            <CardHeader
              title="Add time off"
              subheader="Set a start and end date, and optionally add a reason."
            />
            <Divider />

            <Box component="form" onSubmit={handleSubmit} p={2}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Start date"
                    type="datetime-local"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="End date"
                    type="datetime-local"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Reason (optional)"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    multiline
                    minRows={2}
                    size="small"
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={!start || !end}
                  >
                    Add time off
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Card>

          <Box mt={3}>
            <Card>
              <CardHeader
                title="My meetings"
                subheader="Mark meetings you will miss"
              />
              <Divider />

              <Box sx={{ height: 420, width: "100%" }}>
                <DataGrid
                  rows={myMeetings}
                  columns={meetingColumns}
                  getRowId={(row) => row.attendee_id}
                  disableRowSelectionOnClick
                  pageSizeOptions={[5, 10, 25]}
                  initialState={{
                    pagination: {
                      paginationModel: { pageSize: 5, page: 0 },
                    },
                  }}
                />
              </Box>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TimeOffPage;