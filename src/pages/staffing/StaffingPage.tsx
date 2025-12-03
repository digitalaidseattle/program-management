/**
 *  StaffingPage.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import {
    Card,
    CardContent, CardHeader,
    Typography
} from "@mui/material";

import { TabbedPanels } from "@digitalaidseattle/mui";
import VolunteerMatching from "./VolunteerMatching";
import AllPositions from "./AllPositions";

const StaffingPage = () => {

    return (
        <Card>
            <CardHeader
                title={<Typography variant="h2">Staffing</Typography>}
            >
            </CardHeader>
            <CardContent>
                <TabbedPanels panels={[
                    { header: 'Matching', children: <VolunteerMatching /> },
                    { header: 'All Positions', children: <AllPositions /> },
                ]} />
            </CardContent>
        </Card>
    )
}
export default StaffingPage;