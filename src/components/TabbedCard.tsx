import { Box, Card, CardContent, Direction, Tab, Tabs, useTheme } from "@mui/material";
import { ReactNode, useState } from "react";

interface TabPanelProps {
    children: ReactNode,
    index: number,
    value: number,
    dir: Direction
}
// tab panel wrapper
const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, dir, ...other }) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`profile-tabpanel-${index}`}
            aria-labelledby={`profile-tab-${index}`}
            dir={dir}
            {...other}>
            {value === index && children}
        </div>
    );
}

interface TabbedCardProps {
    panels: {
        label: string,
        children: ReactNode
    }[];
}

export const TabbedCard: React.FC<TabbedCardProps> = ({ panels }) => {
    const theme = useTheme();
    const [activeTab, setActiveTab] = useState<number>(0);

    function a11yProps(index: number) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    function handleTabChange(_event: React.SyntheticEvent, newValue: number) {
        setActiveTab(newValue);
    };

    return (
        <Card>
            <CardContent>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs variant="fullWidth" value={activeTab} onChange={handleTabChange} aria-label="profile tabs">
                        {panels.map((p, idx) => (
                            <Tab
                                key={idx}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                label={p.label}
                                {...a11yProps(idx)}
                            />
                        ))}
                    </Tabs>
                    {panels.map((p, idx) => (
                        <TabPanel value={activeTab} index={idx} dir={theme.direction}>
                            {p.children}
                        </TabPanel>
                    ))}
                </Box>
            </CardContent>
        </Card>
    )
}
