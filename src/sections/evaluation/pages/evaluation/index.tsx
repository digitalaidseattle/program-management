
// material-ui
import {
  Box,
  Tab,
  Tabs,
  Typography
} from '@mui/material';

// project import
import { LoadingContext } from '@digitalaidseattle/core';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { TabPanel } from '../../../../components/TabPanel';
import { dasProjectService } from '../../api/dasProjectService';
import { dasTaskGroupService } from '../../api/dasTaskGroupService';
import { Team, TeamContext, useTeams } from '../../api/dasTeamsService';
import { VentureContext } from '../../api/dasProjectService';
import { InfoPanel } from './infoPanel';
import { MeetingsPanel } from './meetingsPanel';
import { StaffingPanel } from './staffingPanel';
import { TasksPanel } from './tasksPanel';

const EvaluationPage = () => {
  const { setLoading } = useContext(LoadingContext);
  const [venture, setVenture] = useState<any>();
  const [tabIndex, setTabIndex] = useState(0);
  const [team, setTeam] = useState<Team>();
  const teams = useTeams();

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setLoading(true);
      dasProjectService.getById(id)
        .then((venture) => {
          dasTaskGroupService.getById(venture.evaluatingTaskGroup)
            .then((tgs: any) => setVenture(Object.assign(venture, { taskGroup: tgs })))
        })
        .finally(() => setLoading(false))
    }
  }, [id])

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
      <VentureContext.Provider value={{ venture, setVenture }}>
        <TeamContext.Provider value={{ team, setTeam }}>
          <Typography variant='h2'>Venture Evaluation: {venture.ventureCode}</Typography>
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
      </VentureContext.Provider>
    </>


  );
};

export default EvaluationPage;
