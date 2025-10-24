
// material-ui
import {
  Breadcrumbs,
  Card,
  CardContent,
  CardHeader,
  Link,
  Stack,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Tool, toolService } from '../../services/dasToolsService';
import Markdown from 'react-markdown';
import { EntityProps } from '../../components/utils';


const ToolDetails: React.FC<EntityProps<Tool>> = ({ entity }) => {
  return (entity &&
    <Stack gap={2}>
      <Typography variant='h2'>{entity.name}</Typography>
      <Card>
        <CardHeader title='Overview' />
        <CardContent>
          <Markdown>{entity.overview}</Markdown>
        </CardContent>
      </Card>
      <Card>
        <CardHeader title='Description' />
        <CardContent>
          <Markdown>{entity.description}</Markdown>
        </CardContent>
      </Card>
    </Stack>
  )
}

const ToolPage = () => {
  const [entity, setEntity] = useState<Tool>();
  const { id } = useParams<string>();

  useEffect(() => {
    if (id) {
      refresh();
    }
  }, [id]);

  function refresh() {
    if (id) {
      toolService.getById(id)
        .then((en) => setEntity(en!));
    }
  }

  return (entity &&
    <Stack gap={2}>
      <Breadcrumbs>
        <Link color="inherit" href="/">
          Home
        </Link>
        <Link color="inherit" href="/tools">
          Tools
        </Link>
        <Typography>{entity.name}</Typography>
      </Breadcrumbs>
      <ToolDetails entity={entity} onChange={refresh} />
    </Stack>
  )
}




export { ToolDetails, ToolPage }
