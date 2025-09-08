const functions = require('firebase-functions');
const express = require('express');
const axios = require('axios');
const Airtable = require('airtable');

const app = express();
app.use(express.json());

function getConfig() {
  return {
    calendly: {
      clientId: process.env.CALENDLY_CLIENT_ID || functions.config().calendly?.client_id,
      clientSecret: process.env.CALENDLY_CLIENT_SECRET || functions.config().calendly?.client_secret,
      eventTypeUuid: process.env.CALENDLY_EVENT_TYPE_UUID || functions.config().calendly?.event_type_uuid
    },
    airtable: {
      pat: process.env.AIRTABLE_PAT || functions.config().airtable?.pat,
      baseId: process.env.AIRTABLE_BASE_ID || functions.config().airtable?.base_id,
      tableId: process.env.AIRTABLE_TABLE_ID || functions.config().airtable?.table_id
    }
  };
}

function createAirtableBase(pat, baseId) {
  return new Airtable({ apiKey: pat }).base(baseId);
}

function handleError(err, res) {
  const status = err.response?.status || 500;
  const message = err.response?.data || err.message || 'Unknown error';
  return res.status(status).send(typeof message === 'string' ? message : JSON.stringify(message));
}

function validateConfig(config, requiredFields) {
  const missing = requiredFields.filter(field => !config[field]);
  if (missing.length > 0) {
    throw new Error(`${missing.join(', ')} configuration missing`);
  }
}

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

    const config = getConfig();
    validateConfig(config.calendly, ['clientId', 'clientSecret']);
    validateConfig(config.airtable, ['pat', 'baseId', 'tableId']);

    const tokenResp = await axios.post('https://auth.calendly.com/oauth/token', {
      grant_type: 'authorization_code',
      code,
      redirect_uri,
      client_id: config.calendly.clientId,
      client_secret: config.calendly.clientSecret
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

    let eventTypeUuid = config.calendly.eventTypeUuid;
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

    const base = createAirtableBase(config.airtable.pat, config.airtable.baseId);
    const interviewerRecordId = parsedState?.interviewerRecordId;

    const records = links.map((link) => ({
      fields: {
        'Scheduling link': link,
        'Status': 'Available',
        'Interviewer': interviewerRecordId ? [interviewerRecordId] : []
      }
    }));

    await base(config.airtable.tableId).create(records);

    return res.status(200).json({ created: links.length });
  } catch (err) {
    return handleError(err, res);
  }
}

// Interviewer detection handler
async function handleInterviewerDetect(req, res) {
  try {
    const { email, source } = req.body || {};
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const config = getConfig();
    validateConfig(config.airtable, ['pat', 'baseId']);

    const base = createAirtableBase(config.airtable.pat, config.airtable.baseId);
    
    // Proctors table ID
    const proctorsTableId = 'tblKQ7tCTI0WTbkvy';

    const emailLowerRaw = String(email).trim().toLowerCase();
    const emailLower = emailLowerRaw.replace(/'/g, "\\'");
    const candidateFields = [
      'Email', 'email', 'E-mail', 'E-Mail', 'Email Address', 'Email address', 'email address',
      'Work Email', 'Work E-mail', 'Work Email Address', 'Work email',
      'Personal Email', 'Primary Email', 'Primary Email Address', 'Contact Email', 'Contact E-mail',
      'OS email', 'OS Email'
    ];

    functions.logger.info('Interviewer detection start', { email, emailLower: emailLowerRaw, source, proctorsTableId, candidateFields });

    for (const fieldName of candidateFields) {
      const formula = `LOWER({${fieldName}}) = '${emailLower}'`;
      try {
        functions.logger.info('Attempting lookup', { fieldName, formula });
        const page = await base(proctorsTableId).select({
          filterByFormula: formula,
          maxRecords: 1
        }).firstPage();
        functions.logger.info('Lookup result', { fieldName, count: page.length });
        if (page.length > 0) {
          const record = page[0];
          const found = {
            interviewerRecordId: record.id,
            email: record.get(fieldName) || record.get('Email') || email,
            name: record.get('Name') || record.get('Full Name') || 'Unknown',
            matchedField: fieldName
          };
          functions.logger.info('Interviewer detected', found);
          return res.json(found);
        }
      } catch (e) {
        functions.logger.warn('Lookup failed for field', { fieldName, error: e?.message || String(e) });
        // Continue to next candidate field
      }
    }

    // Extra diagnostics: sample a few records to inspect field names and email-like fields
    try {
      const sample = await base(proctorsTableId).select({ maxRecords: 3 }).firstPage();
      const samples = sample.map((rec) => {
        const fields = Object.keys(rec.fields || {});
        const emailish = fields.filter((f) => /mail/i.test(f)).reduce((acc, f) => {
          acc[f] = rec.get(f);
          return acc;
        }, {});
        return { id: rec.id, fields, emailish };
      });
      functions.logger.info('Interviewer diagnostics sample', { samplesCount: samples.length, samples });
    } catch (diagErr) {
      functions.logger.warn('Diagnostics sampling failed', { error: diagErr?.message || String(diagErr) });
    }

    functions.logger.info('Interviewer not found after trying fields', { emailLower: emailLowerRaw, tried: candidateFields });
    return res.status(404).json({ error: 'Interviewer not found', email, triedFields: candidateFields });
  } catch (err) {
    console.error('Error finding interviewer:', err);
    return handleError(err, res);
  }
}

// Interviewer detection endpoint (must be before wildcard routes)
app.post('/airtable/get-current-interviewer', handleInterviewerDetect);

// Normal route when full path is preserved (deployed or emulator that forwards path)
app.get('/calendly/oauth/callback', handleCalendlyCallback);

// Handle when Hosting rewrites to the function base URL and drops the path
app.get('/', handleCalendlyCallback);

// Fallback for hosting rewrite that drops subpath when hitting the function base URL
app.all('*', (req, res) => {
  const original = (req.headers['x-original-url'] || '').toString();
  const path = (req.path || '').toString();
  const method = (req.method || '').toUpperCase();

  if ((original.includes('/api/calendly/oauth/callback') || path.includes('/calendly/oauth/callback')) && method === 'GET') {
    return handleCalendlyCallback(req, res);
  }
  if (original.includes('/api/airtable/get-current-interviewer') || path.includes('/airtable/get-current-interviewer')) {
    return handleInterviewerDetect(req, res);
  }
  return res.status(404).send('Not Found');
});

exports.api = functions.https.onRequest(app);
