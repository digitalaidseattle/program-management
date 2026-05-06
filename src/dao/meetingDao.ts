import { supabaseClient } from "@digitalaidseattle/supabase";
import {
  MeetingAttendeeRow,
  MeetingOverlapRow,
} from "../types/timeOff";

export const meetingDao = {
  async getMeetingAttendeesByProfileId(
    profileId: string
  ): Promise<MeetingAttendeeRow[]> {
    const { data, error } = await supabaseClient
      .from("meeting_attendee")
      .select(`
        id,
        status,
        meeting:meeting_id (
          id,
          name,
          start_date,
          end_date,
          type
        )
      `)
      .eq("profile_id", profileId);

    if (error) throw error;
    return (data ?? []) as MeetingAttendeeRow[];
  },

  async getMeetingTimesByProfileId(
    profileId: string
  ): Promise<MeetingOverlapRow[]> {
    const { data, error } = await supabaseClient
      .from("meeting_attendee")
      .select(`
        id,
        status,
        meeting:meeting_id (
          start_date,
          end_date
        )
      `)
      .eq("profile_id", profileId);

    if (error) throw error;
    return (data ?? []) as MeetingOverlapRow[];
  },

  async updateStatuses(attendeeIds: string[], status: string): Promise<void> {
    if (attendeeIds.length === 0) return;

    const { error } = await supabaseClient
      .from("meeting_attendee")
      .update({ status })
      .in("id", attendeeIds);

    if (error) throw error;
  },

  async updateStatus(attendeeId: string, status: string): Promise<void> {
    const { error } = await supabaseClient
      .from("meeting_attendee")
      .update({ status })
      .eq("id", attendeeId);

    if (error) throw error;
  },
};