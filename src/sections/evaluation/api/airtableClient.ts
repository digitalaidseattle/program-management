/**
 *  airtableClient.ts
 * 
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import Airtable from 'airtable';

const dasAirtableClient = new Airtable({ apiKey: import.meta.env.VITE_AIRTABLE_PAT })

const pmAirtableClient = new Airtable({ apiKey: import.meta.env.VITE_AIRTABLE_PM_ANON_KEY })

export { dasAirtableClient, pmAirtableClient };