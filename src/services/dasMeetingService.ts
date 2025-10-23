/**
 *  dasVolunteerService.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { supabaseClient, SupabaseEntityService } from "@digitalaidseattle/supabase";
import { Profile } from "./dasProfileService";

type MeetingAttendee = {
    id: string;
    profile: Profile;
    present: boolean;
    email: string;
}

type MeetingTopic = {
    id: string,
    type: string,
    description: string,
    discussed: boolean
}

type Meeting = {
    id: string;
    name: string;
    type: string;
    date: Date;
    attendees: MeetingAttendee[];
    topics: MeetingTopic[];
    meetingUrl: string;
    status: string;
}

class MeetingService extends SupabaseEntityService<Meeting> {

    public constructor() {
        super("meeting");
    }

    async findByAirtableId(airtableId: string): Promise<Meeting> {
        return await supabaseClient
            .from(this.tableName)
            .select('*')
            .eq('airtable_id', airtableId)
            .single()
            .then((resp: any) => resp.data);
    }

}

const meetingService = new MeetingService();

export { meetingService };
export type { Meeting };

