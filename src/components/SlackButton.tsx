/**
 *  SlackButton.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { Box, Link } from "@mui/material";
import Logo from '../assets/images/icons/Slack.png';

export function SlackButton({ url }: { url: string }) {

    return (
        <Link
            href={url}
            target="_blank"
            underline="none"
            sx={{
                display: "inline-block",
                borderRadius: 2,
                overflow: "hidden",
                "&:hover img": {
                    transform: "scale(1.05)",
                },
            }}
        >
            <Box
                component="img"
                src={Logo}
                alt="Slack"
                sx={{
                    width: 40,
                    height: 40,
                    objectFit: "cover",
                    transition: "transform 0.3s",
                }}
            />
        </Link>
    );
}