
// material-ui
import {
  Box,
  Grid,
  Stack,
  Typography,
  useTheme
} from '@mui/material';

// project import
import { useContext, useEffect, useState } from 'react';
import { LoadingContext } from '../../components/contexts/LoadingContext';
import { RefreshContext } from '../../components/contexts/RefreshContext';
import { ventureService, VentureProps } from '../../services/dasVentureService';
import MainCard from '../../components/MainCard';
import { useNavigate } from 'react-router';


const VentureCard: React.FC<VentureProps> = ({ venture }) => {
  const theme = useTheme();
  const { setLoading } = useContext(LoadingContext);
  const [contributors, setContributors] = useState<any[]>([]);
  const navigate = useNavigate();
  let main;
  switch (venture.status) {
    case 'Active':
      main = theme.palette.success.light;
      break;
    case 'Under evaluation':
      main = theme.palette.warning.light;
      break;
    default:
      main = theme.palette.primary.main;
  }

  useEffect(() => {
    setLoading(true);
    ventureService.getById(venture.id)
      .then(proj => ventureService.getContributors(proj)
        .then((resp: any) => setContributors(resp)))
      .finally(() => setLoading(false))
  }, [venture])

  return (
    <Box onClick={() => navigate(`/venture/${venture.id}`)}>
      <MainCard contentSX={{ p: 2.25 }}>
        <Stack margin={0.5}>
          <Stack direction={'row'} justifyContent="space-between">
            <Stack>
              <Typography variant='h5'>{venture.name}</Typography>
              <Typography variant='caption'>{venture.partner}</Typography>
            </Stack>
            {venture.status &&
              <Box
                sx={{
                  alignItems: 'center',
                  padding: '0.5rem',
                  borderRadius: '10%',
                  bgcolor: main
                }}>{venture.status}</Box>
            }
          </Stack>
          <Grid container spacing={2} marginTop={1}>
            <Grid item xs={12}><Typography variant='caption' >Venture Team</Typography></Grid>
            {contributors.map(c =>
              <Grid item xs={6} key={c.id}>
                <Typography >{c.name}</Typography>
              </Grid>
            )}
          </Grid>
        </Stack>
      </MainCard>
    </Box>
  )
};

const VenturesPage = () => {
  const { setLoading } = useContext(LoadingContext);
  const { refresh } = useContext(RefreshContext);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    ventureService.getAll()
      .then((resp: any) => setProjects(resp))
      .finally(() => setLoading(false))
  }, [refresh])

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}><Typography variant='h2'>Digital Aid Projects</Typography></Grid>
        {projects.map(p =>
          <Grid item xs={4} key={p.id}>
            <VentureCard venture={p} />
          </Grid>
        )}
      </Grid>

    </>
  );
};

export default VenturesPage;
