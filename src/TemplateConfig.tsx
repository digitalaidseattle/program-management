

import {
    HeartOutlined,
    HomeOutlined,
    MehOutlined,
    PaperClipOutlined,
    RocketOutlined,
    SearchOutlined,
    TeamOutlined,
    ToolOutlined,
    UserOutlined
} from '@ant-design/icons';
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
                url: '/reporting',
                icon: <PaperClipOutlined />
            },
            {
                id: 'staffing',
                title: 'Staffing',
                type: 'item',
                url: '/staffing',
                icon: <MehOutlined />
            }
        ]
    } as MenuItem;

    const data = {
        id: 'cadre-dashboard',
        title: 'Data',
        type: 'group',
        children: [
            {
                id: 'people',
                title: 'Volunteers',
                type: 'item',
                url: '/volunteers',
                icon: <UserOutlined />
            }, {
                id: 'teams',
                title: 'Teams',
                type: 'item',
                url: '/teams',
                icon: <TeamOutlined />
            },
            {
                id: 'partners',
                title: 'Partners',
                type: 'item',
                url: '/partners',
                icon: <HeartOutlined />
            },
            {
                id: 'ventures',
                title: 'Ventures',
                type: 'item',
                url: '/ventures',
                icon: <RocketOutlined />
            },
            {
                id: 'tools',
                title: 'Tools',
                type: 'item',
                url: '/tools',
                icon: <ToolOutlined />
            },
            {
                id: 'disciplines',
                title: 'Disciplines',
                type: 'item',
                url: '/disciplines',
                icon: <ToolOutlined />
            }
        ]
    } as MenuItem;

    const recruiting = {
        id: 'recruiting-dashboard',
        title: 'Recruiting',
        type: 'group',
        children: [
            {
                id: 'applicants',
                title: 'Applicants',
                type: 'item',
                url: '/applicants',
                icon: <SearchOutlined />
            },
            {
                id: 'proctors',
                title: 'Proctors',
                type: 'item',
                url: '/proctors',
                icon: <MehOutlined />
            }
        ]
    } as MenuItem;


    return ({
        appName: 'DAS Program Management',
        logoUrl: logo,
        drawerWidth: 240,
        menuItems: [home, ventures, recruiting, data],
        toolbarItems: [],
        version: packageJson.version,
    } as LayoutConfiguration);
}