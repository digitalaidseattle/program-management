/**
 *  projectService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { pmAirtableService } from "./airtableService";

const TASK_TABLE = 'tbl9Ttk2DUsAP2iDx';

class PMTaskService {

    getById = async (id: string): Promise<any> => {
        return pmAirtableService.getRecord(TASK_TABLE, id)
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

const pmTaskService = new PMTaskService()
export { pmTaskService };
