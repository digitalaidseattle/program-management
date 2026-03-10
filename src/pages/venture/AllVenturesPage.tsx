import { supabaseClient } from "@digitalaidseattle/supabase";
import { useStorageService } from "@digitalaidseattle/core";
import { Box, Card, CardActionArea, CardContent, Checkbox, FormControl, Grid, InputLabel, ListItemText, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { StatusChip, VENTURE_STATUS_CHIPS } from "../../components/StatusChip";
import { useNavigate } from "react-router-dom";
import { VentureService } from "../../services/dasVentureService";

type VentureRow = {
  id: string;
  airtable_id: string | null;
  partner_id: string | null;
  title: string | null;
  painpoint: string | null;
  status: string | null;
  problem: string | null;
  solution: string | null;
  impact: string | null;
  program_areas: string | null;
  venture_code: string | null;
  partner_airtable_id: string[] | null;
  program_areas_parsed?: string[];
};

const parseProgramAreas = (value: string | null): string[] => {
  if (!value) {
    return [];
  }
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map((v) => String(v)) : [];
  } catch {
    return [];
  }
};

const STATUS_SORT_ORDER = [
  "Active",
  "Delivered",
  "Paused",
  "Ready for consideration",
  "Submitted by Partner",
  "Declined",
] as const;

const statusSortRank = (status: string | null): number => {
  const idx = STATUS_SORT_ORDER.indexOf((status ?? "") as (typeof STATUS_SORT_ORDER)[number]);
  return idx === -1 ? STATUS_SORT_ORDER.length : idx;
};

const AllVenturesPage = () => {
  const storageService = useStorageService()!;
  const navigate = useNavigate();
  const [ventures, setVentures] = useState<VentureRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [programAreaFilter, setProgramAreaFilter] = useState<string[]>([]);

  useEffect(() => {
    const fetchVentures = async () => {
      try {
        const { data, error } = await supabaseClient
          .from("venture")
          .select("*");

        if (error) {
          setError(error.message);
          return;
        }
        setVentures(
          ((data as VentureRow[]) ?? []).map((venture) => ({
            ...venture,
            program_areas_parsed: parseProgramAreas(venture.program_areas),
          }))
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVentures();
  }, []);

  const programAreaOptions = useMemo(() => {
    return Array.from(
      new Set(ventures.flatMap((venture) => venture.program_areas_parsed ?? []))
    ).sort((a, b) => a.localeCompare(b));
  }, [ventures]);

  const filteredVentures = useMemo(() => {
    const search = searchValue.trim().toLowerCase();

    return ventures
      .filter((venture) => {
        const matchesSearch =
          search === "" ||
          (venture.venture_code ?? "").toLowerCase().includes(search) ||
          (venture.painpoint ?? "").toLowerCase().includes(search);

        const matchesStatus =
          statusFilter.length === 0 || statusFilter.includes(venture.status ?? "");

        const matchesProgramArea =
          programAreaFilter.length === 0 ||
          (venture.program_areas_parsed ?? []).some((area) => programAreaFilter.includes(area));

        return matchesSearch && matchesStatus && matchesProgramArea;
      })
      .sort((a, b) => {
        const byStatus = statusSortRank(a.status) - statusSortRank(b.status);
        if (byStatus !== 0) {
          return byStatus;
        }
        return (a.venture_code ?? "").localeCompare(b.venture_code ?? "");
      });
  }, [ventures, searchValue, statusFilter, programAreaFilter]);

  return (
    <Stack spacing={2} sx={{ pt: 2 }}>
      {loading && <Typography>Loading ventures...</Typography>}
      {error && <Typography color="error">Error loading ventures: {error}</Typography>}
      {!loading && !error && ventures.length === 0 && <Typography>No venture rows found.</Typography>}
      {!loading && !error && ventures.length > 0 && (
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            fullWidth
            label="Search ventures"
            placeholder="Search by venture code or painpoint"
            value={searchValue}
            onChange={(evt) => setSearchValue(evt.target.value)}
          />
          <FormControl sx={{ minWidth: 220 }}>
            <InputLabel>Status</InputLabel>
            <Select
              multiple
              label="Status"
              value={statusFilter}
              renderValue={(selected) =>
                selected.length === 0 ? "All statuses" : selected.join(", ")
              }
              onChange={(evt) => setStatusFilter(evt.target.value as string[])}
            >
              {VentureService.STATUSES.map((status) => (
                <MenuItem key={status} value={status}>
                  <Checkbox checked={statusFilter.includes(status)} />
                  <ListItemText primary={status} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 240 }}>
            <InputLabel>Program Area</InputLabel>
            <Select
              multiple
              label="Program Area"
              value={programAreaFilter}
              renderValue={(selected) =>
                selected.length === 0 ? "All program areas" : selected.join(", ")
              }
              onChange={(evt) => setProgramAreaFilter(evt.target.value as string[])}
            >
              {programAreaOptions.map((area) => (
                <MenuItem key={area} value={area}>
                  <Checkbox checked={programAreaFilter.includes(area)} />
                  <ListItemText primary={area} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      )}
      {!loading && !error && filteredVentures.length === 0 && (
        <Typography>No ventures match the current filters.</Typography>
      )}
      <Grid container spacing={2}>
        {filteredVentures.map((venture) => (
          <Grid key={venture.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ height: "100%" }}>
              <CardActionArea onClick={() => navigate(`/ventures/list/${venture.id}`)}>
                <CardContent>
                  <Stack spacing={1.5} alignItems="center">
                    <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
                      {venture.status && VENTURE_STATUS_CHIPS[venture.status]
                        ? VENTURE_STATUS_CHIPS[venture.status]
                        : <StatusChip label={venture.status ?? "Unknown"} color="gray" />}
                    </Box>
                    <Box
                      component="img"
                      src={venture.partner_id ? storageService.getUrl(`logos/${venture.partner_id}`) : undefined}
                      alt={venture.venture_code ?? "Venture"}
                      sx={{
                        width: "100%",
                        maxWidth: "100%",
                        height: 72,
                        objectFit: "contain",
                      }}
                    />
                    <Typography variant="h4" align="center">
                      {venture.venture_code || "Untitled Venture"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      {venture.painpoint || "No painpoint"}
                    </Typography>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

export default AllVenturesPage;
