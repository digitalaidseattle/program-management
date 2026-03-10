import { BulbOutlined, FireOutlined, LeftOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Avatar, Box, Card, CardContent, CardHeader, Chip, Grid, Link, Stack, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams, GridSortModel } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import VentureReportDisplay from "../../components/VentureReportDisplay";
import { partnerService } from "../../services/dasPartnerService";
import { profileService } from "../../services/dasProfileService";
import { staffingService, Staffing } from "../../services/dasStaffingService";
import { VentureReport, VentureReportService } from "../../services/dasVentureReportService";
import { ventureService, Venture } from "../../services/dasVentureService";
import { PARTNER_STATUS_CHIPS, STAFFING_STATUS_CHIPS, StatusChip, VENTURE_STATUS_CHIPS } from "../../components/StatusChip";

const StaffingPanel = ({ items }: { items: Staffing[] }) => {
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: "status", sort: "desc" }]);

  const columns: GridColDef[] = [
    {
      field: "role.name",
      headerName: "Roles",
      flex: 1,
      minWidth: 220,
      renderCell: (params: GridRenderCellParams) => params.row.role?.name ?? "N/A",
    },
    {
      field: "status",
      headerName: "Status",
      width: 170,
      renderCell: (params: GridRenderCellParams) =>
        params.row.status
          ? STAFFING_STATUS_CHIPS[params.row.status] ?? <StatusChip label={params.row.status} color="gray" />
          : <StatusChip label="N/A" color="red" />,
    },
    {
      field: "volunteer.name",
      headerName: "Volunteer",
      flex: 1,
      minWidth: 260,
      renderCell: (params: GridRenderCellParams) => (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ height: "100%" }}>
          <Avatar
            variant="rounded"
            src={params.row.volunteer ? profileService.getPicUrl(params.row.volunteer.profile!) : undefined}
            sx={{ width: 30, height: 30, objectFit: "contain" }}
          />
          <Typography>{params.row.volunteer ? params.row.volunteer.profile!.name : "Unassigned"}</Typography>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ height: "100%", minHeight: 0 }}>
      <DataGrid
        rows={items}
        columns={columns}
        sortingMode="client"
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        disableRowSelectionOnClick
        autoPageSize
        sx={{
          height: "100%",
          "& .MuiDataGrid-cell": {
            display: "flex",
            alignItems: "center",
          },
          "& .MuiDataGrid-cellContent": {
            lineHeight: "normal",
          },
        }}
      />
    </Box>
  );
};

