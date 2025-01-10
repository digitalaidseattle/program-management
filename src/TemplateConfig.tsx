

import {
    SearchOutlined
} from '@ant-design/icons';
import logo from "./assets/images/logo-light-icon.svg";

import { MenuItem } from "@digitalaidseattle/mui";

export const TemplateConfig = () => {
    const radiator = {
        id: 'group-dashboard',
        title: 'Digital Aid Seattle',
        type: 'group',
        children: [
            {
                id: 'evaluations',
                title: 'Evaluations',
                type: 'item',
                url: '/',
                icon: <SearchOutlined />
            }
        ]
    } as MenuItem;

    return ({
        appName: 'DAS',
        logoUrl: logo,
        drawerWidth: 240,
        menuItems: [radiator],
        toolbarItems: []
    });
}