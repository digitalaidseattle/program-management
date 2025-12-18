/**
 *  MoreButton.tsx
 *  TODO - allow parent to close menu
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import {
    IconButton,
    Menu
} from '@mui/material';
import { useState } from "react";

import { MoreOutlined } from "@ant-design/icons";

// MenuItem won't import ??!!!???
export const MoreButton = ({ menuItems }: { menuItems: React.ReactNode }) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const showMenu = Boolean(anchorEl);

    function handleMoreClick(event: React.MouseEvent<HTMLElement>) {
        setAnchorEl(event.currentTarget);
    };

    function handleMoreClose() {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton color="primary" aria-label={`more`}
                onClick={(evt) => handleMoreClick(evt)}>
                <MoreOutlined />
            </IconButton>
            <Menu
                id="positioned-menu"
                aria-labelledby="positioned-button"
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
        </>
    );
}