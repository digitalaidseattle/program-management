import MainLayout from '../layout/MainLayout';
import MinimalLayout from '../layout/MinimalLayout';
import PrivacyPage from './PrivacyPage';
import Login from './authentication/Login';
import ContributorsPage from './contributors';
import DashboardDefault from './dashboard';
import Page404 from './error/404';
import EvaluationPage from './evaluation';
import EvaluationsPage from './evaluations';
import VenturePage from './venture';
import VenturesPage from './ventures';

const routes = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <DashboardDefault />,
      },
      {
        path: "privacy",
        element: <PrivacyPage />,
      },
      {
        path: "ventures",
        element: <VenturesPage />,
      },
      {
        path: "venture/:id",
        element: <VenturePage />,
      },
      {
        path: "contributors",
        element: <ContributorsPage />,
      },
      {
        path: "evaluations",
        element: <EvaluationsPage />,
      }
      ,
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
