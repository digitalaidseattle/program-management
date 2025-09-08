const functions = require('firebase-functions');
const express = require('express');
const axios = require('axios');
const Airtable = require('airtable');

const app = express();

async function handleCalendlyCallback(req, res) {
  try {
    const { code, state } = req.query;
    // Calendly redirect may not include redirect_uri; derive it from forwarded headers/host
    const forwardedProto = (req.headers['x-forwarded-proto'] || req.protocol || 'https').toString();
    const forwardedHost = (req.headers['x-forwarded-host'] || req.headers['host'] || '').toString();
    const derivedRedirectUri = `${forwardedProto}://${forwardedHost}/api/calendly/oauth/callback`;
    const redirect_uri = (req.query.redirect_uri || derivedRedirectUri).toString();
    if (!code) {
      return res.status(400).send('Missing code');
    }

    const parsedState = (() => {
      try { return state ? JSON.parse(state) : {}; } catch { return {}; }
    })();

    const clientId = process.env.CALENDLY_CLIENT_ID || functions.config().calendly?.client_id;
    const clientSecret = process.env.CALENDLY_CLIENT_SECRET || functions.config().calendly?.client_secret;
    let eventTypeUuid = process.env.CALENDLY_EVENT_TYPE_UUID || functions.config().calendly?.event_type_uuid;
    const airtablePat = process.env.AIRTABLE_PAT || functions.config().airtable?.pat;
    const airtableBaseId = process.env.AIRTABLE_BASE_ID || functions.config().airtable?.base_id;
    const airtableTableId = process.env.AIRTABLE_TABLE_ID || functions.config().airtable?.table_id;

    if (!clientId || !clientSecret) {
      return res.status(500).send('Calendly configuration missing');
    }
    if (!airtablePat || !airtableBaseId || !airtableTableId) {
      return res.status(500).send('Airtable configuration missing');
    }

    const tokenResp = await axios.post('https://auth.calendly.com/oauth/token', {
      grant_type: 'authorization_code',
      code,
      redirect_uri,
      client_id: clientId,
      client_secret: clientSecret
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    const accessToken = tokenResp.data?.access_token;
    if (!accessToken) {
      return res.status(502).send('Failed to obtain access token');
    }

    // Resolve user (owner) and event type
    const meResp = await axios.get('https://api.calendly.com/users/me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const userUri = meResp.data?.resource?.uri;
    if (!userUri) {
      return res.status(502).send('Unable to resolve Calendly user');
    }

    if (!eventTypeUuid) {
      const desiredName = parsedState?.eventTypeName;
      const etsResp = await axios.get(`https://api.calendly.com/event_types?user=${encodeURIComponent(userUri)}&active=true`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const eventTypes = etsResp.data?.collection || [];
      if (!eventTypes.length) {
        return res.status(404).send('No active Calendly event types found');
      }
      let chosen = eventTypes[0];
      if (desiredName) {
        const match = eventTypes.find(et => et.name === desiredName);
        if (match) chosen = match;
      }
      const uri = chosen.uri || '';
      eventTypeUuid = uri.substring(uri.lastIndexOf('/') + 1);
      if (!eventTypeUuid) {
        return res.status(502).send('Failed to derive event type UUID');
      }
    }

    // Create 10 single-use scheduling links (Calendly Scheduling Links API)
    const eventTypeUri = `https://api.calendly.com/event_types/${eventTypeUuid}`;
    const links = [];
    for (let i = 0; i < 10; i++) {
      const payload = {
        max_event_count: 1,
        owner: eventTypeUri,
        owner_type: 'EventType'
      };
      const createResp = await axios.post('https://api.calendly.com/scheduling_links', payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      const url = createResp.data?.resource?.booking_url || createResp.data?.collection?.[0]?.booking_url || createResp.data?.booking_url;
      if (url) links.push(url);
    }

    const base = new Airtable({ apiKey: airtablePat }).base(airtableBaseId);
    const interviewerRecordId = parsedState?.interviewerRecordId;

    const records = links.map((link) => ({
      fields: {
        'Scheduling link': link,
        'Status': 'Available',
        'Interviewer': interviewerRecordId ? [interviewerRecordId] : []
      }
    }));

    await base(airtableTableId).create(records);

    return res.status(200).json({ created: links.length });
  } catch (err) {
    const status = err.response?.status || 500;
    const message = err.response?.data || err.message || 'Unknown error';
    return res.status(status).send(typeof message === 'string' ? message : JSON.stringify(message));
  }
}

// Normal route when full path is preserved (deployed or emulator that forwards path)
app.get('/calendly/oauth/callback', handleCalendlyCallback);

// Handle when Hosting rewrites to the function base URL and drops the path
app.get('/', handleCalendlyCallback);

// Fallback for hosting rewrite that drops subpath when hitting the function base URL
app.get('*', (req, res, next) => {
  const original = req.headers['x-original-url'] || '';
  const path = req.path || '';
  if ((typeof original === 'string' && original.includes('/api/calendly/oauth/callback')) || path.includes('/calendly/oauth/callback')) {
    return handleCalendlyCallback(req, res);
  }
  return res.status(404).send('Not Found');
});

exports.api = functions.https.onRequest(app);
