/**
 *  App.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
// project import
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import {
  AuthServiceProvider,
  StorageServiceProvider,
  UserContextProvider
} from "@digitalaidseattle/core";
import { LayoutConfigurationProvider } from "@digitalaidseattle/mui";

import {
  SupabaseAuthService,
  SupabaseStorageService
} from '@digitalaidseattle/supabase';
import { routes } from './pages/routes';

import { LocalizationProvider } from '@mui/x-date-pickers';
import "./App.css";
import { TemplateConfig } from './TemplateConfig';

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const router = createBrowserRouter(routes);

const authService = new SupabaseAuthService();
export const storageService = new SupabaseStorageService('program-management');
console.log(authService, storageService);

const App: React.FC = () => {
  return (
    <AuthServiceProvider authService={authService} >
      <StorageServiceProvider storageService={storageService} >
        <UserContextProvider>
          <LayoutConfigurationProvider configuration={TemplateConfig()}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <RouterProvider router={router} />
            </LocalizationProvider>
          </LayoutConfigurationProvider>
        </UserContextProvider>
      </StorageServiceProvider>
    </AuthServiceProvider>
  );
}

export default App;
