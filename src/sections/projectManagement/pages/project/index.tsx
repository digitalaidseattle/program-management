
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
import { TabPanel } from '../../../../components/TabPanel';
import { LoadingContext } from '../../../../components/contexts/LoadingContext';
import { Epic, Feature, pmEpicService, pmFeatureService, pmProjectService, pmStoryService, pmTaskService, Project, Story } from '../../api/pmProjectService';
import { ContributorPanel } from '../../components/ContributorPanel';
import { EpicPanel } from '../../components/EpicPanel';
import { ProjectContext } from '../../components/ProjectContext';
import { SprintPanel } from '../../components/SprintPanel';



const ProjectPage = () => {
  const { id } = useParams();
  const { setLoading } = useContext(LoadingContext);

  const [project, setProject] = useState<Project>();
  const [tabIndex, setTabIndex] = useState(1);

  useEffect(() => {
    setProject(undefined);
    if (id) {
      setLoading(true);
      loadProject(id)
        .then(proj => setProject(proj))
        .finally(() => setLoading(false))
    }
  }, [id])

  // const loadProject1 = async (id: string): Promise<Project> => {
  //   const proj = await pmProjectService.getById(id);
  //   proj.epics = await pmEpicService.findByProject(proj)
  //   proj.epics.forEach(async (epic: Epic) => {
  //     epic.features = await pmFeatureService.findByEpic(epic)
  //     epic.features.forEach(async (feature: Feature) => {
  //       feature.stories = await pmStoryService.findByFeature(feature)
  //       feature.stories.forEach(async (story: Story) => {
  //         story.tasks = await pmTaskService.findByStory(story);
  //       })
  //     })
  //   })
  //   return proj;
  // }

  const loadProject = async (id: string): Promise<Project> => {
    const proj = await pmProjectService.getById(id);
    proj.epics = await pmEpicService.findByProject(proj)
    await Promise
      .all(proj.epics.map((epic: Epic) => pmFeatureService.findByEpic(epic)))
      .then(async fResps => {
        for (let f = 0; f < fResps.length; f++) {
          proj.epics[f].features = fResps[f];
          await Promise
            .all(proj.epics[f].features.map(feature => pmStoryService.findByFeature(feature)))
            .then(async sResps => {
              for (let s = 0; s < sResps.length; s++) {
                proj.epics[f].features[s].stories = sResps[s];
                await Promise
                  .all(proj.epics[f].features[s].stories.map(story => pmTaskService.findByStory(story)))
                  .then(async tResps => {
                    for (let t = 0; t < tResps.length; t++) {
                      proj.epics[f].features[s].stories[t].tasks = tResps[t]
                    }
                  })
              }
            })
        }
      })
    return proj;
  }


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
    project && <>
      <ProjectContext.Provider value={{ project, setProject }} >
        <Typography variant='h2'>Project: {project.name}</Typography>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabIndex} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Sprints" {...a11yProps(0)} />
            <Tab label="Epics" {...a11yProps(1)} />
            <Tab label="Contributors" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel value={tabIndex} index={0}>
          {project && <SprintPanel />}
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          {project && <EpicPanel />}
        </TabPanel>
        <TabPanel value={tabIndex} index={2}>
          {project && <ContributorPanel />}
        </TabPanel>
      </ProjectContext.Provider>
    </>
  );
};

export default ProjectPage;
