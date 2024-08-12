/**
 * DASSnackbar.tsx
 * 
 * Display an alert
 * user sererity for "error", "warning", "info", "success"
 * 
 * 
 */
import { Box, LinearProgress } from "@mui/material";
import { useContext } from "react";
import { LoadingContext } from "./contexts/LoadingContext";

export const LoadingIndicator = () => {
    const { loading } = useContext(LoadingContext);

    // creating an overlay effect
    return (loading &&
        <Box sx={{
            zIndex: 2,
            position: 'fixed',
            width: '100%',
        }}>
            <LinearProgress color="success" />
        </Box>
    )
}