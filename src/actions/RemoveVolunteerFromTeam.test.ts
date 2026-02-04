/**
 *  RemoveVolunteerFromTeam.test.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { describe, expect, it, vi } from "vitest";
import { team2VolunteerService } from "../services/dasTeam2VolunteerService";
import { Team } from "../services/dasTeamService";
import { Volunteer } from "../services/dasVolunteerService";
import { removeVolunteerFromTeam } from "./RemoveVolunteerFromTeam";

describe("removeToolFromTeam", () => {

    it("basic", () => {
        const volunteer = {} as Volunteer;
        const team = {} as Team;

        const removeSpy = vi.spyOn(team2VolunteerService, 'removeVolunteerFromTeam')
            .mockResolvedValue(true);

        removeVolunteerFromTeam(volunteer, team)
            .then((actual) => {
                expect(removeSpy).toBeCalledWith(volunteer, team);
                expect(actual).toBe(true)
            });
    });

});