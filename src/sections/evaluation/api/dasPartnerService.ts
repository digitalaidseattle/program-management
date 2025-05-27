/**
 *  dasPartnerService.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { AirtableEntityService } from "@digitalaidseattle/airtable";
import Airtable, { FieldSet, Record } from "airtable";

const PARTNERS_TABLE = 'tblqttKinLZJ2JXo7';

type Partner = {
    id: string;
    name: string
    shorthandName: string
    status: string
    description: string
    gdriveLink: string
    hubspotLink: string
    miroLink: string
    overviewLink: string,
    logoUrl: string
}
const airtableClient = new Airtable({ apiKey: import.meta.env.VITE_AIRTABLE_ANON_KEY })

class DASPartnerService extends AirtableEntityService<Partner> {

    public constructor() {
        super(airtableClient, PARTNERS_TABLE);
    }

    transform(record: Record<FieldSet>): Partner {
        return {
            id: record.id,
            name: record.fields['Org name'],
            shorthandName: record.fields['Org shorthand'],
            status: record.fields['Status'],
            description: record.fields['Org description'],
            gdriveLink: record.fields['Gdrive link URL'],
            hubspotLink: record.fields["Hubspot interface"],
            miroLink: record.fields["Miro Board Link"],
            overviewLink: record.fields["Overview link"],
            logoUrl: record.fields["logo"] ? (record.fields["logo"] as any[])[0].url : undefined,
        } as Partner
    }
    
    transformEntity(entity: Partial<Partner>): Partial<FieldSet> {
        return {
            'Org name': entity.name,
            'Org shorthand': entity.shorthandName,
            'Status': entity.status,
            'Org description': entity.description,
            'Gdrive link URL': entity.gdriveLink,
            'Hubspot interface': entity.hubspotLink,
            'Miro Board Link': entity.miroLink,
            'Overview link': entity.overviewLink
        };
    }
}

const dasPartnerService = new DASPartnerService()
export { dasPartnerService };
export type { Partner };

