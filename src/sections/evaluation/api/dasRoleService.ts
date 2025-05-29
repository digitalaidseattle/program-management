/**
 *  dasRoleService.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { AirtableEntityService } from "@digitalaidseattle/airtable";
import { FieldSet, Record } from "airtable";
import { dasAirtableClient } from "../../../services/airtableClient";

const ROLES_TABLE = 'tblBNPY8DODvUU3ZA';

type Role = {
    id: string,
    name: string,
    status: string,
}

class DASRoleService extends AirtableEntityService<Role> {

    public constructor() {
        super(dasAirtableClient, ROLES_TABLE);
    }

    transform(record: Record<FieldSet>): Role {
        return {
            id: record.id,
            name: record.fields['Role'],
            status: record.fields['Status'],
        } as Role
    }

    transformEntity(entity: Partial<Role>): Partial<FieldSet> {
        const fields: Partial<FieldSet> = {};
        if (entity.name !== undefined) {
            fields['Role'] = entity.name;
        }
        if (entity.status !== undefined) {
            fields['Status'] = entity.status;
        }
        return fields;
    }


};


const dasRoleService = new DASRoleService();
export { dasRoleService };
export type { Role };

