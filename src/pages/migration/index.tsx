
// material-ui
import {
  Button,
  Stack
} from '@mui/material';

import { migrationService } from '../../services/migrationService';

const MigrationPage = () => {

  return (
    <Stack gap={1}>
      {Object.keys(migrationService.migrators).map((key: string) =>
        (<Button key={key} onClick={migrationService.migrators[key]}>{key}</Button>)
      )}
    </Stack>
  );
};

export default MigrationPage;
