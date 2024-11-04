/**
 *  pmContributorService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { FieldSet, Record } from "airtable";
import { pmAirtableClient } from "../../../services/airtableClient";
import { AirtableRecordService } from "../../../services/airtableRecordService";
import { Project } from "./pmProjectService";

const SPRINT_TABLE = 'tbliVWHEcbUD1sVVA';

type Sprint = {
    id: string
    sprintId: string
    name: string
    description: string
    status: string
    startDate: Date
    endDate: Date
    taskIds: string[]
}

class PMSprintService extends AirtableRecordService<Sprint> {

    public constructor() {
        super(pmAirtableClient.base(import.meta.env.VITE_AIRTABLE_PM_BASE_ID_DAS), SPRINT_TABLE);
    }

    airtableTransform(record: Record<FieldSet>): Sprint {
        return {
            id: record.id,
            sprintId: record.fields['Sprint ID'],
            name: record.fields['Sprint Name'] ?? '',
            description: record.fields['Sprint Goal'],
            status: record.fields['Status'],
            startDate: record.fields['Start Date'] ? new Date(Date.parse(record.fields['Start Date'] as string)) : undefined,
            endDate: record.fields['End Date'] ? new Date(Date.parse(record.fields['End Date'] as string)) : undefined,
            taskIds: record.fields['Tasks']
        } as Sprint
    }

    async findByProject(project: Project): Promise<Sprint[]> {
        const FILTER = `FIND('${project.projectId}', ARRAYJOIN({Project}))`;
        return this.findAll(undefined, FILTER)
    }

}
const pmSprintService = new PMSprintService()
export { pmSprintService };
export type { Sprint };

