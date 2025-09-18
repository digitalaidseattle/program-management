/**
 *  routes.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { Error, Login, MainLayout, MarkdownPage, MinimalLayout } from '@digitalaidseattle/mui';

import EvaluationPage from '../sections/evaluation/pages/evaluation';
import EvaluationsPage from '../sections/evaluation/pages/evaluations';
import ContributorsPage from './contributors';
import StaffingPage from './staffing';
import SchedulingPage from './scheduling';

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
      },
      {
        path: "staffing",
        element: <StaffingPage />,
      },
      {
        path: "scheduling",
        element: <SchedulingPage />,
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
