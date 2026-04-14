import { supabaseClient } from "@digitalaidseattle/supabase";
import { TimeOffRow } from "../types/timeOff";

export const timeOffDao = {
  async getByVolunteerId(volunteerId: string): Promise<TimeOffRow[]> {
    const { data, error } = await supabaseClient
      .from("time_off")
      .select("id, start_at, end_at, reason")
      .eq("volunteer_id", volunteerId)
      .order("start_at", { ascending: true });

    if (error) throw error;
    return (data ?? []) as TimeOffRow[];
  },

  async create(input: {
    volunteer_id: string;
    start_at: string;
    end_at: string;
    reason: string | null;
  }): Promise<TimeOffRow> {
    const { data, error } = await supabaseClient
      .from("time_off")
      .insert([input])
      .select("id, start_at, end_at, reason")
      .single();

    if (error) throw error;
    return data as TimeOffRow;
  },

  async deleteById(id: string): Promise<void> {
    const { error } = await supabaseClient
      .from("time_off")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};