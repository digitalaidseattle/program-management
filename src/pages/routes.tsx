/**
 *  routes.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { Error, Login, MainLayout, MarkdownPage, MinimalLayout } from '@digitalaidseattle/mui';

import { DisciplinePage } from './discipline';
import DisciplinesPage from './disciplines';
import MigrationPage from './migration';
import { PartnerPage } from './partner';
import PartnersPage from './partners';
import { TeamPage } from './team';
import TeamsPage from './teams';
import { ToolPage } from './tool';
import ToolsPage from './tools';
import { VenturePage } from './venture';
import VenturesPage from './ventures';
import { MeetingPage } from './meeting';
import { VolunteerPage } from './volunteer';
import VolunteersPage from './volunteers';
import DashboardPage from './dashboard.tsx';
import Markdown from 'react-markdown';
import PlenaryPage from './view-meeting/PlenaryPage.tsx';
import MeetingsPage from './meetings/index.tsx';
import TeamMeetingPage from './view-meeting/TeamMeetingPage.tsx';
import AdhoceetingPage from './view-meeting/AdhocMeetingPage.tsx';
import LeadershipMeetingPage from './view-meeting/LeadershipMeetingPage.tsx';
import StaffingPage from './staffing/StaffingPage.tsx';

const routes = [
  {
    path: "/",
    element: <MainLayout sx={{ p: 1 }} />,
    children: [
      {
        path: "/",
        element: <DashboardPage />
      },
      {
        path: "privacy",
        element: <MarkdownPage filepath='privacy.md' />,
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
        path: "meetings",
        element: <MeetingsPage />,
      },
      {
        path: "meeting/:id",
        element: <MeetingPage />,
      },
      {
        path: "applicants",
        element: <Markdown># The Applicants page is under construction.</Markdown>,
      },
      {
        path: "proctors",
        element: <Markdown># The Proctors page is under construction.</Markdown>,
      },
      {
        path: "staffing",
        element: <StaffingPage />,
      },
      {
        path: "reporting",
        element: <Markdown># The Reporting page is under construction.</Markdown>,
      },
      {
        path: "plenary",
        element: <PlenaryPage />,
      },
      {
        path: "leadership",
        element: <LeadershipMeetingPage />,
      },
      {
        path: "team-meeting/:id",
        element: <TeamMeetingPage />,
      },
      {
        path: "adhoc-meeting/:id",
        element: <AdhoceetingPage />,
      },
      {
        path: "team-meeting",
        element: <TeamMeetingPage />,
      },
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
