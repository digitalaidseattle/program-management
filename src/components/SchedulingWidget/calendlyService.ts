/**
 *  CalendlyService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */


const CLIENT_ID = import.meta.env.VITE_CALENDLY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CALENDLY_CLIENT_SECRET;

export type EventType = {
    id: string;
    name: string;
    uri: string;
}

class CalendlyService {


    public constructor() {
    }


    getAuthUri = (redirectUri: string) => {
        return `https://auth.calendly.com/oauth/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${redirectUri}`
    }

    async createOneTimeLinks(accessToken: string, eventTypeUri: string, nLinks: number): Promise<string[]> {
        // const eventTypeUri = `https://api.calendly.com/event_types/${eventTypeUuid}`;
        const links: any[] = [];
        for (let i = 0; i < nLinks; i++) {
            const payload = {
                max_event_count: 1,
                owner: eventTypeUri,
                owner_type: 'EventType'
            };
            const createResp = await fetch('https://api.calendly.com/scheduling_links', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            const createData = await createResp.json();
            console.log(createData)
            const url = createData.resource?.booking_url;
            links.push(url);
        }
        return links;
    }

    async getUser(accessToken: string): Promise<any> {
        // Resolve user (owner) and event type
        const meResp = await fetch('https://api.calendly.com/users/me', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        const data = meResp.json();
        return data;
    }

    async exchangeCodeForToken(authCode: string, redirectUri: string): Promise<string> {
        const resp = await fetch('https://auth.calendly.com/oauth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                grant_type: 'authorization_code',
                code: authCode,
                redirect_uri: redirectUri,
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET
            })
        })
        const data = await resp.json();
        return data.access_token;
    }

    async getEventTypes(accessToken: string, userUri: string): Promise<EventType[]> {
        const resp = await fetch(`https://api.calendly.com/event_types?user=${encodeURIComponent(userUri)}&active=true`,
            { headers: { Authorization: `Bearer ${accessToken}` } });
        const data = await resp.json();
        return data.collection.map((json: any) => ({ id: json.slug, name: json.name, uri: json.uri }));
    }
}

const calendlyService = new CalendlyService();
export { calendlyService };

