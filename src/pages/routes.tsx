/**
 *  routes.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { Error, Login, MainLayout, MarkdownPage, MinimalLayout } from '@digitalaidseattle/mui';

import DisciplinePage from './discipline';
import DisciplinesPage from './disciplines';
import MigrationPage from './migration';
import PartnerPage from './partner';
import PartnersPage from './partners';
import SchedulingPage from './scheduling';
import TeamPage from './team';
import TeamsPage from './teams';
import ToolPage from './tool';
import ToolsPage from './tools';
import VenturePage from './venture';
import VenturesPage from './ventures';
import VolunteerPage from './volunteer';
import VolunteersPage from './volunteers';
import MeetingPage from './meeting';

const routes = [
  {
    path: "/",
    element: <MainLayout />,
    children: [

      {
        path: "privacy",
        element: <MarkdownPage filepath='privacy.md' />,
      },
      {
        path: "scheduling",
        element: <SchedulingPage />,
      },
      {
        path: "volunteers",
        element: <VolunteersPage />,
      },
      {
        path: "volunteer/:id",
        element: <VolunteerPage />,
      },
      {
        path: "partners",
        element: <PartnersPage />,
      },
      {
        path: "partner/:id",
        element: <PartnerPage />,
      },
      {
        path: "teams",
        element: <TeamsPage />,
      },
      {
        path: "team/:id",
        element: <TeamPage />,
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
        path: "tools",
        element: <ToolsPage />,
      },
      {
        path: "tool/:id",
        element: <ToolPage />,
      },
      {
        path: "disciplines",
        element: <DisciplinesPage />,
      },
      {
        path: "discipline/:id",
        element: <DisciplinePage />,
      },
      {
        path: "migration",
        element: <MigrationPage />,
      },
      {
        path: "meeting/:id",
        element: <MeetingPage />,
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
