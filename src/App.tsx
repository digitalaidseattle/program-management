/**
 *  App.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
// project import
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import React, { useEffect } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import {
  AuthServiceProvider,
  setCoreServices,
  getCoreServices,
  StorageServiceProvider
} from "@digitalaidseattle/core";
import { LayoutConfigurationProvider } from "@digitalaidseattle/mui";

import {
  SupabaseAuthService,
  SupabaseConfiguration,
  SupabaseStorageService
} from '@digitalaidseattle/supabase';
import { routes } from './pages/routes';


import { LocalizationProvider } from '@mui/x-date-pickers';
import "./App.css";
import { TemplateConfig } from './TemplateConfig';
import { Configuration as CodaConfiguration } from './services/coda/Configuration';

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const router = createBrowserRouter(routes);

const App: React.FC = () => {
  const [initialized, setInitialized] = React.useState<boolean>(false);

  useEffect(() => {
    configure();
  }, []);

  function configure() {
    CodaConfiguration.props({
      apiToken: import.meta.env.VITE_CODA_API_TOKEN,
      apiBase: import.meta.env.VITE_CODA_API_BASE
    });

    SupabaseConfiguration.props({
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
      anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY
    });

    setCoreServices({
      authService: SupabaseAuthService.getInstance(),
      storageService: SupabaseStorageService.getInstance()
    })
    setInitialized(true);
  }

  return (initialized) && (
    <AuthServiceProvider authService={getCoreServices().authService!} >
      <StorageServiceProvider storageService={getCoreServices().storageService!} >
        <LayoutConfigurationProvider configuration={TemplateConfig()}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <RouterProvider router={router} />
          </LocalizationProvider>
        </LayoutConfigurationProvider>
      </StorageServiceProvider>
    </AuthServiceProvider>
  );
}

export default App;
