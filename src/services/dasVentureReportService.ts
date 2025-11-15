import { Identifier } from "@digitalaidseattle/core";
import { supabaseClient, SupabaseEntityService } from "@digitalaidseattle/supabase";

export type HealthStatus = 'on_track' | 'at_risk' | 'blocked';

export type VentureReport = {
    id: string;
    venture_id: string;
    reported_by: string;
    report_period: string;
    health: HealthStatus;
    changes_by_partner?: string | null;
    successes?: string | null;
    challenges?: string | null;
    asks?: string | null;
    staffing_need?: string | null;
    next_steps?: string | null;
}

class VentureReportService extends SupabaseEntityService<VentureReport> {
    constructor() {
        super("venture_report");
    }

    async findByVentureId(ventureId: Identifier): Promise<VentureReport[]> {
        const { data, error } = await supabaseClient
            .from(this.tableName)
            .select("*")
            .eq("venture_id", ventureId)
            .order("report_period", { ascending: false });

        if (error) {
            throw error;
        }
        return (data ?? []) as VentureReport[];
    }
}

export const ventureReportService = new VentureReportService();
