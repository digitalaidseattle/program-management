
// material-ui
import {
  Breadcrumbs,
  Link,
  Stack,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Tool, toolService } from '../../services/dasToolsService';
import { ToolDetails } from './ToolDetails';


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
        <Link color="inherit" href="/data/tools">
          Tools
        </Link>
        <Typography>{entity.name}</Typography>
      </Breadcrumbs>
      <ToolDetails entity={entity} onChange={refresh} />
    </Stack>
  )
}




export { ToolPage };

