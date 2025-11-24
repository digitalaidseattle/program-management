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
import DashboardPage from './dashboard/index.tsx';
import Markdown from 'react-markdown';
import MeetingsPage from './meetings/index.tsx';
import { TeamMeetingPage } from './view-meeting/TeamMeetingPage.tsx';
import { AdhocMeetingPage } from './view-meeting/AdhocMeetingPage.tsx';
import { LeadershipMeetingPage } from './view-meeting/LeadershipMeetingPage.tsx';
import StaffingPage from './staffing/StaffingPage.tsx';
import { ProfilePage } from './profile/index.tsx';
import { PlenaryPage } from './view-meeting/PlenaryPage.tsx';
import AllMeetingsPage from './view-meeting/AllMeetings.tsx';
import { RolePage } from './role/index.tsx';
import ReferenceTeamsPage from './reference/teams/index.tsx';
import RolesPage from './roles/index.tsx';

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
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "privacy",
        element: <MarkdownPage filepath='privacy.md' />,
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
        path: "ventures",
        element: <VenturesPage />,
      },
      {
        path: "venture/:id",
        element: <VenturePage />,
      },
      {
        path: "migration",
        element: <MigrationPage />,
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
        path: "all-meetings",
        element: <AllMeetingsPage />,
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
        element: <AdhocMeetingPage />,
      },
      {
        path: "all-meetings",
        element: <AllMeetingsPage />,
      },
      {
        path: "role/:id",
        element: <RolePage />,
      },
      {
        path: "roles",
        element: <RolesPage />,
      },
      {
        path: "teams",
        element: <ReferenceTeamsPage />,
      },
    ]
  },
  {
    path: "/data/",
    element: <MainLayout sx={{ p: 1 }} />,
    children: [
      {
        path: "volunteers",
        element: <VolunteersPage />,
      },
      {
        path: "volunteer/:id",
        element: <VolunteerPage />,
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
        path: "meetings",
        element: <MeetingsPage />,
      },
      {
        path: "meeting/:id",
        element: <MeetingPage />,
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
      }
    ]
  },
  {
    path: "/data",
    element: <MainLayout sx={{ p: 1 }} />,
    children: []
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
