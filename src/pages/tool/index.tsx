
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


const ToolPage = () => {
  const [entity, setEntity] = useState<Tool>();
  const { id } = useParams<string>();

  useEffect(() => {
    if (id) {
      toolService.getById(id)
        .then((en) => {
          console.log(en)
          setEntity(en!)
        });
    }
  }, [id]);

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

export default ToolPage;
