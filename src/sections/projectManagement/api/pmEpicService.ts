/**
 *  pmEpicService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { pmAirtableService } from "../../../services/airtableService";

const EPIC_TABLE = 'tblrCoHnjUwyC2kwq';

class PMEpicService {

    create = async (epic: any): Promise<any[]> => {
        return pmAirtableService.createRecord(EPIC_TABLE, epic)
            .then(resp => resp)
    }

    getById = async (id: string): Promise<any> => {
        return pmAirtableService.getRecord(EPIC_TABLE, id)
            .then(r => {
                return {
                    id: r.id,
                    name: r.fields['Name'],
                    description: r.fields['Description'],
                    status: r.fields['Task Status'],
                    assignee: r.fields['Task Assignee'],
                    startDate: r.fiels['Start Date']
                } as any
            })
    }

}

const pmEpicService = new PMEpicService()
export { pmEpicService };
