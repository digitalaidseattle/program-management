/**
 *  DrawerHeader/index.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

// material-ui
import { Box, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project import
import Logo from '../../../../components/Logo/Logo';
import { useNavigate } from 'react-router';

// ==============================|| DRAWER HEADER ||============================== //

const DrawerHeader = (props: { open: boolean }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      onClick={() => navigate('/')}
      display='flex'
      alignItems='center'
      justifyContent={props.open ? 'flex-start' : 'center'}
      paddingLeft={theme.spacing(props.open ? 3 : 0)} >
      <Stack direction="row" spacing={1} alignItems="center">
        <Box padding={'0.5rem'}><Logo /></Box>
        <Typography variant="h5">{import.meta.env.VITE_APPLICATION_NAME}</Typography>
      </Stack>
    </Box>
  );
};

export default DrawerHeader;
