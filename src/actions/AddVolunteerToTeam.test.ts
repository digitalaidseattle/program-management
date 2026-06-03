/**
 *  addVolunteerToTeam.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { describe, expect, it, vi } from "vitest";
import { Team2Volunteer, Team2VolunteerService } from "../services/dasTeam2VolunteerService";
import { Team } from "../services/dasTeamService";
import { addVolunteerToTeam } from "./AddVolunteerToTeam";
import { Volunteer } from "../services/dasVolunteerDao";

describe("addVolunteerToTeam", () => {

    it("basic", () => {
        const team = { id: "team_id" } as Team;
        const volunteer = { id: "volunteer_id" } as Volunteer;
        const t2v = {} as Team2Volunteer;

        const addSpy = vi.spyOn(Team2VolunteerService.getInstance(), 'addVolunteerToTeam')
            .mockResolvedValue(t2v);

        addVolunteerToTeam(volunteer, team)
            .then((actual) => {
                expect(addSpy).toBeCalledWith(volunteer, team);
                expect(actual).toBe(t2v)
            });
    });

});