/**
 *  scheduling/success.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SchedulingSuccessPage = () => {
  const navigate = useNavigate();
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="50vh" gap={2}>
      <Typography variant='h4'>Scheduling links created</Typography>
      <Typography>It is now safe to close this window.</Typography>
      <Button variant='contained' onClick={() => navigate('/')}>Go Home</Button>
    </Box>
  );
}

export default SchedulingSuccessPage;

