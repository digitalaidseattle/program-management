import { supabaseClient } from "@digitalaidseattle/supabase";
import { useStorageService } from "@digitalaidseattle/core";
import { Box, Card, CardActionArea, CardContent, Grid, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { StatusChip, VENTURE_STATUS_CHIPS } from "../../components/StatusChip";
import { useNavigate } from "react-router-dom";

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
};

const AllVenturesPage = () => {
  const storageService = useStorageService()!;
  const navigate = useNavigate();
  const [ventures, setVentures] = useState<VentureRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchVentures = async () => {
      try {
        const { data, error } = await supabaseClient
          .from("venture")
          .select("*")
          .eq("status", "Active");

        if (error) {
          setError(error.message);
          return;
        }
        setVentures((data as VentureRow[]) ?? []);
      } finally {
        setLoading(false);
      }
    };

    fetchVentures();
  }, []);

  return (
    <Stack spacing={2}>
      {loading && <Typography>Loading ventures...</Typography>}
      {error && <Typography color="error">Error loading ventures: {error}</Typography>}
      {!loading && !error && ventures.length === 0 && <Typography>No active venture rows found.</Typography>}
      <Grid container spacing={2}>
        {ventures.map((venture) => (
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
