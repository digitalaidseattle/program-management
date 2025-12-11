/**
 *  ExternalLink.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import {
    Link,
    Tooltip,
    Typography
} from '@mui/material';

interface ExternalLinkProps {
    href?: string;
    requireMetaKey?: boolean;
    children: React.ReactNode;
}

export const ExternalLink = ({ href, requireMetaKey = false, children }: ExternalLinkProps) => {

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (e.metaKey) {        // metaKey = Command on macOS, Windows key on Windows
            e.stopPropagation();
        } else {
            e.preventDefault();    // Block navigation
        }
    };

    return (
        href
            ? requireMetaKey
                ? <Tooltip title={`Hold the cmd-key to link to open.`}>
                    <Link
                        target="_blank"
                        rel="noreferrer"
                        href={href}
                        onClick={handleClick}
                        underline="hover"
                    >
                        {children}
                    </Link>
                </Tooltip>
                : <Link
                    target="_blank"
                    rel="noreferrer"
                    href={href}
                    underline="hover"
                >
                    {children}
                </Link>
            : <Typography color="text.disabled">—</Typography>
    );
}