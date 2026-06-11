/**
 * 
 * ReferenceVolunteerDetails.tsx
 * 
 */
import { Card, CardContent, CardHeader, Stack } from "@mui/material";
import { Volunteer } from "../../services/dasVolunteerService";
import { InfoCard } from "./InfoCard";
import { TeamsCard } from "./TeamsCard";
import { VenturesCard } from "./VenturesCard";
// import { TeamsCard } from "./TeamsCard";
// import { DisciplinesCard } from "./DisplinesCard";
// import { ToolsCard } from "./ToolsCard";

const ReferenceVolunteerDetails = ({ entity }: { entity: Volunteer }) => {
    return (
        <Card>
            <CardHeader title={entity.name} />
            <CardContent>
                <Stack gap={1}>
                    <InfoCard entity={entity} />
                    <TeamsCard entity={entity} />
                    <VenturesCard entity={entity} />
                    {/* <DisciplinesCard entity={entity} /> */}
                    {/* <ToolsCard entity={entity} /> */}
                </Stack>
            </CardContent>
        </Card>
    );
}
export { ReferenceVolunteerDetails };
