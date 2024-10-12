
// material-ui
import {
  Card,
  CardMedia,
  Stack,
  Typography,
  useTheme
} from '@mui/material';

// project import
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { LoadingContext } from '../../components/contexts/LoadingContext';
import { RefreshContext } from '../../components/contexts/RefreshContext';
import { VentureProps } from '../../services/dasVentureService';
import { projectService } from '../../services/projectService';


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
      <CardMedia
        component='img'
        image={venture.imageSrc ? venture.imageSrc : '../../assets/images/project-image.png'}
        alt={venture.title + " logo"}
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
          <Typography variant='h5'>{venture.title} </Typography>
          <Typography color={statusColor(venture)}>{venture.status}</Typography>
        </Stack>
        <Typography >{venture.partner}</Typography>
        <Typography >{venture.painpoint}</Typography>
        <Typography >{venture.description}</Typography>
      </Stack>
    </Card>
  )
};

const EvaluationsPage = () => {
  const { setLoading } = useContext(LoadingContext);
  const { refresh } = useContext(RefreshContext);
  const [ventures, setVentures] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    projectService.getAllByStatus(['Active', 'Under evaluation', "Declined"])
      .then((ventures: any[]) => setVentures(ventures.filter(v => v.evaluatingTaskGroup)))
      .finally(() => setLoading(false))
  }, [refresh])

  return (
    <>
      <Typography variant='h2'>Digital Aid Projects</Typography>
      <Stack spacing={2}>
        {ventures.map(p =>
          <VentureCard key={p.id} venture={p} />
        )}
      </Stack>
    </>
  );
};

export default EvaluationsPage;
