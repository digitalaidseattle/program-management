
// material-ui
import { InputForm, InputOption } from '@digitalaidseattle/mui';
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography
} from '@mui/material';
import { storageService } from '../../App';
import { EditField } from '../../components/EditField';
import { UploadImage } from '../../components/UploadImage';
import { EntityProps } from '../../components/utils';
import { Tool, toolService } from '../../services/dasToolsService';

const ToolDetails: React.FC<EntityProps<Tool>> = ({ entity, onChange }) => {

  const fields = [
    {
      name: 'status', label: 'Status', type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' }
      ]
    },
    {
      name: 'overview', label: 'Overview', type: 'string', size: 4
    },
    {
      name: 'description', label: 'Description', type: 'string', size: 12
    },

  ] as InputOption[];

  function handleChange(field: string, value: any) {
    if (entity) {
      const changes = JSON.parse(`{ "${field}" : ${JSON.stringify(value)} }`);
      toolService.update(entity.id, changes)
        .then(updated => onChange(updated));
    }
  }

  function handlePicChange(files: File[]) {
    if (entity) {
      files.forEach((file: File) => {
        const location = toolService.getNextLocation(entity);
        storageService.upload(location, file)
          .then(() => {
            toolService.update(entity.id, { logo: location })
              .then(updated => toolService.getById(updated.id)
                .then(refreshed => onChange(refreshed)));
          })
      })
    }
  }

  return (entity &&
    <Card sx={{ padding: 0 }}>
      <CardHeader
        title={
          <EditField
            value={entity.name}
            display={<Typography sx={{ fontSize: 24, fontWeight: 600 }}>{entity.name}</Typography>}
            onChange={(updated: string) => handleChange('name', updated)} />
        }
      />
      <CardContent>
        <Grid container spacing={2}>
          <Grid size={2}>
            <UploadImage
              url={toolService.getLogoUrl(entity)}
              onChange={handlePicChange} />
          </Grid>
          <Grid size={10}>
            <InputForm entity={entity} inputFields={fields} onChange={handleChange} />
          </Grid>
        </Grid>
      </CardContent>
    </Card >
  )

}

export { ToolDetails };

