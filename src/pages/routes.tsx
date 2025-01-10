/**
 *  routes.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { Error, Login, MainLayout, MarkdownPage, MinimalLayout } from '@digitalaidseattle/mui';

import EvaluationPage from '../sections/evaluation/pages/evaluation';
import EvaluationsPage from '../sections/evaluation/pages/evaluations';
import PrivacyPage from './PrivacyPage';
import Login from './authentication/Login';
import ContributorsPage from './contributors';
import DashboardDefault from './dashboard';
import Page404 from './error/404';
import VenturePage from '../sections/projectManagement/pages/venture';
import VenturesPage from '../sections/projectManagement/pages/ventures';

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
        path: "privacy",
        element: <MarkdownPage filepath='privacy.md'/>,
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
        element: <Error />
      }
    ]
  }
];

export { routes };
