import { Identifier } from "@digitalaidseattle/core";
import { supabaseClient, SupabaseEntityService } from "@digitalaidseattle/supabase";

export type VentureReport = {
    id: string;
    venture_id: string;
    reported_by: string;
    created_at: string;
    report_month: number;
    report_year: number;
    report_content: Record<string, any>;
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
            .order("report_year", { ascending: false })
            .order("report_month", { ascending: false });

        if (error) {
            throw error;
        }
        return (data ?? []) as VentureReport[];
    }
}

export const ventureReportService = new VentureReportService();
