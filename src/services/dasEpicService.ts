/**
 *  projectService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { airtableService } from "./airtableService";

const EPIC_TABLE = 'tblrCoHnjUwyC2kwq';

class DASEpicService {

    create = async (epic: any): Promise<any[]> => {
        return airtableService.createRecord(EPIC_TABLE, epic)
            .then(resp => resp)
    }

    getById = async (id: string): Promise<any> => {
        return airtableService.getRecord(EPIC_TABLE, id)
            .then(r => {
                console.log('task', r)
                return {
                    id: r.id,
                    name: r.fields['Name'],
                    description: r.fields['Description'],
                    status: r.fields['Task Status'],
                    assignee: r.fields['Task Assignee'],
                } as any
            })
    }

}

const dasEpicService = new DASEpicService()
export { dasEpicService };
