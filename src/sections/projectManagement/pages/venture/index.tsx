
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
import MainCard from '../../../../components/MainCard';
import { TabPanel } from '../../../../components/TabPanel';
import { LoadingContext } from '../../../../components/contexts/LoadingContext';
import { pmProjectService } from '../../api/pmProjectService';
import { EpicPanel } from '../../components/EpicPanel';
import { SprintPanel } from '../../components/SprintPanel';

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


const VenturePage = () => {
  const { id } = useParams();
  const { setLoading } = useContext(LoadingContext);

  const [venture, setVenture] = useState<any>();
  const [tabIndex, setTabIndex] = useState(0);


  useEffect(() => {
    setVenture(undefined);
    if (id) {
      setLoading(true);
      pmProjectService.getById(id)
        .then(async (resp: any) => {
          resp.contributors = await pmProjectService.getContributors(resp);
          resp.epics = await pmProjectService.getEpics(resp);
          resp.epics.forEach(async (e: any) => {
            e.features = await pmProjectService.getFeatures(e);
            e.features.forEach(async (f: any) => {
              f.stories = await pmProjectService.getStories(f);
              f.stories.forEach(async (s: any) => {
                s.tasks = await pmProjectService.getTasks(s);
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
      <TabPanel value={tabIndex} index={0}>
        {venture && <SprintPanel project={venture} />}
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        {venture && <EpicPanel project={venture} />}
      </TabPanel>
      <TabPanel value={tabIndex} index={2}>
        <Stack gap={'0.5rem'}>
          {venture && venture.contributors.map((c: any) => <ContributorCard key={c.id} contributor={c} />)}
        </Stack>
      </TabPanel>
    </>
  );
};

export default VenturePage;
