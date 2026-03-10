import { supabaseClient } from "@digitalaidseattle/supabase";
import { Card, CardContent, CardHeader, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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

const DB_COLUMNS: (keyof VentureRow)[] = [
  "id",
  "airtable_id",
  "partner_id",
  "title",
  "painpoint",
  "status",
  "problem",
  "solution",
  "impact",
  "program_areas",
  "venture_code",
  "partner_airtable_id",
];

const formatValue = (value: unknown): string => {
  if (value === null || value === undefined) {
    return "null";
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
};

const VentureDetailsRawPage = () => {
  const { id } = useParams<{ id: string }>();
  const [venture, setVenture] = useState<VentureRow | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Missing venture id.");
      return;
    }

    supabaseClient
      .from("venture")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          setError(error.message);
          return;
        }
        setVenture((data as VentureRow) ?? null);
      });
  }, [id]);

  return (
    <Card>
      <CardHeader title="Venture Details" />
      <CardContent>
        {error && <Typography color="error">{error}</Typography>}
        {!error && !venture && <Typography>Loading venture details...</Typography>}
        {venture && (
          <Stack spacing={0.75}>
            {DB_COLUMNS.map((column) => (
              <Typography key={column}>
                {column}: {formatValue(venture[column])}
              </Typography>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default VentureDetailsRawPage;
