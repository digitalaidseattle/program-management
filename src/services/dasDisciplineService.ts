/**
 *  dasVolunteerService.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { SupabaseEntityService } from "@digitalaidseattle/supabase";
import { Discipline, DisciplineDao } from "./dasDisciplineDao";
import { getCoreServices, PageInfo, QueryModel } from "@digitalaidseattle/core";

class DisciplineService extends SupabaseEntityService<Discipline> {

    static STATUSES = [
        'Public',
        'Internal'
    ];

    static _instance: DisciplineService;

    static getInstance(): DisciplineService {
        if (!this._instance) {
            this._instance = new DisciplineService();
        }
        return this._instance;
    }


    public constructor() {
        super(DisciplineDao.getInstance());
    }

    getDao(): DisciplineDao {
        return this.dao as DisciplineDao;
    }

    async find(queryModel: QueryModel): Promise<PageInfo<Discipline>> {
        return this.getDao().find(queryModel);
    }

    async findByAirtableId(airtableId: string): Promise<Discipline> {
        return this.getDao().findByAirtableId(airtableId);
    }

    getIconUrl(entity: Discipline): string | undefined {
        const storageService = getCoreServices().storageService!;
        return storageService.getUrl(entity.icon);
    }

    getNextLocation(entity: Discipline): string {
        const current = entity.icon ? entity.icon.split(':') : [];
        const idx = current.length < 2 ? 1 : Number(current[1]);
        return `icons/${entity.icon}:${idx}`; // idx helps deal with CDN
    }

    async findByStatus(status: string): Promise<Discipline[]> {
        return this.getDao().findByStatus(status)
    }
}


export { DisciplineService };
export type { Discipline };

