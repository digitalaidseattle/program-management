/**
 *  ListCard.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { MoreOutlined, StarFilled, StarOutlined } from "@ant-design/icons";
import { Avatar, Card, CardActions, CardContent, CardHeader, IconButton, Menu, Tooltip } from "@mui/material";
import { useState } from "react";


type ListCardProps = {
    key: string;
    title: string;
    avatarImageSrc?: string;
    cardStyles?: any;
    cardContent?: React.ReactNode;
    cardAction?: () => void;
    menuItems?: any[];
    highlightOptions?: {
        highlight: boolean;
        title: string;
        toggleHighlight: () => void
    };
}

export const ListCard = ({
    key,
    title,
    avatarImageSrc,
    cardStyles,
    cardContent,
    cardAction,
    menuItems,
    highlightOptions
}: ListCardProps) => {

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const showMenu = Boolean(anchorEl);

    const handleMoreClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMoreClose = () => {
        setAnchorEl(null);
    };

    return (
        <Card
            key={key}
            sx={{
                boxShadow: 'none',
                minWidth: { xs: '100%', sm: '17rem' },
                maxWidth: 240,
                ...cardStyles,
            }}
            onDoubleClick={cardAction ? cardAction : undefined}
        >
            <CardHeader title={title}
                avatar={avatarImageSrc &&
                    <Avatar
                        src={avatarImageSrc}
                        alt={`${title} logo`}
                        sx={{ width: 40, height: 40, objectFit: 'contain' }}
                        variant="rounded"
                    />
                }
                action={menuItems &&
                    <IconButton aria-label="more button"
                        onClick={handleMoreClick} >
                        <MoreOutlined />
                    </IconButton>
                }
            />
            {menuItems &&
                <Menu
                    id="demo-positioned-menu"
                    aria-labelledby="demo-positioned-button"
                    anchorEl={anchorEl}
                    open={showMenu}
                    onClose={handleMoreClose}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                >
                    {menuItems}
                </Menu>
            }
            {cardContent &&
                <CardContent>
                    {cardContent}
                </CardContent>
            }
            {highlightOptions &&
                <CardActions disableSpacing>
                    <Tooltip title={highlightOptions.title}>
                        <IconButton
                            onClick={(event) => {
                                event.preventDefault();
                                highlightOptions.toggleHighlight();
                            }}
                            aria-label="favorite"
                            size="small"
                        >
                            {highlightOptions.highlight
                                ? <StarFilled style={{ color: '#bea907ff' }} />
                                : <StarOutlined style={{ color: 'gray' }} />
                            }
                            &nbsp;{`${highlightOptions.title}`}
                        </IconButton>
                    </Tooltip>
                </CardActions>}
        </Card >
    )
}