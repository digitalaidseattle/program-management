/**
 *  scheduling/index.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';

const getQueryParam = (search: string, key: string): string | null => {
  const params = new URLSearchParams(search);
  return params.get(key);
}

const SchedulingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const clientId = import.meta.env.VITE_CALENDLY_CLIENT_ID as string;
  const redirectUri = useMemo(() => {
    return `${window.location.origin}/api/calendly/oauth/callback`;
  }, []);

  useEffect(() => {
    const code = getQueryParam(location.search, 'code');
    const stateParam = getQueryParam(location.search, 'state');
    const interviewerRecordId = getQueryParam(location.search, 'interviewerRecordId');
    const email = getQueryParam(location.search, 'email');

    if (code) {
      const state = stateParam ? stateParam : JSON.stringify({ interviewerRecordId, email });
      fetch(`/api/calendly/oauth/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}&redirect_uri=${encodeURIComponent(redirectUri)}`)
        .then(async (res) => {
          if (!res.ok) {
            const text = await res.text();
            throw new Error(text || 'Calendly callback failed');
          }
          return res.json().catch(() => ({}));
        })
        .then(() => navigate('/scheduling/success'))
        .catch((e) => setError(e.message || 'Unknown error'));
      return;
    }

    if (!clientId) {
      setError('Missing VITE_CALENDLY_CLIENT_ID');
      return;
    }

    if (!interviewerRecordId) {
      setError('Missing interviewerRecordId');
      return;
    }

    const state = JSON.stringify({ interviewerRecordId, email });
    const authorizeUrl = `https://auth.calendly.com/oauth/authorize?client_id=${encodeURIComponent(clientId)}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&state=${encodeURIComponent(state)}`;
    window.location.replace(authorizeUrl);
  }, [location.search, navigate, clientId, redirectUri]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="50vh" gap={2}>
      {!error && <CircularProgress />}
      <Typography>{error ? error : 'Redirecting to Calendly…'}</Typography>
    </Box>
  );
}

export default SchedulingPage;





