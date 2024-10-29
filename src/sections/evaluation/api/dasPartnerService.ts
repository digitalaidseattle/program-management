/**
 *  dasPartnerService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { FieldSet, Record } from "airtable";
import { dasAirtableClient } from "../../../services/airtableClient";
import { AirtableRecordService } from "../../../services/airtableRecordService";

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
class DASPartnerService extends AirtableRecordService<Partner> {

    public constructor() {
        super(dasAirtableClient.base(import.meta.env.VITE_AIRTABLE_BASE_ID_DAS), PARTNERS_TABLE);
    }

    airtableTransform(record: Record<FieldSet>): Partner {
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

}

const dasPartnerService = new DASPartnerService()
export { dasPartnerService };
export type { Partner };
