/**
 *  CreateLeadershipMeeting.test.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { describe, expect, it, vi } from "vitest";
import { Meeting, MeetingAttendee, meetingAttendeeService, meetingService } from "../services/dasMeetingService";
import { Team2Volunteer, team2VolunteerService } from "../services/dasTeam2VolunteerService";
import { createLeadershipMeeting } from "./CreateLeadershipMeeting";

describe("CreateLeadershipMeeting", () => {
    it.beforeEach(() => {
        vi.resetAllMocks();
    })

    it("basic", () => {
        const leader = {
            team_id: "team_id",
            volunteer_id: "volunteer_id",
            leader: true,
            team: {},
            volunteer: {
                profile_id: 'profile_id',
                profile: {
                    id: 'profile_id',
                },
                das_email: "e@das.com"
            },
        } as Team2Volunteer;
        const insertedAttendee = {} as MeetingAttendee;
        const inserted = { id: "inserted_id" } as Meeting;
        const found = {} as Meeting;
        const leadersSpy = vi.spyOn(team2VolunteerService, 'findLeaders')
            .mockResolvedValue([leader]);
        const insertMeetingSpy = vi.spyOn(meetingService, 'insert')
            .mockResolvedValue(inserted);
        const insertAttendedSpy = vi.spyOn(meetingAttendeeService, 'batchInsert')
            .mockResolvedValue([insertedAttendee]);
        const getByIdSpy = vi.spyOn(meetingService, 'getById')
            .mockResolvedValue(found);

        createLeadershipMeeting()
            .then((actual) => {
                expect(leadersSpy).toBeCalledTimes(1);
                expect(insertMeetingSpy).toBeCalledWith({
                    id: expect.any(String),
                    name: `Leadership`,
                    type: 'leadership',
                    start_date: expect.any(Date),
                    end_date: expect.any(Date),
                    meeting_url: 'https://meet.google.com/swr-ixuh-xdc',
                    status: 'new',
                    notes: '',
                });
                expect(insertAttendedSpy).toBeCalledWith({
                    email: "e@das.com",
                    id: expect.any(String),
                    meeting_id: expect.any(String),
                    profile_id: "profile_id",
                    status: "unknown",
                });
                expect(getByIdSpy).toBeCalledWith("inserted_id");
                expect(actual).toBe(found);
            });
    });

});