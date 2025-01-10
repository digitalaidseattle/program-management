
// material-ui
import {
  Box,
  Grid,
  Stack,
  Tab,
  Tabs,
  Typography,
  useTheme
} from '@mui/material';

// project import
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
<<<<<<< Updated upstream:src/sections/projectManagement/pages/ventures/index.tsx
import { LoadingContext } from '../../../../components/contexts/LoadingContext';
import { RefreshContext } from '../../../../components/contexts/RefreshContext';
import MainCard from '../../../../components/MainCard';
import { pmProjectService, ProjectProps } from '../../api/pmProjectService';
import VenturesTable from './VenturesTable';
=======
import { pmProjectService, ProjectProps } from '../../api/pmProjectService';
import ProjectsTable from './ProjectsTable';
import { MainCard } from '@digitalaidseattle/mui';
import { LoadingContext, RefreshContext } from '@digitalaidseattle/core';
>>>>>>> Stashed changes:src/sections/projectManagement/pages/projects/index.tsx


const VentureCard: React.FC<ProjectProps> = ({ project: venture }) => {
  const theme = useTheme();

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

  return (venture &&
    <Box onClick={() => navigate(`/venture/${venture.id}`)}>
      <MainCard contentSX={{ p: 2.25 }}>
        <Stack margin={0.5}>
          {venture.status &&
            <Box
              sx={{
                alignItems: 'center',
                padding: '0.5rem',
                bgcolor: main
              }}>{venture.status}</Box>
          }
          <Typography variant='h5'>{venture.name}</Typography>
          <Typography  >{venture.partner}</Typography>
          <Typography>Start Date: {venture.startDate}</Typography>
          <Typography>Contributors: {venture.contributorIds.length}</Typography>
          <Typography>Epics: {venture.epicIds.length}</Typography>
        </Stack>
      </MainCard>
    </Box>
  )
};


const VENTURE_STATUSES = ['Active'];

const VenturesPage = () => {

  const { setLoading } = useContext(LoadingContext);
  const { refresh } = useContext(RefreshContext);
  const [tabIndex, setTabIndex] = useState(0);
  const [ventures, setVentures] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    pmProjectService.getAll()
      .then((ventures: any[]) =>
        Promise.all(ventures
          .filter(v => VENTURE_STATUSES.includes(v.status))
          .map(v => pmProjectService.getById(v.id)))
          .then(resps => setVentures(resps)))
      .finally(() => setLoading(false))
  }, [refresh])

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

  function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <Box
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        )}
      </Box>
    );
  }

  return (
    <>
      <Typography variant='h2'>Digital Aid Projects</Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabIndex} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Table" {...a11yProps(0)} />
          <Tab label="Grid" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={tabIndex} index={0}>
        {VenturesTable(ventures)}
      </CustomTabPanel>
      <CustomTabPanel value={tabIndex} index={1}>
        <Grid container spacing={2}>
          {ventures.map(p =>
            <Grid item xs={4} key={p.id}>
              <VentureCard project={p} />
            </Grid>
          )}
        </Grid>
      </CustomTabPanel>

    </>
  );
};

export default VenturesPage;
