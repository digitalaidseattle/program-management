/**
 *  VentureStatusReportPage.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { HomeOutlined } from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";

import { LoadingContext, useNotifications } from "@digitalaidseattle/core";
import { Breadcrumbs, IconButton, Typography } from "@mui/material";
import { VentureReportDetails } from "../../components/VentureReportDetails";
import { VentureReport, VentureReportService } from "../../services/dasVentureReportService";

export const VentureStatusReportPage = () => {
    const service = VentureReportService.instance();
    const { id } = useParams<string>();
    const { setLoading } = useContext(LoadingContext);
    const notifications = useNotifications();

    const [report, setReport] = useState<VentureReport>();

    useEffect(() => {
        if (id) {
            refresh()
        }
    }, [id]);

    function refresh() {
        if (id) {
            setLoading(true);
            service.getById(id)
                .then(r => setReport(r!))
                .catch(err => {
                    console.error('Failed to load reports', err);
                    notifications.error('Unable to load reports right now.');
                })
                .finally(() => setLoading(false));
        }
    }

    return (
        <>
            <Breadcrumbs aria-label="breadcrumb">
                <NavLink to="/" ><IconButton size="medium"><HomeOutlined /></IconButton></NavLink>
                <NavLink to={`/ventures`} >Ventures</NavLink>
                <NavLink to={`/ventures/reporting`} >Reports</NavLink>
                <Typography color="text.primary">Report Detail</Typography>
            </Breadcrumbs>
            {report && <VentureReportDetails report={report} />}
        </>
    );
}