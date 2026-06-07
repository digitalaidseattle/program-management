/**
 *  dasVentureReportService.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { Identifier, PageInfo, QueryModel } from "@digitalaidseattle/core";
import { SupabaseEntityService } from '@digitalaidseattle/supabase';
import { HealthStatus, VentureReport, VentureReportDao } from './dasVentureReportDao';


export async function ventureReportSave(report: VentureReport): Promise<VentureReport> {
    const ventureReportService = VentureReportService.getInstance();
    const cleaned = { ...report };
    delete cleaned.venture;

    console.log(cleaned);
    return ventureReportService.upsert(cleaned)
}

class VentureReportService extends SupabaseEntityService<VentureReport> {

    static _instance: VentureReportService;
    static getInstance() {
        if (!this._instance) {
            this._instance = new VentureReportService();
        }
        return this._instance;
    }

    constructor() {
        super(VentureReportDao.getInstance());
    }

    getDao(): VentureReportDao {
        return this.dao as VentureReportDao;
    }

    empty(): VentureReport {
        return this.getDao().empty();
    }

    async find(queryModel: QueryModel): Promise<PageInfo<VentureReport>> {
        return this.getDao().find(queryModel);
    }

    async findByVentureId(ventureId: Identifier): Promise<VentureReport[]> {
        return this.getDao().findByVentureId(ventureId);
    }

    async findLatestByVentureId(ventureId: Identifier): Promise<VentureReport | undefined> {
        return this.getDao().findLatestByVentureId(ventureId);
    }

    async findRecentReports(limit: number): Promise<VentureReport[]> {
        return this.getDao().findRecentReports(limit);

    }
}

export { VentureReportService };
export type { HealthStatus, VentureReport };

