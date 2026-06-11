/**
 * 
 * ReportingPanel.tsx
 * 
 */
import { Avatar, Card, CardContent, CardHeader, Stack } from "@mui/material";

import { Venture } from "../../data/types";
import { InfoCard } from "./InfoCard";
import { ReportingPanel } from "./ReportingPanel";

import { STATUS_COMP } from '../ventures/Utils';
import { StaffingPanel } from "./StaffingPanel";

export const CARD_HEADER_SX = { background: "linear-gradient(156.77deg,  #6ef597ff 111.48%, #7461c9ff -11.18%)" }

const ReferenceVentureDetails = ({ entity }: { entity: Venture }) => {

  return (entity &&
    <Card>
      <CardHeader
        title={entity.venture_code}
        action={STATUS_COMP[entity.status]}
        avatar={entity.icon &&
          <Avatar
            src={entity.icon}
            alt={`${entity.partner_name} logo`}
            sx={{ objectFit: 'contain' }}
            variant="rounded"
          />
        } />
      <CardContent>
        <Stack gap={1}>
          <InfoCard entity={entity} />
          <Card>
            <CardHeader sx={CARD_HEADER_SX} title="Status Reports" />
            <ReportingPanel entity={entity} onChange={() => { }} />
          </Card>
          <StaffingPanel entity={(entity)} onChange={() => { }} />
        </Stack>
      </CardContent>
    </Card>
  )

}


export { ReferenceVentureDetails };
