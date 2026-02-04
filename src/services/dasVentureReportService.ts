/**
 *  dasVentureReportService.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { v4 as uuid } from 'uuid';
import { Identifier } from "@digitalaidseattle/core";
import { supabaseClient, SupabaseEntityService } from "@digitalaidseattle/supabase";
import type { Venture } from "./dasVentureService";

export type HealthStatus = 'on_track' | 'at_risk' | 'blocked';

export type VentureReport = {
    id: string;
    venture_id: string;
    venture?: Venture;
    reported_by: string;
    reporting_date?: Date | null;
    health: HealthStatus;
    changes_by_partner?: string | null;
    successes?: string | null;
    challenges?: string | null;
    asks?: string | null;
    staffing_need?: string | null;
    next_steps?: string | null;
}
const DEFAULT_SELECT = "*, venture(*)";

class VentureReportService extends SupabaseEntityService<VentureReport> {

    static _instance: VentureReportService;
    static instance() {
        if (!this._instance) {
            this._instance = new VentureReportService();
        }
        return this._instance;
    }

    constructor() {
        super("venture_report", DEFAULT_SELECT);
    }

    empty(): VentureReport {
        return {
            id: uuid(),
            venture_id: '',
            reported_by: '',
            reporting_date: new Date(),
            health: 'on_track',
            changes_by_partner: '',
            successes: '',
            challenges: '',
            asks: '',
            staffing_need: '',
            next_steps: '',
        }
    }

    async findByVentureId(ventureId: Identifier): Promise<VentureReport[]> {
        const { data, error } = await supabaseClient
            .from(this.tableName)
            .select(DEFAULT_SELECT)
            .eq("venture_id", ventureId)
            .order("reporting_date", { ascending: false });

        if (error) {
            throw error;
        }
        return (data ?? []) as VentureReport[];
    }

    async findLatestByVentureId(ventureId: Identifier): Promise<VentureReport | undefined> {
        const { data, error } = await supabaseClient
            .from(this.tableName)
            .select(DEFAULT_SELECT)
            .eq("venture_id", ventureId)
            .order("reporting_date", { ascending: false })
            .limit(1)

        if (error) {
            throw error;
        }
        return data.length === 1 ? data[0] : undefined;
    }

    async findRecentReports(limit = 100): Promise<VentureReport[]> {
        const { data, error } = await supabaseClient
            .from(this.tableName)
            .select(DEFAULT_SELECT)
            .order("reporting_date", { ascending: false })
            .limit(limit);

        if (error) {
            throw error;
        }

        return data ?? [];
    }
}

export { VentureReportService };
