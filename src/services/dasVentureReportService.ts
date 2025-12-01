import { Identifier } from "@digitalaidseattle/core";
import { supabaseClient, SupabaseEntityService } from "@digitalaidseattle/supabase";
import type { Venture } from "./dasVentureService";

export type HealthStatus = 'on_track' | 'at_risk' | 'blocked';

export type VentureReport = {
    id: string;
    venture_id: string;
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

export type VentureReportWithVenture = VentureReport & {
    venture?: Pick<Venture, 'id' | 'venture_code' | 'title'>
};

class VentureReportService extends SupabaseEntityService<VentureReport> {
    constructor() {
        super("venture_report");
    }

    async findByVentureId(ventureId: Identifier): Promise<VentureReport[]> {
        const { data, error } = await supabaseClient
            .from(this.tableName)
            .select("*")
            .eq("venture_id", ventureId)
            .order("reporting_date", { ascending: false });

        if (error) {
            throw error;
        }
        return (data ?? []) as VentureReport[];
    }

    async findRecentReports(limit = 100): Promise<VentureReportWithVenture[]> {
        const { data, error } = await supabaseClient
            .from(this.tableName)
            .select("*, venture(*)")
            .order("reporting_date", { ascending: false })
            .limit(limit);

        if (error) {
            throw error;
        }

        return (data ?? []) as VentureReportWithVenture[];
    }
}

export const ventureReportService = new VentureReportService();
