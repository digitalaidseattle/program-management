import MainLayout from '../layout/MainLayout';
import MinimalLayout from '../layout/MinimalLayout';
import EvaluationPage from '../sections/evaluation/pages/evaluation';
import EvaluationsPage from '../sections/evaluation/pages/evaluations';
import PrivacyPage from './PrivacyPage';
import Login from './authentication/Login';
import ContributorsPage from './contributors';
import DashboardDefault from './dashboard';
import Page404 from './error/404';
import ProjectPage from '../sections/projectManagement/pages/project';
import ProjectsPage from '../sections/projectManagement/pages/projects';

const routes = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <EvaluationsPage />,
      },
      {
        path: "dashboard",
        element: <DashboardDefault />,
      },
      {
        path: "privacy",
        element: <PrivacyPage />,
      },
      {
        path: "projects",
        element: <ProjectsPage />,
      },
      {
        path: "project/:id",
        element: <ProjectPage />,
      },
      {
        path: "contributors",
        element: <ContributorsPage />,
      },
      {
        path: "evaluations",
        element: <EvaluationsPage />,
      },
      {
        path: "evaluation/:id",
        element: <EvaluationPage />,
      }
    ]
  },
  {
    path: "/",
    element: <MinimalLayout />,
    children: [
      {
        path: 'login',
        element: <Login />
      }
    ]
  },
  {
    path: "*",
    element: <MinimalLayout />,
    children: [
      {
        path: '*',
        element: <Page404 />
      }
    ]
  }
];

export { routes };
