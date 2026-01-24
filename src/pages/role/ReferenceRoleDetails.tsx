
// material-ui
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid
} from '@mui/material';

import Markdown from 'react-markdown';
import { FieldRow } from '../../components/FieldRow';
import { Role, roleService } from '../../services/dasRoleService';

const ReferenceRoleDetails = ({ entity }: { entity: Role }) => {

  return (entity &&
    <Card sx={{ padding: 0 }}>
      <CardHeader
        title={entity.name}
      />
      <CardContent>
        <Grid container>
          <Grid size={3}>
            <Box
              sx={
                {
                  height: '100%',
                  backgroundImage: `url(${roleService.getIconUrl(entity)})`,
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
            <FieldRow label="Name"> {entity.name} </FieldRow>
            <FieldRow label="Urgency"> {entity.urgency} </FieldRow>
            <FieldRow label="Status"> {entity.status} </FieldRow>
          </Grid>
          <Grid size={12} sx={{ marginTop: 2 }}>
            <FieldRow label="Headline"> {entity.headline} </FieldRow>
            <FieldRow label="Location"> {entity.location} </FieldRow>
            <FieldRow label="Responsibilities">
              <Markdown>{entity.responsibilities}</Markdown>
            </FieldRow>
            <FieldRow label="Qualifications">
              <Markdown>{entity.qualifications}</Markdown>
            </FieldRow>
            <FieldRow label="Key Attributes">
              <Markdown>{entity.key_attributes}</Markdown>
            </FieldRow>
            <FieldRow label="Tags"> {entity.tags} </FieldRow>
          </Grid>
        </Grid>
      </CardContent>
    </Card >
  )

}

export { ReferenceRoleDetails };

