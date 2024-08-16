
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
import { LoadingContext } from '../../components/contexts/LoadingContext';
import { RefreshContext } from '../../components/contexts/RefreshContext';
import { dasTaskGroupService } from '../../services/dasTaskGroupService';
import { projectService } from '../../services/projectService';
import { InfoPanel } from './InfoPanel';
import { StaffingPanel } from './staffingPanel';
import { TasksPanel } from './tasksPanel';
import { TabPanel } from '../../components/TabPanel';

const EvaluationPage = () => {
  const { setLoading } = useContext(LoadingContext);
  const { refresh } = useContext(RefreshContext);
  const [venture, setVenture] = useState<any>();
  const [tabIndex, setTabIndex] = useState(0);

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setLoading(true);
      projectService.getById(id)
        .then((venture: any) => {
          dasTaskGroupService.getById(venture.evaluatingTaskGroup)
            .then((tgs: any) => setVenture(Object.assign(venture, { taskGroup: tgs })))
            .finally(() => setLoading(false))
        })
        .finally(() => setLoading(false))
    }
  }, [id, refresh])


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
      <Typography variant='h2'>Venture Evaluation: {venture.title}</Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabIndex} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Info" {...a11yProps(0)} />
          <Tab label="Tasks" {...a11yProps(1)} />
          <Tab label="Staffing" {...a11yProps(2)} />
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
    </>


  );
};

export default EvaluationPage;
