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

const CONTRIBUTOR_TABLE = 'tblOhMRP0MpMXzmjy';

type Contributor = {
    id: string
    name: string
    projectId: string[]
    role: string
    userRole: string
    dasEmail: string
}

class PMContributorService extends AirtableRecordService<Contributor> {

    public constructor() {
        super(pmAirtableClient.base(import.meta.env.VITE_AIRTABLE_PM_BASE_ID_DAS), CONTRIBUTOR_TABLE);
    }

    airtableTransform(record: Record<FieldSet>): Contributor {
        return {
            id: record.id,
            name: record.fields['Name'],
            projectId: record.fields['Project'],
            role: record.fields['Role'],
            userRole: record.fields['TasUser Role'],
            dasEmail: record.fields['DAS email']
        } as Contributor
    }

    findByProject(project: Project): Promise<Contributor[]> {
        const FILTER = `FIND('${project.projectId}', ARRAYJOIN({Project}))`;
        return this.findAll(undefined, FILTER)
    }

}

const pmContributorService = new PMContributorService()
export { pmContributorService };
export type { Contributor };

