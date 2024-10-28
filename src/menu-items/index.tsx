// project import
import {
  SearchOutlined,
  RocketOutlined
} from '@ant-design/icons';

const icons = {
  SearchOutlined,
  RocketOutlined
};

// ==============================|| MENU ITEMS ||============================== //
const radiator = {
  id: 'group-radiator',
  title: 'Navigation',
  type: 'group',
  children: [
    // {
    //   id: 'dashboard',
    //   title: 'Dashboard',
    //   type: 'item',
    //   url: '/',
    //   icon: icons.DashboardOutlined,
    //   breadcrumbs: false
    // },
    {
      id: 'ventures',
      title: 'Ventures',
      type: 'item',
      url: '/ventures',
      icon: icons.RocketOutlined,
      breadcrumbs: false
    },
    {
      id: 'evaluations',
      title: 'Evaluations',
      type: 'item',
      url: '/evaluations',
      icon: icons.SearchOutlined,
      breadcrumbs: false
    },
    // {
    //   id: 'contributors',
    //   title: 'Contributors',
    //   type: 'item',
    //   url: '/contributors',
    //   icon: icons.FileOutlined,
    //   breadcrumbs: false
    // }
  ]
}

const menuItems = {
  items: [radiator]
};

export default menuItems;
