/**
 *  routes.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { Error, Login, MainLayout, MarkdownPage, MinimalLayout } from '@digitalaidseattle/mui';

import Markdown from 'react-markdown';
import DashboardPage from './dashboard/index.tsx';
import { DisciplinePage } from './discipline';
import DisciplinesPage from './disciplines';
import { MeetingPage } from './meeting';
import MeetingsPage from './meetings/index.tsx';
import MigrationPage from './migration';
import { PartnerPage } from './partner';
import PartnersPage from './partners';
import { ProfilePage } from './profile/index.tsx';
import ReferenceDisciplinesPage from './reference/disciplines.tsx';
import ReferencePartnersPage from './reference/partners.tsx';
import ReferenceToolsPage from './reference/tools.tsx';
import ReferenceVolunteersPage from './reference/volunteers.tsx';
import { RolePage } from './role/index.tsx';
import RolesPage from './roles/index.tsx';
import StaffingPage from './staffing/StaffingPage.tsx';
import { TeamPage } from './team';
import TeamsPage from './teams';
import { ToolPage } from './tool';
import ToolsPage from './tools';
import { VenturePage } from './venture';
import VenturesPage from './ventures';
import { AdhocMeetingPage } from './view-meeting/AdhocMeetingPage.tsx';
import AllMeetingsPage from './view-meeting/AllMeetings.tsx';
import { LeadershipMeetingPage } from './view-meeting/LeadershipMeetingPage.tsx';
import { PlenaryPage } from './view-meeting/PlenaryPage.tsx';
import { TeamMeetingPage } from './view-meeting/TeamMeetingPage.tsx';
import { VolunteerPage } from './volunteer';
import VolunteersPage from './volunteers';
import ReportingPage from './reporting/index.tsx';
import ReferenceRolesPage from './reference/roles.tsx';
import ReferenceVenturesPage from './reference/ventures.tsx';
import ReportingPage from './reporting/index.tsx';
import ReferenceRolesPage from './reference/roles.tsx';
import ReferenceVenturesPage from './reference/ventures.tsx';
import ReferenceTeamsPage from './reference/teams..tsx';

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
        path: "ventures",
        element: <ReferenceVenturesPage />,
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
        element: <ReportingPage />,
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
        path: "teams/:id?",
        element: <ReferenceTeamsPage />,
      },
      {
        path: "tools/:id?",
        element: <ReferenceToolsPage />,
      },
      {
        path: "volunteers/:id?",
        element: <ReferenceVolunteersPage />,
      },
      {
        path: "disciplines/:id?",
        element: <ReferenceDisciplinesPage />,
      },
      {
        path: "partners/:id?",
        element: <ReferencePartnersPage />,
      },
      {
        path: "roles/:id?",
        element: <ReferenceRolesPage />,
      },
      {
        path: "ventures/:id?",
        element: <ReferenceVenturesPage />,
      }
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
        path: "role/:id",
        element: <RolePage />,
      },
      {
        path: "roles",
        element: <RolesPage />,
      },
      {
        path: "venture/:id",
        element: <VenturePage />,
      },
      {
        path: "ventures",
        element: <VenturesPage />,
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
