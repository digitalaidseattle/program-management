
// material-ui
import {
  Box,
  Card,
  CardActionArea,
  CardMedia,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
  useTheme
} from '@mui/material';

// project import
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { dasProjectService, VentureProps } from '../../api/dasProjectService';
import placeholder from '../../../../assets/images/project-image.png';
import { LoadingContext, RefreshContext } from '@digitalaidseattle/core';

const VentureCard: React.FC<VentureProps> = ({ venture }) => {
  const theme = useTheme();

  const statusColor = (venture: any) => {
    switch (venture.status) {
      case 'Active':
        return theme.palette.success.main;
      case 'Under evaluation':
        return theme.palette.warning.main;
      case 'Declined':
        return theme.palette.error.main;
      default:
        return theme.palette.primary.main;
    }
  }

  const navigate = useNavigate();


  return (
    <Card sx={{ display: 'flex', padding: '2' }} onClick={() => navigate(`/evaluation/${venture.id}`)}>
      <CardActionArea>
        <Stack direction={'row'}>
          <CardMedia
            component='img'
            image={venture.partner.logoUrl ? venture.partner.logoUrl : placeholder}
            alt={venture.partner.name + " logo"}
            sx={{
              objectFit: 'contain',
              width: { md: '7rem', lg: 200 },
              aspectRatio: '1 / 1',
              borderRadius: '8px',
              display: { xs: 'none', md: 'block' },
              backgroundColor: 'white',
            }}
          />
          <Stack margin={1} spacing={1}>
            <Stack direction={'row'} spacing={{ xs: 1, sm: 2, md: 4 }}>
              <Typography variant='h5'>{venture.ventureCode} </Typography>
              <Typography color={statusColor(venture)}>{venture.status}</Typography>
            </Stack>
            <Typography >{venture.partner.name}</Typography>
            <Typography >{venture.painpoint}</Typography>
            <Typography >{venture.partner.description}</Typography>
          </Stack>
        </Stack>
      </CardActionArea>
    </Card>
  )
};

const EvaluationsPage = () => {
  const { setLoading } = useContext(LoadingContext);
  const { refresh, setRefresh } = useContext(RefreshContext);
  const [ventures, setVentures] = useState<any[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['Under evaluation']);

  // This allows quick access to more projects in DEV
  const statuses = ['Active', 'Under evaluation', 'Declined'];
  // const statuses = ['Under evaluation'];
  useEffect(() => {
    setLoading(true);
    dasProjectService.getAllByStatus(statuses)
      .then((ventures: any[]) => {
        setVentures(ventures
          .filter(v => v.evaluatingTaskGroup && selectedStatuses.includes(v.status))
          .sort((v1, v2) => v1.ventureCode.localeCompare(v2.ventureCode)))
      })
      .finally(() => setLoading(false))
  }, [refresh])

  const handleChange = (event: SelectChangeEvent<typeof selectedStatuses>) => {
    const {
      target: { value },
    } = event;
    setSelectedStatuses(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
    setRefresh(refresh + 1)
  };

  return (
    <>
      <Stack sx={{ justifyContent: "space-between" }} direction={'row'} useFlexGap>
        <Typography variant='h2'>Digital Aid Projects</Typography>
        <Box>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="status-label">Evaluation Status</InputLabel>
            <Select
              label='Evaluation Status'
              labelId="status-label"
              id="demo-multiple-name"
              multiple
              value={selectedStatuses}
              onChange={handleChange}
              input={<OutlinedInput label="Name" />}
            >
              {statuses.map((status) => (
                <MenuItem
                  key={status}
                  value={status}
                >
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Stack>
      <Stack spacing={2}>
        {ventures.length > 0 && ventures.map(p =>
          <VentureCard key={p.id} venture={p} />
        )}
        {ventures.length === 0 &&
          <Typography variant='h4'>No Ventures with the selected status.</Typography>
        }
      </Stack>
    </>
  );
};

export default EvaluationsPage;
