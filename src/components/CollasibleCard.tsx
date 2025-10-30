import { DownOutlined, MoreOutlined } from "@ant-design/icons";
import {
    Card,
    CardHeader,
    Collapse,
    IconButton
} from "@mui/material";
import { styled, SxProps } from "@mui/material/styles";
import * as React from "react";

const ExpandMore = styled((props: any) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }: { theme?: any; expand: boolean }) => ({
    transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
    }),
}));

interface CollapsibleCardProps {
    title: string;
    headerSx?: SxProps;
    children?: React.ReactNode;
}

export default function CollapsibleCard({ title, headerSx, children }: CollapsibleCardProps) {
    const [expanded, setExpanded] = React.useState(true);

    const handleExpandClick = () => {
        setExpanded((prev) => !prev);
    };

    return (
        <Card>
            <CardHeader
                title={title}
                sx={{
                    ...headerSx,
                }}
                action={
                    <ExpandMore
                        expand={expanded}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        <DownOutlined />
                    </ExpandMore>
                }
            />
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                {children}
            </Collapse>
        </Card>
    );
}