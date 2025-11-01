
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
import Markdown from 'react-markdown';
import { useParams } from 'react-router';
import { EditField } from '../../components/EditField';
import { EntityProps } from '../../components/utils';
import { Tool, toolService } from '../../services/dasToolsService';

const ToolDetails: React.FC<EntityProps<Tool>> = ({ entity, onChange }) => {

  function update(field: string, value: string): void {
    const changes = JSON.parse(`{ "${field}" : ${JSON.stringify(value)} }`)
    toolService.update(entity.id, changes)
      .then(updated => {
        onChange(updated);
      });
  }

  return (entity &&
    <Card sx={{ padding: 0 }}>
      <CardHeader
        title={
          <EditField
            value={entity.name}
            display={<Typography sx={{ fontSize: 24, fontWeight: 600 }}>{entity.name}</Typography>}
            onChange={(updated: string) => update('name', updated)} />
        }
      />

      <CardContent>
        <EditField
          value={entity.overview}
          header='Overview'
          multiline={true}
          display={<Markdown>{entity.overview ?? 'N/A'}</Markdown>}
          onChange={(newText) => update('overview', newText)} />

        <EditField
          header='Description'
          value={entity.description}
          multiline={true}
          display={<Markdown>{entity.description ?? 'N/A'}</Markdown>}
          onChange={(newText) => update('description', newText)} />

      </CardContent>
    </Card >
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




export { ToolDetails, ToolPage };

