/**
 * 
 * InfoCard.tsx
 * 
 */
import {
  Grid,
  Typography
} from '@mui/material';
import Markdown from 'react-markdown';
import { FieldRow } from '../../components/FieldRow';
import { Venture } from "../../data/types";


export const InfoCard = ({ entity }: { entity: Venture }) => {

  return (entity &&

        <Grid container spacing={2}>
          <Grid size={6}>
            <FieldRow label="Partner">
              <Typography>{entity.partner_name}</Typography>
            </FieldRow>
            <FieldRow label="Painpoint">
              <Typography>{entity.painpoint}</Typography>
            </FieldRow>
            <FieldRow label="Program Areas">
              <Typography>{entity.program_areas.join(', ')}</Typography>
            </FieldRow>
          </Grid>
          <Grid size={6}>
            <FieldRow label="Problem">
              <Markdown>{entity.problem}</Markdown>
            </FieldRow>
            <FieldRow label="Solution">
              <Markdown>{entity.solution}</Markdown>
            </FieldRow>
            <FieldRow label="Impact">
              <Markdown>{entity.impact}</Markdown>
            </FieldRow>
          </Grid>
          {/* <Grid size={12}>
            <StaffingPanel entity={entity} onChange={() => { }} />
          </Grid>*/}
        </Grid>
  )

}

