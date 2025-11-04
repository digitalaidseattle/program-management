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
  RefreshContextProvider,
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

export const authService = new SupabaseAuthService();
export const storageService = new SupabaseStorageService('program-management');

const App: React.FC = () => {
  return (
    <AuthServiceProvider authService={authService} >
      <StorageServiceProvider storageService={storageService} >
        <UserContextProvider>
          <LayoutConfigurationProvider configuration={TemplateConfig()}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <RefreshContextProvider >
                <RouterProvider router={router} />
              </RefreshContextProvider>
            </LocalizationProvider>
          </LayoutConfigurationProvider>
        </UserContextProvider>
      </StorageServiceProvider>
    </AuthServiceProvider>
  );
}

export default App;
