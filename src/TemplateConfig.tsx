

import {
    CalendarOutlined,
    CompassOutlined,
    CrownOutlined,
    HeartOutlined,
    HomeOutlined,
    IdcardOutlined,
    KeyOutlined,
    MehOutlined,
    PaperClipOutlined,
    RocketOutlined,
    ScheduleOutlined,
    SearchOutlined,
    TeamOutlined,
    ToolOutlined,
    UserOutlined
} from '@ant-design/icons';
import logo from "./assets/images/logo-light-icon.svg";

import { LayoutConfiguration, MenuItem } from "@digitalaidseattle/mui";
import packageJson from '../package.json';
import { Link } from 'react-router-dom';

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


    const reference = {
        id: 'reference-group',
        title: 'Reference',
        type: 'group',
        children: [
            {
                id: 'ref-volunteers',
                title: 'Volunteers',
                type: 'item',
                url: '/volunteers',
                icon: <UserOutlined />
            },
            {
                id: 'ref-teams',
                title: 'Teams',
                type: 'item',
                url: '/teams',
                icon: <TeamOutlined />
            },
            {
                id: 'ref-partners',
                title: 'Partners',
                type: 'item',
                url: '/partners',
                icon: <HeartOutlined />
            },
            {
                id: 'ref-ventures',
                title: 'Ventures',
                type: 'item',
                url: '/ventures',
                icon: <RocketOutlined />
            },
            {
                id: 'ref-tools',
                title: 'Tools',
                type: 'item',
                url: '/tools',
                icon: <ToolOutlined />
            },
             {
                id: 'ref-disciplines',
                title: 'Disciplines',
                type: 'item',
                url: '/disciplines',
                icon: <KeyOutlined />
            }
        ]
    }

    const data = {
        id: 'cadre-dashboard',
        title: 'Data',
        type: 'group',
        children: [
            {
                id: 'people',
                title: 'Volunteers',
                type: 'item',
                url: '/data/volunteers',
                icon: <UserOutlined />
            }, {
                id: 'teams',
                title: 'Teams',
                type: 'item',
                url: '/data/teams',
                icon: <TeamOutlined />
            },
            {
                id: 'partners',
                title: 'Partners',
                type: 'item',
                url: '/data/partners',
                icon: <HeartOutlined />
            },
            {
                id: 'ventures',
                title: 'Ventures',
                type: 'item',
                url: '/data/ventures',
                icon: <RocketOutlined />
            },
            {
                id: 'tools',
                title: 'Tools',
                type: 'item',
                url: '/data/tools',
                icon: <ToolOutlined />
            },
            {
                id: 'disciplines',
                title: 'Disciplines',
                type: 'item',
                url: '/data/disciplines',
                icon: <KeyOutlined />
            },
            {
                id: 'roles',
                title: 'Roles',
                type: 'item',
                url: '/roles',
                icon: <IdcardOutlined />
            },
            {
                id: 'meetings',
                title: 'Meetings',
                type: 'item',
                url: '/data/meetings',
                icon: <CalendarOutlined />
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
        menuItems: [home, meetings, ventures, recruiting, reference, data],
        toolbarItems: [],
        profileItems: [
            <Link
                style={{ 'textDecoration': 'none' }}
                color="secondary"
                to={`/profile`}>
                Profile
            </Link>,
            <Link
                style={{ 'textDecoration': 'none' }}
                color="secondary"
                to={`/privacy`}>
                Privacy Policy
            </Link>
        ],
        version: packageJson.version,
    } as LayoutConfiguration);
}