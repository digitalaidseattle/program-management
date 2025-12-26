import { Card, CardContent, CardHeader, Grid } from "@mui/material";
import { SchedulingWidget } from "../../components/SchedulingWidget";

const DashboardPage = () => {

    return (
        <>
            <Grid container spacing={2}>
                {/* <Grid size={4} >
                    <MyTasksWidget />
                </Grid> */}
                <Grid size={12} >
                    <Card sx={{height: "100%"}}>
                        <CardHeader title="Create Scheduling Links" />
                        <CardContent>
                            <SchedulingWidget />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
};

export default DashboardPage;