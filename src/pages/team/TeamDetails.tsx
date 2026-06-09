
// material-ui
import {
  Card,
  CardContent,
  CardHeader,
  Stack
} from '@mui/material';
import { EntityProps } from '../../components/utils';
import { Team } from '../../data/types';
import { VolunteersCard } from './VolunteersCard';

export const CARD_HEADER_SX = { background: "linear-gradient(156.77deg, #7ED321 -11.18%, #F5D76E 111.48%)" }

type TeamDetailsdProps = EntityProps<Team> & {
  editable?: boolean
}

export const TeamDetails: React.FC<TeamDetailsdProps> = ({ entity, onChange, editable = false }) => {
  return (entity &&
    <Card>
      <CardHeader title={entity.name} />
      <CardContent>
        <Stack gap={2}>
          {/* <InfoCard entity={entity} onChange={onChange} /> */}
          <VolunteersCard entity={entity} onChange={onChange} editable={editable} />
        </Stack>
      </CardContent>
    </Card>
  )
}
