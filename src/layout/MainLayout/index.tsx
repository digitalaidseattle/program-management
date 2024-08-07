/**
 *  MainLayout/index.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

// material-ui
import { Box, LinearProgress, Toolbar, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project import
import navigation from '../../menu-items';
import Drawer from './Drawer';
import Header from './Header';

// types
import { User } from '@supabase/supabase-js';
import Breadcrumbs from '../../components/@extended/Breadcrumbs';
import ScrollTop from '../../components/ScrollTop';
import { DrawerOpenContext } from '../../components/contexts/DrawerOpenContext';
import { RefreshContextProvider } from '../../components/contexts/RefreshContext';
import { UserContext } from '../../components/contexts/UserContext';
import { authService } from '../../services/authService';
import { LoadingContext, LoadingContextProvider } from '../../components/contexts/LoadingContext';


const LoadingIndicator = () => {
  const { loading } = useContext(LoadingContext);

  // creating an overlay effect
  return (loading &&
    <Box sx={{
      zIndex: 2,
      position: 'fixed',
      width: '100%'
    }}>
      <LinearProgress color="success" />
    </Box>
  )
}
// ==============================|| MAIN LAYOUT ||============================== //


const MainLayout: React.FC = () => {
  const theme = useTheme();
  const matchDownLG = useMediaQuery(theme.breakpoints.down('lg'));
  const [user, setUser] = useState<User>(null as unknown as User);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    authService.getUser()
      .then((user: User | null) => {
        if (user) {
          setUser(user)
        } else {
          navigate("/login")
        }
      })
  }, [navigate])


  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  // set media wise responsive drawer
  useEffect(() => {
    setDrawerOpen(!matchDownLG);
  }, [matchDownLG]);

  return (
    <UserContext.Provider value={{ user, setUser }} >
      {user &&
        <LoadingContextProvider>
          <DrawerOpenContext.Provider value={{ drawerOpen, setDrawerOpen }} >
            <RefreshContextProvider >
              <ScrollTop>
                <Box sx={{ display: 'flex', width: '100%' }}>
                  <Header open={drawerOpen} handleDrawerToggle={handleDrawerToggle} />
                  <Drawer open={drawerOpen} handleDrawerToggle={handleDrawerToggle} />
                  <Box component="main" sx={{ width: '100%', flexGrow: 1, p: { xs: 2, sm: 3 } }}>
                    <LoadingIndicator />
                    <Toolbar />
                    <Breadcrumbs navigation={navigation} title />
                    <Outlet />
                  </Box>
                </Box>
              </ScrollTop>
            </RefreshContextProvider>
          </DrawerOpenContext.Provider>
        </LoadingContextProvider>
      }
    </UserContext.Provider>
  );
};

export default MainLayout;
