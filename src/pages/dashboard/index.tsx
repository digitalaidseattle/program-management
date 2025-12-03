import { Card, CardContent, CardHeader, Stack } from "@mui/material";
import Markdown from "react-markdown";
import { SchedulingWidget } from "../../components/SchedulingWidget";
import { MyMeetingsWidget } from "../../components/MyMeetingsWidget";

const DashboardPage = () => {
    const hometext = `
# This dashboard page is under construction

You should expect to find things like:
- notifications
- shortcuts to tasks
- summaries
- widgets
`

    return (
        <>
            <Stack direction='row' gap={2}>
                <MyMeetingsWidget />
                <Card>
                    <CardHeader title="Create Scheduling Links" />
                    <CardContent>
                        <SchedulingWidget />
                    </CardContent>
                </Card>
            </Stack>
            <Markdown>
                {hometext}
            </Markdown>
        </>
    );
};

export default DashboardPage;