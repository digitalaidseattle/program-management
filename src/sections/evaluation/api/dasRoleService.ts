/**
 *  dasStaffingService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { FieldSet, Record } from "airtable";
import { dasAirtableClient } from "../../../services/airtableClient";
import { AirtableRecordService } from "../../../services/airtableRecordService";

const ROLES_TABLE = 'tblBNPY8DODvUU3ZA';

type Role = {
    id: string,
    name: string,
    status: string,
}

class DASRoleService extends AirtableRecordService<Role> {

    public constructor() {
        super(dasAirtableClient.base(import.meta.env.VITE_AIRTABLE_BASE_ID_DAS), ROLES_TABLE);
    }

    airtableTransform(record: Record<FieldSet>): Role {
        return {
            id: record.id,
            name: record.fields['Role'],
            status: record.fields['Status'],
        } as Role
    }

};


const dasRoleService = new DASRoleService();
export { dasRoleService };
export type { Role };

