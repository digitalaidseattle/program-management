
// material-ui
import {
  Card,
  CardContent,
  CardHeader,
  Stack
} from '@mui/material';
import Markdown from "react-markdown";
import { EntityProps } from '../../components/utils';
import { Team } from '../../data/types';

export const CARD_HEADER_SX = { background: "linear-gradient(156.77deg, #7ED321 -11.18%, #F5D76E 111.48%)" }

export const InfoCard: React.FC<EntityProps<Team>> = ({ entity }) => {
  return (entity &&
    <Stack gap={1}>
      <Card>
        <CardHeader title="Purpose" />
        <CardContent>
          <Markdown>{entity.purpose}</Markdown>
        </CardContent>
        <CardHeader title="What is NOT included in this Team?" />
        <CardContent>
          <Markdown>{entity.not_included}</Markdown>
        </CardContent>
        <CardHeader title="New to the team?" />
        <CardContent>
          <Markdown>{entity.welcome_message}</Markdown>
        </CardContent>
        <CardHeader title="Slack" />
        <CardContent>
          <Markdown>{entity.slack_channel}</Markdown>
        </CardContent>
      </Card>
    </Stack>
  )
}
