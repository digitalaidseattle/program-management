
// material-ui
import { InputForm, InputOption } from '@digitalaidseattle/mui';
import {
  Box,
  Breadcrumbs,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Link,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { EditField } from '../../components/EditField';
import { EntityProps } from '../../components/utils';
import { Role, roleService } from '../../services/dasRoleService';
import { storageService } from '../../App';

const RoleDetails: React.FC<EntityProps<Role>> = ({ entity, onChange }) => {
  const [role, setRole] = useState<Role>();

  useEffect(() => {
    setRole(entity);
  }, [entity]);

  const fields: InputOption[] = [
    {
      name: "name",
      label: 'Name',
      type: 'string',
      disabled: false,
    },
    {
      name: "status",
      label: 'Status',
      type: 'select',
      disabled: false,
      options: roleService.STATUSES.map(e => ({ value: e, label: e }))
    },
    {
      name: "urgency",
      label: 'Urgency',
      type: 'rating',
      disabled: false,
    },
  ];

  const optionalFields: InputOption[] = [
    {
      name: "headline",
      label: 'Headline',
      type: 'string',
      disabled: false,
    },
    {
      name: "location",
      label: 'Location',
      type: 'string',
      disabled: false,
    },
    {
      name: "responsibilities",
      label: 'Responsibilities',
      type: 'string',
      disabled: false,
    },
    {
      name: "qualifications",
      label: 'Qualifications',
      type: 'string',
      disabled: false,
    },
    {
      name: "key_attributes",
      label: 'Key Attributes',
      type: 'string',
      disabled: false,
    },
    {
      name: "tags",
      label: 'Role tags',
      type: 'custom',
      disabled: false,
      inputRenderer: (idx: number, _option: InputOption, value: any) => {
        return <TextField key={idx} value={value.join(', ')} onChange={(evt => handleTagChange(evt.target.value))} />
      }
    },
  ];

  function handleTagChange(value: string) {
    const tags = value.split(',').map(v => v.trim());
    roleService.update(entity.id!, { tags: tags })
      .then(updated => onChange(updated));
  }

  function handleChange(field: string, value: string): void {
    const changes = JSON.parse(`{ "${field}" : ${JSON.stringify(value)} }`)
    roleService.update(entity.id!, changes)
      .then(updated => onChange(updated));
  }

  function getPicUrl(role: Role): string | undefined {
    return role.pic ? storageService.getUrl(`${role.pic}`) : undefined
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
        <Grid container>
          <Grid size={3}>
            <Box
              sx={
                {
                  height: '100%',
                  backgroundImage: `url(${getPicUrl(entity)})`,
                  backgroundSize: 'contain', // or 'contain'
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  inset: 0, // top:0, right:0, bottom:0, left:0
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }
              }>
            </Box>
          </Grid>
          <Grid size={9}>
            <InputForm entity={role} inputFields={fields} onChange={handleChange} />
          </Grid>
          <Grid size={12} sx={{ marginTop: 2 }}>
            <InputForm entity={role} inputFields={optionalFields} onChange={handleChange} />
          </Grid>
        </Grid>
      </CardContent>
    </Card >
  )

}

const RolePage = () => {
  const [entity, setEntity] = useState<Role>();
  const { id } = useParams<string>();

  useEffect(() => {
    if (id) {
      refresh();
    }
  }, [id]);

  function refresh() {
    if (id) {
      roleService.getById(id)
        .then((en) => setEntity(en!));
    }
  }

  return (entity &&
    <Stack gap={2}>
      <Breadcrumbs>
        <Link color="inherit" href="/">
          Home
        </Link>
        <Link color="inherit" href="/roles">
          Roles
        </Link>
        <Typography>{entity.name}</Typography>
      </Breadcrumbs>
      <RoleDetails entity={entity} onChange={refresh} />
    </Stack>
  )
}




export { RoleDetails, RolePage };

