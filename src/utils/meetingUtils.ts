import dayjs from "dayjs";
import {
  MeetingInfo,
  MeetingRelation,
  MeetingTimeInfo,
  MeetingTimeRelation,
} from "../types/timeOff";

export const getSingleMeeting = (
  meeting: MeetingRelation
): MeetingInfo | null => {
  if (!meeting) return null;
  return Array.isArray(meeting) ? meeting[0] ?? null : meeting;
};

export const getMeetingTime = (
  meeting: MeetingTimeRelation
): MeetingTimeInfo | null => {
  if (!meeting) return null;
  return Array.isArray(meeting) ? meeting[0] ?? null : meeting;
};

export const isMeetingOverlapping = (
  startA: string,
  endA: string,
  startB: string,
  endB: string
) => {
  return (
    dayjs(startA).isBefore(dayjs(endB)) &&
    dayjs(endA).isAfter(dayjs(startB))
  );
};

export const formatDate = (value: string) => {
  if (!value) return "—";
  const d = dayjs(value);
  return d.isValid() ? d.format("DD/MM/YYYY HH:mm") : value;
};