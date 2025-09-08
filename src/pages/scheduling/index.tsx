/**
 *  scheduling/index.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';

const getQueryParams = (search: string) => {
  const params = new URLSearchParams(search);
  return {
    code: params.get('code'),
    state: params.get('state'),
    interviewerRecordId: params.get('interviewerRecordId'),
    email: params.get('email'),
    autoDetect: params.get('autoDetect'),
    source: params.get('source')
  };
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
    const { code, state: stateParam, interviewerRecordId, email, autoDetect, source } = getQueryParams(location.search);

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

    // Handle auto-detection
    if (autoDetect === 'true' && email) {
      fetch('/api/airtable/get-current-interviewer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source })
      })
      .then(res => res.json())
      .then(data => {
        if (data.interviewerRecordId) {
          // Redirect with the detected interviewer ID
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.set('interviewerRecordId', data.interviewerRecordId);
          newUrl.searchParams.set('email', data.email);
          newUrl.searchParams.delete('autoDetect');
          window.location.replace(newUrl.toString());
        } else {
          setError(data.error || 'Could not detect interviewer. Please contact support.');
        }
      })
      .catch(() => setError('Failed to detect interviewer. Please try again.'));
      return;
    }

    if (!interviewerRecordId) {
      setError('Missing interviewerRecordId. Please provide interviewerRecordId or use autoDetect=true with email.');
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
