/**
 *  dasToolService.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { SupabaseEntityService } from "@digitalaidseattle/supabase";
import { Tool, ToolsDao } from "./dasToolsDao";
import { getCoreServices, PageInfo, QueryModel } from "@digitalaidseattle/core";

class ToolService extends SupabaseEntityService<Tool> {

    static STATUSES = [
        'active',
        'inactive',
    ];

    static _instance: ToolService;

    static getInstance(): ToolService {
        if (!this._instance) {
            this._instance = new ToolService();
        }
        return this._instance;
    }

    public constructor() {
        super(ToolsDao.getInstance());
    }

    getDao(): ToolsDao {
        return this.dao as ToolsDao;
    }

    async find(queryModel: QueryModel): Promise<PageInfo<Tool>> {
        return this.getDao().find(queryModel);
    }

    async findByAirtableId(airtableId: string): Promise<Tool> {
        return this.getDao().findByAirtableId(airtableId);
    }

    getLogoUrl(tool: Tool): string | undefined {
        const storageService = getCoreServices().storageService!;
        return tool.logo ? storageService.getUrl(tool.logo) : undefined
    }

    getNextLocation(tool: Tool): string {
        const current = tool.logo ? tool.logo.split(':') : [];
        const idx = current.length < 2 ? 1 : Number(current[1]);
        return `logos/${tool.id}:${idx}`; // idx helps deal with CDN
    }

    async findByStatus(status: string): Promise<Tool[]> {
        return this.getDao().findByStatus(status);
    }
}


export { ToolService };
export type { Tool }

