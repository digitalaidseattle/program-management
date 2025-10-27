import { Card, CardContent, CardHeader } from "@mui/material";
import Markdown from "react-markdown";
import { SchedulingWidget } from "../../components/SchedulingWidget";

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
            <Card>
                <CardHeader title="Create Scheduling Links" />
                <CardContent>
                    <SchedulingWidget />
                </CardContent>
            </Card>
            <Markdown>
                {hometext}
            </Markdown>
        </>
    );
};

export default DashboardPage;