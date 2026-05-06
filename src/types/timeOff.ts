export interface TimeOffEntry {
    id: string;
    start: string;
    end: string;
    reason?: string;
  }
  
  export type MeetingInfo = {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
    type?: string | null;
  };
  
  export type MyMeeting = {
    attendee_id: string;
    status: string | null;
    meeting: MeetingInfo;
  };
  
  export type TimeOffRow = {
    id: string;
    start_at: string;
    end_at: string;
    reason: string | null;
  };
  
  export type MeetingRelation = MeetingInfo | MeetingInfo[] | null;
  
  export type MeetingAttendeeRow = {
    id: string;
    status: string | null;
    meeting: MeetingRelation;
  };
  
  export type MeetingTimeInfo = {
    start_date: string;
    end_date: string;
  };
  
  export type MeetingTimeRelation = MeetingTimeInfo | MeetingTimeInfo[] | null;
  
  export type MeetingOverlapRow = {
    id: string;
    status: string | null;
    meeting: MeetingTimeRelation;
  };