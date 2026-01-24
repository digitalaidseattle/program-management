
import {
    HomeOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import logo from "./assets/images/logo-light-icon.svg";

import { LayoutConfiguration, MenuItem } from "@digitalaidseattle/mui";
import packageJson from '../package.json';

export const TemplateConfig = () => {
    const home =
        {
            id: 'home-dashboard',
            title: 'Home',
            type: 'group',
            children: [
                {
                    id: 'dashboard',
                    title: 'Home',
                    type: 'item',
                    url: '/',
                    icon: <HomeOutlined />
                }]
        } as MenuItem;

    const meetings =
    {
        id: 'meetins-group',
        title: 'Meetings',
        type: 'group',
        children: [
            {
                id: 'team',
                title: 'All Meetings',
                type: 'item',
                url: '/all-meetings',
                icon: <CompassOutlined />
            },
            {
                id: 'plenary',
                title: 'Plenary',
                type: 'item',
                url: '/plenary',
                icon: <ScheduleOutlined />
            },
            {
                id: 'leadership',
                title: 'Leadership',
                type: 'item',
                url: '/leadership',
                icon: <CrownOutlined />
            }]
    }

    const ventures = {
        id: 'venture-dashboard',
        title: 'Ventures',
        type: 'group',
        children: [
            {
                id: 'reporting',
                title: 'Reporting',
                type: 'item',
                url: '/ventures/reporting',
                icon: <PaperClipOutlined />
            },
            // {
            //     id: 'staffing',
            //     title: 'Staffing',
            //     type: 'item',
            //     url: '/staffing',
            //     icon: <MehOutlined />
            // }
        ]
    } as MenuItem;

    console.log('disabled menu items', meetings, ventures, reference, data, recruiting);
    const menuItems = [home, ventures];

    return ({
        appName: 'DAS Program Management',
        logoUrl: logo,
        drawerWidth: 240,
        menuItems: menuItems,
        toolbarItems: [],
        profileItems: [
            // <Link
            //     style={{ 'textDecoration': 'none' }}
            //     color="secondary"
            //     to={`/profile`}>
            //     Profile
            // </Link>,
            // <Link
            //     style={{ 'textDecoration': 'none' }}
            //     color="secondary"
            //     to={`/privacy`}>
            //     Privacy Policy
            // </Link>
        ],
        version: packageJson.version,
    } as LayoutConfiguration);
}