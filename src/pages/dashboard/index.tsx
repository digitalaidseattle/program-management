import { Card, CardContent, CardHeader, Grid } from "@mui/material";
import { MyTasksWidget } from "../../components/MyTasksWidget";
import { SchedulingWidget } from "../../components/SchedulingWidget";

const DashboardPage = () => {

    return (
        <>
            <Grid container spacing={2}>
                <Grid size={4} >
                    <MyTasksWidget />
<<<<<<< HEAD
<<<<<<< HEAD
                </Grid>
                <Grid size={8} >
                    <Card >
=======
                </Grid> */}
                <Grid size={12} >
                    <Card sx={{height: "100%"}}>
>>>>>>> 42b83ce (coda refactor)
=======
                </Grid>
                <Grid size={8} >
                    <Card >
>>>>>>> a1aca81 (reuse venture report details)
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