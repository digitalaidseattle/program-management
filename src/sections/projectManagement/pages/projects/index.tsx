
// material-ui
import {
  Box,
  Chip,
  Grid,
  Stack,
  Tab,
  Tabs,
  Typography
} from '@mui/material';

// project import
import { format } from 'date-fns';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { LoadingContext } from '../../../../components/contexts/LoadingContext';
import { RefreshContext } from '../../../../components/contexts/RefreshContext';
import MainCard from '../../../../components/MainCard';
import { pmProjectService, Project, ProjectProps } from '../../api/pmProjectService';
import VenturesTable from './ProjectsTable';
import ProjectsTable from './ProjectsTable';

const STATUS_COLOR_MAP: any = {
  'Active': 'success',
  'Cancelled': 'warning',
  'Under evaluation': 'primary',
  "Declined": 'danger'
}

const VentureCard: React.FC<ProjectProps> = ({ project }) => {

  const navigate = useNavigate();

  return (project &&
    <Box onClick={() => navigate(`/project/${project.id}`)}>
      <MainCard contentSX={{ p: 2.25 }}>
        <Stack margin={0.5}>
          {project.status &&
            <Chip
              color={STATUS_COLOR_MAP[project.status]}
              label={project.status} />
          }
          <Typography variant='h5'>{project.name}</Typography>
          <Typography  >{project.partner}</Typography>
          <Typography>Start Date: {project.startDate && format(project.startDate, "MMM d yyy")}</Typography>
          <Typography>Contributors: {project.contributorIds.length}</Typography>
          <Typography>Epics: {project.epicIds.length}</Typography>
        </Stack>
      </MainCard>
    </Box>
  )
};


const VENTURE_STATUSES = ['Active'];


const ProjectsPage = () => {

  const { setLoading } = useContext(LoadingContext);
  const { refresh } = useContext(RefreshContext);
  const [tabIndex, setTabIndex] = useState(0);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    pmProjectService.findAll()
      .then((ventures: any[]) =>
        Promise.all(ventures
          .filter(v => VENTURE_STATUSES.includes(v.status))
          .map(v => pmProjectService.getById(v.id)))
          .then(resps => setProjects(resps)))
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
        <ProjectsTable projects={projects} />
      </CustomTabPanel>
      <CustomTabPanel value={tabIndex} index={1}>
        <Grid container spacing={2}>
          {projects.map(p =>
            <Grid item xs={4} key={p.id}>
              <VentureCard project={p} />
            </Grid>
          )}
        </Grid>
      </CustomTabPanel>

    </>
  );
};

export default ProjectsPage;
