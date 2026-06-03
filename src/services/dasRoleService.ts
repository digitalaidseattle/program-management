/**
 *  dasVolunteerService.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { getCoreServices, PageInfo, QueryModel, StorageService } from "@digitalaidseattle/core";
import { SupabaseEntityService } from "@digitalaidseattle/supabase";
import { Role, RoleDao } from "./dasRoleDao";

class RoleService extends SupabaseEntityService<Role> {


    static STATUSES = ['Active', 'Inactive'];

    static _instance: RoleService;

    static getInstance(): RoleService {
        if (!this._instance) {
            this._instance = new RoleService();
        }
        return this._instance;
    }


    storageService: StorageService;

    public constructor() {
        super(RoleDao.getInstance());
        this.storageService = getCoreServices().storageService!;
    }

    getDao(): RoleDao {
        return this.dao as RoleDao;
    }

    async find(queryModel: QueryModel): Promise<PageInfo<Role>> {
        return this.getDao().find(queryModel);
    }

    async findByAirtableId(airtableId: string): Promise<Role> {
        return await this.getDao().findByAirtableId(airtableId);
    }

    getIconUrl(entity: Role): string | undefined {
        return entity.pic ? this.storageService.getUrl(entity.pic) : undefined
    }

    async findByStatus(status: string): Promise<Role[]> {
        return this.getDao().findByStatus(status);
    }
}


export { RoleService };
export type { Role };

