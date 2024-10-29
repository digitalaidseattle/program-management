
// material-ui
import {
  Box,
  Tab,
  Tabs,
  Typography
} from '@mui/material';

// project import
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { LoadingContext } from '../../../../components/contexts/LoadingContext';
import { RefreshContext } from '../../../../components/contexts/RefreshContext';
import { dasTaskGroupService } from '../../api/dasTaskGroupService';
import { dasProjectService } from '../../api/dasProjectService';
import { StaffingPanel } from './staffingPanel';
import { TasksPanel } from './tasksPanel';
import { TabPanel } from '../../../../components/TabPanel';
import { MeetingsPanel } from './meetingsPanel';
import { Team, TeamContext, useTeams } from '../../api/dasTeamsService';
import { InfoPanel } from './infoPanel';

const EvaluationPage = () => {
  const { setLoading } = useContext(LoadingContext);
  const { refresh } = useContext(RefreshContext);
  const [venture, setVenture] = useState<any>();
  const [tabIndex, setTabIndex] = useState(0);
  const [team, setTeam] = useState<Team>();
  const teams = useTeams();

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setLoading(true);
      dasProjectService.getById(id)
        .then((venture: any) => {
          dasTaskGroupService.getById(venture.evaluatingTaskGroup)
            .then((tgs: any) => setVenture(Object.assign(venture, { taskGroup: tgs })))
            .finally(() => setLoading(false))
        })
        .finally(() => setLoading(false))
    }
  }, [id, refresh])

  useEffect(() => {
    if (teams && teams.data) {
      setTeam(teams.data.find(t => t.name === 'Venture Evaluation Structure'))
    }
  }, [teams])


  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  return (venture &&
    <>
      <TeamContext.Provider value={{ team, setTeam }}>
        <Typography variant='h2'>Venture Evaluation: {venture.title}</Typography>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabIndex} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Info" {...a11yProps(0)} />
            <Tab label="Tasks" {...a11yProps(1)} />
            <Tab label="Staffing" {...a11yProps(2)} />
            <Tab label="Meetings" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel value={tabIndex} index={0}>
          <InfoPanel venture={venture} />
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <TasksPanel venture={venture} />
        </TabPanel>
        <TabPanel value={tabIndex} index={2}>
          <StaffingPanel venture={venture} />
        </TabPanel>
        <TabPanel value={tabIndex} index={3}>
          <MeetingsPanel venture={venture} />
        </TabPanel>
      </TeamContext.Provider>
    </>


  );
};

export default EvaluationPage;
