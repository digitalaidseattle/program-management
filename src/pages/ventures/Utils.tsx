import { Chip } from "@mui/material";

export const STATUS_COMP: { [key: string]: JSX.Element } = {
    "Submitted by Partner": <Chip label='Submitted by Partner' color='default' />,
    'Ready for consideration': <Chip label='Ready for consideration' color='default' />,
    "Under evaluation": <Chip label='Under evaluation' color='default' />,
    'Active': <Chip label='Active' color='primary' />,
    'Paused': <Chip label='Paused' color='warning' />,
    'Declined': <Chip label='Declined' color='error' />,
    'Delivered': <Chip label='Active' color='success' />,
}

export const STAFFING_COMP: { [key: string]: JSX.Element } = {
    "Proposed": <Chip label='Proposed' color='default' />,
    "Please fill": <Chip label='Please fill' color='primary' />,
    'Cancelled': <Chip label='Cancelled' color='warning' />,
    "Concluded": <Chip label='Concluded' color='secondary' />,
    'Filled': <Chip label='Filled' color='success' />,
}


