/**
 *  dasPartnerService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { dasAirtableService } from "./airtableService";

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
    overviewLink: string
}
class DASPartnerService {
    getById = async (id: string): Promise<Partner> => {
        return dasAirtableService
            .getRecord(PARTNERS_TABLE, id)
            .then(record => {
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
                }
            })
    }

    update = async (partner: Partner, changes: any): Promise<any> => {
        return dasAirtableService
            .update(PARTNERS_TABLE, partner.id, changes)
            .then((records: any) => records)
    }

}

const dasPartnerService = new DASPartnerService()
export { dasPartnerService };
export type { Partner }