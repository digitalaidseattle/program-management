/**
 * MapPage.tsx
 * Display information of a ticket
 */

// react

// material-ui
import { HomeOutlined } from "@ant-design/icons";
import {
  Breadcrumbs,
  Card,
  CardHeader
} from '@mui/material';

import {
  IconButton,
  Typography
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import VolunteerMap from './VolunteerMap';

const Labels = {
  title: 'Where in the world is...',
}

const MapPage = () => {
  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <NavLink to="/" ><IconButton size="medium"><HomeOutlined /></IconButton></NavLink>
        <NavLink to={`/volunteers`} >Volunteers</NavLink>
        <Typography color="text.primary">Where</Typography>
      </Breadcrumbs>
      <Card>
        <CardHeader title={Labels.title} />
        <VolunteerMap />
      </Card>
    </>
  );
}

export default MapPage;
