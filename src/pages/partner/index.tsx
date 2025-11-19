import {
  Avatar,
  Box,
  Breadcrumbs,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  Link,
  Paper,
  Stack,
  Typography
} from '@mui/material';
import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router';
import { useStorageService } from '@digitalaidseattle/core';
import { partnerService, Partner, Contact } from '../../services/dasPartnerService';
import { EntityProps } from '../../components/utils';

// Row layout
const FieldRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <Stack direction="row" gap={2} alignItems="flex-start">
    <Box sx={{ width: 180 }}>
      <Typography variant="body2" color="text.primary">
        {label}
      </Typography>
    </Box>
    <Box sx={{ flex: 1 }}>{children}</Box>
  </Stack>
);

// DAS relationship with partner color
const statusColor = (status?: string) => {
  if (!status) return 'default' as const;
  const s = status.toLowerCase();
  if (s.includes('cold')) return 'default' as const;
  if (s.includes('warm')) return 'warning' as const;
  if (s.includes('hot') || s.includes('active')) return 'success' as const;
  return 'default' as const;
};

// External links
const External = ({ href, children }: { href?: string; children: React.ReactNode }) =>
  href ? (
    <Link href={href} target="_blank" rel="noreferrer" underline="hover">
      <Stack direction="row" gap={0.5} alignItems="center">
        <span>{children}</span>
      </Stack>
    </Link>
  ) : (
    <Typography color="text.disabled">—</Typography>
  );

