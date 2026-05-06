import dayjs from "dayjs";
import {
  MyMeeting,
  TimeOffEntry,
} from "../types/timeOff";
import { meetingDao } from "../dao/meetingDao";
import { timeOffDao } from "../dao/timeOffDao";
import {
  getMeetingTime,
  getSingleMeeting,
  isMeetingOverlapping,
} from "../utils/meetingUtils";

export const timeOffService = {
  async loadTimeOffEntries(volunteerId: string): Promise<TimeOffEntry[]> {
    const rows = await timeOffDao.getByVolunteerId(volunteerId);

    return rows
      .map((row) => ({
        id: row.id,
        start: row.start_at,
        end: row.end_at,
        reason: row.reason ?? undefined,
      }))
      .sort((a, b) => dayjs(a.start).valueOf() - dayjs(b.start).valueOf());
  },

  async loadMyMeetings(profileId: string): Promise<MyMeeting[]> {
    const rows = await meetingDao.getMeetingAttendeesByProfileId(profileId);

    return rows
      .map((row) => {
        const meeting = getSingleMeeting(row.meeting);
        if (!meeting) return null;

        return {
          attendee_id: row.id,
          status: row.status ?? null,
          meeting,
        };
      })
      .filter((row): row is MyMeeting => row !== null)
      .sort(
        (a, b) =>
          dayjs(a.meeting.start_date).valueOf() -
          dayjs(b.meeting.start_date).valueOf()
      );
  },

  async createTimeOff(params: {
    volunteerId: string;
    profileId: string;
    start: string;
    end: string;
    reason: string;
  }): Promise<{
    entry: TimeOffEntry;
    markedAbsentIds: string[];
  }> {
    const startIso = dayjs(params.start).utc().toISOString();
    const endIso = dayjs(params.end).utc().toISOString();

    if (dayjs(endIso).isBefore(dayjs(startIso))) {
      throw new Error("End date must be after start date");
    }

    const inserted = await timeOffDao.create({
      volunteer_id: params.volunteerId,
      start_at: startIso,
      end_at: endIso,
      reason: params.reason.trim() || null,
    });

    const overlapRows = await meetingDao.getMeetingTimesByProfileId(
      params.profileId
    );

    const overlappingAttendeeIds = overlapRows
      .map((row) => {
        const meeting = getMeetingTime(row.meeting);
        if (!meeting) return null;

        const status = (row.status ?? "").toLowerCase();

        return isMeetingOverlapping(
          meeting.start_date,
          meeting.end_date,
          startIso,
          endIso
        ) && status !== "absent"
          ? row.id
          : null;
      })
      .filter((id): id is string => id !== null);

    await meetingDao.updateStatuses(overlappingAttendeeIds, "absent");

    return {
      entry: {
        id: inserted.id,
        start: inserted.start_at,
        end: inserted.end_at,
        reason: inserted.reason ?? undefined,
      },
      markedAbsentIds: overlappingAttendeeIds,
    };
  },

  async deleteTimeOff(params: {
    profileId: string;
    entry: TimeOffEntry;
  }): Promise<{ restoredIds: string[] }> {
    const overlapRows = await meetingDao.getMeetingTimesByProfileId(
      params.profileId
    );

    const overlappingAbsentIds = overlapRows
      .map((row) => {
        const meeting = getMeetingTime(row.meeting);
        if (!meeting) return null;

        const status = (row.status ?? "").toLowerCase();

        return status === "absent" &&
          isMeetingOverlapping(
            meeting.start_date,
            meeting.end_date,
            params.entry.start,
            params.entry.end
          )
          ? row.id
          : null;
      })
      .filter((id): id is string => id !== null);

    await meetingDao.updateStatuses(overlappingAbsentIds, "going");
    await timeOffDao.deleteById(params.entry.id);

    return { restoredIds: overlappingAbsentIds };
  },

  async toggleMeetingAbsent(
    attendeeId: string,
    makeAbsent: boolean
  ): Promise<string> {
    const nextStatus = makeAbsent ? "absent" : "going";
    await meetingDao.updateStatus(attendeeId, nextStatus);
    return nextStatus;
  },
};