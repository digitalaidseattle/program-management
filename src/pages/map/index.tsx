/**
 * MapPage.tsx
 * Display information of a ticket
 */

// react

// material-ui
import {
  Card,
  CardHeader
} from '@mui/material';

import VolunteerMap from './VolunteerMap';

const Labels = {
  title: 'Where in the world is...',
}

const MapPage = () => {
  return (
    <Card>
      <CardHeader title={Labels.title} />
      <VolunteerMap />
    </Card>
  );
}

export default MapPage;