const VentureDetailsPage = () => {
  const ventureReportService = VentureReportService.instance();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [venture, setVenture] = useState<Venture | null>(null);
  const [staffing, setStaffing] = useState<Staffing[]>([]);
  const [reports, setReports] = useState<VentureReport[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError("Missing venture id.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const [ventureData, staffingData, reportData] = await Promise.all([
          ventureService.getById(id),
          staffingService.findByVentureId(id),
          ventureReportService.findByVentureId(id),
        ]);

        setVenture(ventureData ?? null);
        setStaffing(staffingData ?? []);
        setReports(reportData ?? []);
      } catch (err: any) {
        setError(err?.message ?? "Failed to load venture detail data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, ventureReportService]);

  return (
    <Stack spacing={2}>
      <Grid container spacing={2} columns={{ xs: 12, md: 10 }} alignItems="stretch">
        <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex" }}>
          <Card sx={{ height: "100%", flex: 1 }}>
            <CardHeader
              title={
                <Stack direction="row" spacing={1} alignItems="center">
                  <LeftOutlined style={{ cursor: "pointer" }} onClick={() => navigate("/ventures/list")} />
                  <Typography variant="h5">Venture Details</Typography>
                </Stack>
              }
            />
            <CardContent>
              {error && <Typography color="error">{error}</Typography>}
              {loading && <Typography>Loading venture details...</Typography>}
              {!loading && !error && !venture && <Typography>Venture not found.</Typography>}
              {venture && (
                <Stack spacing={0}>
                  <Stack spacing={0.5}>
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                      <Typography variant="h4">{venture.venture_code || "Untitled Venture"}</Typography>
                      {venture.status && VENTURE_STATUS_CHIPS[venture.status]
                        ? VENTURE_STATUS_CHIPS[venture.status]
                        : <StatusChip label={venture.status ?? "Unknown"} color="gray" />}
                    </Stack>
                    <Typography color="text.secondary">{venture.painpoint || "No painpoint"}</Typography>
                  </Stack>

                  <Stack spacing={2} sx={{ mt: 4 }}>
                    <Stack spacing={0.5}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <QuestionCircleOutlined />
                        <Typography variant="subtitle1" fontWeight={600}>Problem</Typography>
                      </Stack>
                      <Typography sx={{ whiteSpace: "pre-wrap" }}>{venture.problem || "No problem details."}</Typography>
                    </Stack>

                    <Stack spacing={0.5}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <BulbOutlined />
                        <Typography variant="subtitle1" fontWeight={600}>Solution</Typography>
                      </Stack>
                      <Typography sx={{ whiteSpace: "pre-wrap" }}>{venture.solution || "No solution details."}</Typography>
                    </Stack>

                    <Stack spacing={0.5}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <FireOutlined />
                        <Typography variant="subtitle1" fontWeight={600}>Impact</Typography>
                      </Stack>
                      <Typography sx={{ whiteSpace: "pre-wrap" }}>{venture.impact || "No impact details."}</Typography>
                    </Stack>
                  </Stack>

                  <Card variant="outlined" sx={{ mt: 4 }}>
                    <CardHeader title="Partner" />
                    <CardContent>
                      {venture.partner ? (
                        <Stack spacing={1.5}>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            {partnerService.getLogoUrl(venture.partner) ? (
                              <Box
                                component="img"
                                src={partnerService.getLogoUrl(venture.partner)}
                                alt={venture.partner.name}
                                sx={{
                                  height: 52,
                                  width: "auto",
                                  maxWidth: 160,
                                  objectFit: "contain",
                                  display: "block",
                                }}
                              />
                            ) : (
                              <Avatar variant="rounded" sx={{ width: 52, height: 52 }}>
                                {venture.partner.name?.[0] ?? "?"}
                              </Avatar>
                            )}
                            <Stack spacing={0.5}>
                              <Typography fontWeight={700}>{venture.partner.name}</Typography>
                              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                                <Chip size="small" label={venture.partner.type || "Partner"} />
                                {venture.partner.status && PARTNER_STATUS_CHIPS[venture.partner.status]
                                  ? PARTNER_STATUS_CHIPS[venture.partner.status]
                                  : <StatusChip label={venture.partner.status || "Unknown"} color="gray" />}
                              </Stack>
                            </Stack>
                          </Stack>

                          {venture.partner.website && (
                            <Typography variant="body2">
                              <Link href={venture.partner.website} target="_blank" rel="noreferrer" underline="hover">
                                {venture.partner.website}
                              </Link>
                            </Typography>
                          )}

                          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-wrap" }}>
                            {venture.partner.description || "No partner description."}
                          </Typography>

                          {(venture.partner.foci ?? []).length > 0 && (
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                              {(venture.partner.foci ?? []).map((f) => (
                                <Chip key={f} label={f} size="small" />
                              ))}
                            </Stack>
                          )}
                        </Stack>
                      ) : (
                        <Typography color="text.secondary">No partner linked.</Typography>
                      )}
                    </CardContent>
                  </Card>
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }} sx={{ display: "flex" }}>
          <Card sx={{ height: "100%", flex: 1, display: "flex", flexDirection: "column" }}>
            <CardHeader title="Staffing" />
            <CardContent sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", p: 2 }}>
              {loading && <Typography>Loading staffing...</Typography>}
              {!loading && staffing.length === 0 && <Typography>No staffing rows found.</Typography>}
              {!loading && staffing.length > 0 && <StaffingPanel items={staffing} />}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardHeader title="Reports" />
        <CardContent>
          {loading && <Typography>Loading reports...</Typography>}
          {!loading && <VentureReportDisplay reports={reports} />}
        </CardContent>
      </Card>
    </Stack>
  );
};

export default VentureDetailsPage;
