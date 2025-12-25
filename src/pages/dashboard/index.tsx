import { Card, CardContent, CardHeader, Stack } from "@mui/material";
import { SchedulingWidget } from "../../components/SchedulingWidget";

const DashboardPage = () => {

    return (
        <>
            <Stack gap={2}>
                <Card>
                    <CardHeader title="Create Scheduling Links" />
                    <CardContent>
                        <SchedulingWidget />
                    </CardContent>
                </Card>
            </Stack>
        </>
    );
};

export default DashboardPage;