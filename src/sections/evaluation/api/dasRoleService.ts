/**
 *  dasStaffingService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { FieldSet, Record } from "airtable";
import { dasAirtableService } from "../../../services/airtableService";

const ROLES_TABLE = 'tblBNPY8DODvUU3ZA';

type Role = {
    id: string,
    name: string,
    status: string,
}

class DASRoleService {

    transform = (r: Record<FieldSet>): Role => {
        return {
            id: r.id,
            name: r.fields['Role'],
            status: r.fields['Status'],
        } as Role
    }

    async findAll(): Promise<Role[]> {
        return dasAirtableService.getTableRecords(ROLES_TABLE)
            .then(records => records.map(r => this.transform(r)))
    }

};


const dasRoleService = new DASRoleService();
export { dasRoleService };
export type { Role };