const PartnerDetails: React.FC<EntityProps<Partner>> = ({ entity: partner }) => {
  const storage = useStorageService()!;
  const logo_url = storage.getUrl(`logos/${partner.id}`);

  const contacts: Contact[] = useMemo(() => {
    const list =
      (partner as any)?.contact ??
      [];
    return Array.isArray(list) ? list.filter(Boolean) : [];
  }, [partner]);

  return (
    partner && (
      <Stack gap={2}>
        <Typography variant="h5" fontWeight={700}>
          {partner.name}
        </Typography>

        <Grid container spacing={2}>
          {/* Left Column */}
          <Grid size={6} >
            <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
              <Stack gap={2}>
                {/* Partner logo */}
                <Box
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    bgcolor: 'grey.50',
                    border: (t) => `1px solid ${t.palette.divider}`,
                    height: { xs: 180, sm: 220, md: 240 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2,
                  }}
                >
                  <Avatar
                    src={logo_url}
                    alt={partner.name}
                    variant="rounded"
                    sx={{
                      borderRadius: 3,
                      width: '100%',
                      height: '100%',
                      fontSize: 48,
                      bgcolor: 'grey.100',
                      color: 'text.secondary',
                      '& .MuiAvatar-img': {
                        objectFit: 'contain',
                        width: '100%',
                        height: '100%',
                      },
                    }}
                  >
                    {partner.name?.[0] ?? '?'}
                  </Avatar>
                </Box>

                {/* Partner info */}
                <Stack gap={2}>
                  <FieldRow label="Org name">
                    <Typography>{partner.name}</Typography>
                  </FieldRow>

                  <FieldRow label="Website">
                    <External href={partner.website}>{partner.website}</External>
                  </FieldRow>

                  <FieldRow label="Status">
                    <Chip
                      label={partner.status || '—'}
                      color={statusColor(partner.status)}
                      variant="filled"
                      sx={{ fontWeight: 500 }}
                    />
                  </FieldRow>

                  <FieldRow label="Hubspot ID">
                    {(() => {
                      const link = partner.hubspot_link;
                      if (!link) return <Typography color="text.disabled">–</Typography>;
                      const match = link.match(/\/0-2\/(\d+)$/);
                      const hubspotId = match?.[1];
                      return hubspotId ? (
                        <Link href={link} target="_blank" rel="noreferrer" underline="hover">
                          {hubspotId}
                        </Link>
                      ) : (
                        <Typography color="text.disabled">—</Typography>
                      );
                    })()}
                  </FieldRow>

                  <Divider />

                  <FieldRow label="Org description FOR DAS WEBSITE">
                    <Typography color={partner.description ? 'text.primary' : 'text.disabled'}>
                      {partner.description || '—'}
                    </Typography>
                  </FieldRow>

                  <FieldRow label="Internal thoughts">
                    <Typography color={partner.internal_thoughts ? 'text.primary' : 'text.disabled'}>
                      {partner.internal_thoughts || '—'}
                    </Typography>
                  </FieldRow>

                  <FieldRow label="Foci">
                    <Stack direction="row" gap={1} flexWrap="wrap">
                      {(partner.foci || []).length ? (
                        partner.foci!.map((f) => <Chip key={f} label={f} size="small" />)
                      ) : (
                        <Typography color="text.disabled">—</Typography>
                      )}
                    </Stack>
                  </FieldRow>

                  <FieldRow label="Internal Champion">
                    <Typography color={partner.internal_champion ? 'text.primary' : 'text.disabled'}>
                      {partner.internal_champion || 'No volunteers'}
                    </Typography>
                  </FieldRow>

                  <FieldRow label="Org shorthand">
                    <Typography color={partner.shorthand_name ? 'text.primary' : 'text.disabled'}>
                      {partner.shorthand_name || '—'}
                    </Typography>
                  </FieldRow>
                </Stack>
              </Stack>
            </Paper>
          </Grid>

          {/* Right Column */}
          <Grid size={6}>
            <Stack gap={2}>
              {/* Contacts */}
              <Card variant="outlined">
                <CardHeader title="Contacts" />
                <CardContent>
                  {contacts.length ? (
                    <Stack gap={2}>
                      {contacts.map((c, i) => {
                        const key = c.id || c.email || String(i);
                        return (
                          <Stack key={key} direction="row" gap={2} alignItems="center">
                            <Avatar
                              src={c.pic}
                              sx={{
                                width: 56,
                                height: 56,
                                fontSize: 24,
                                bgcolor: 'grey.200',
                                color: 'text.secondary',
                              }}>{c.name?.[0]}</Avatar>
                            <Box>
                              <Typography fontWeight={600}>{c.name || '—'}</Typography>
                              <Typography variant="body2" color={c.title ? 'text.primary' : 'text.disabled'}>
                                {c.title || '—'}
                              </Typography>
                              <Stack direction="row" gap={2} mt={0.5}>
                                <Typography variant="body2">
                                  {c.email ? (
                                    <External href={`mailto:${c.email}`}>{c.email}</External>
                                  ) : (
                                    <Typography color="text.disabled">—</Typography>
                                  )}
                                </Typography>
                              </Stack>
                            </Box>
                          </Stack>
                        );
                      })}
                    </Stack>
                  ) : (
                    <Typography color="text.disabled">No contacts</Typography>
                  )}

                  <Divider sx={{ my: 2 }} />

                  {/* Org general contact */}
                  <FieldRow label="General email">
                    <External href={partner.ally_utility ? `mailto:${partner.ally_utility}` : undefined}>
                      {partner.ally_utility || '—'}
                    </External>
                  </FieldRow>

                  <FieldRow label="General phone">
                    <Typography color={partner.general_phone ? 'text.primary' : 'text.disabled'}>
                      {partner.general_phone || '—'}
                    </Typography>
                  </FieldRow>
                </CardContent>
              </Card>

              {/* Google drive and overview link */}
              <Card variant="outlined">
                <CardHeader title="Links" />
                <CardContent>
                  <FieldRow label="Gdrive link URL">
                    <Stack gap={0.5}>
                      <External href={partner.gdrive_link}>Open folder</External>
                    </Stack>
                  </FieldRow>

                  <Divider sx={{ my: 1.5 }} />

                  <FieldRow label="Overview link">
                    <Stack gap={0.5}>
                      <External href={partner.overview_link}>Open overview</External>
                    </Stack>
                  </FieldRow>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    )
  );
};

const PartnerPage = () => {
  const [entity, setEntity] = useState<Partner>();
  const { id } = useParams<string>();

  useEffect(() => {
    refresh();
  }, [id]);

  function refresh() {
    if (id) {
      partnerService.getById(id)
        .then((en) => setEntity(en!));
    }
  }

  return (entity &&
    <Stack gap={3}>
      <Breadcrumbs>
        <Link color="inherit" href="/">
          Home
        </Link>
        <Link color="inherit" href="/partners">
          Partners
        </Link>
        <Typography>{entity.name}</Typography>
      </Breadcrumbs>
      <PartnerDetails entity={entity} onChange={refresh} />
    </Stack>
  )
}
export { PartnerDetails, PartnerPage };
