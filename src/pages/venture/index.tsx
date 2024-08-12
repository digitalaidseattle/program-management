
// material-ui
import {
  Box,
  Grid,
  Stack,
  Tab,
  Tabs,
  Typography
} from '@mui/material';

// project import
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import MainCard from '../../components/MainCard';
import { LoadingContext } from '../../components/contexts/LoadingContext';
import { ventureService } from '../../services/dasVentureService';
import { EpicPanel } from '../../sections/projects/EpicPanel';
import { SprintPanel } from '../../sections/projects/SprintPanel';

type ContributorCardProps = {
  contributor: any,
};

const ContributorCard: React.FC<ContributorCardProps> = ({ contributor }) => (
  <MainCard contentSX={{ p: 2.25 }}>
    <Stack spacing={0.5}>
      <Typography variant="h4">
        {contributor.name}
      </Typography>
      <Grid container alignItems="center">
        <Grid item>
          <Typography variant="h6" color="inherit">
            {contributor.role}
          </Typography>
          <Typography variant="h6" color="inherit">
            {contributor.email}
          </Typography>
        </Grid>
      </Grid>
    </Stack>
  </MainCard>
);


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

const VenturePage = () => {
  const { id } = useParams();
  const { setLoading } = useContext(LoadingContext);

  const [venture, setVenture] = useState<any>();
  const [tabIndex, setTabIndex] = useState(0);


  useEffect(() => {
    setVenture(undefined);
    if (id) {
      setLoading(true);
      ventureService.getById(id)
        .then(async (resp: any) => {
          resp.contributors = await ventureService.getContributors(resp);
          resp.epics = await ventureService.getEpics(resp);
          resp.epics.forEach(async (e: any) => {
            e.features = await ventureService.getFeatures(e);
            e.features.forEach(async (f: any) => {
              f.stories = await ventureService.getStories(f);
              f.stories.forEach(async (s: any) => {
                s.tasks = await ventureService.getTasks(s);
              })
            })
          })
          console.log(resp)
          setVenture(resp);
        })
        .finally(() => setLoading(false))
    }
  }, [id])


  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  return (
    venture && <>
      <Typography variant='h2'>Project: {venture.name}</Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabIndex} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Sprints" {...a11yProps(0)} />
          <Tab label="Epics" {...a11yProps(1)} />
          <Tab label="Contributors" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={tabIndex} index={0}>
        {venture && <SprintPanel venture={venture} />}
      </CustomTabPanel>
      <CustomTabPanel value={tabIndex} index={1}>
        {venture && <EpicPanel venture={venture} />}
      </CustomTabPanel>
      <CustomTabPanel value={tabIndex} index={2}>
        <Stack gap={'0.5rem'}>
          {venture && venture.contributors.map((c: any) => <ContributorCard key={c.id} contributor={c} />)}
        </Stack>
      </CustomTabPanel>
    </>
  );
};

export default VenturePage;
