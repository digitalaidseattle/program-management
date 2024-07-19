// project import
import {
  ChromeOutlined,
  DashboardOutlined,
  LoginOutlined,
  ProfileOutlined,
  QuestionOutlined,
  ExclamationOutlined,
  FileOutlined,
  FileExclamationOutlined,
  EyeInvisibleOutlined,
  UploadOutlined,
  DragOutlined,
  GlobalOutlined,
  TableOutlined
} from '@ant-design/icons';

const icons = {
  DashboardOutlined,
  LoginOutlined,
  ProfileOutlined,
  ChromeOutlined,
  QuestionOutlined,
  ExclamationOutlined,
  FileOutlined,
  FileExclamationOutlined,
  EyeInvisibleOutlined,
  UploadOutlined,
  DragOutlined,
  GlobalOutlined,
  TableOutlined
};

// ==============================|| MENU ITEMS ||============================== //
const radiator = {
  id: 'group-radiator',
  title: 'Navigation',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'ventures',
      title: 'Ventures',
      type: 'item',
      url: '/ventures',
      icon: icons.FileOutlined,
      breadcrumbs: false
    },
    {
      id: 'contributors',
      title: 'Contributors',
      type: 'item',
      url: '/contributors',
      icon: icons.FileOutlined,
      breadcrumbs: false
    }
  ]
}

const menuItems = {
  items: [radiator]
};

export default menuItems;
