/**
 *  RemoveVolunteerFromTeam.test.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { describe, expect, it, vi } from "vitest";
import { Team2VolunteerService } from "../services/dasTeam2VolunteerService";
import { Team } from "../services/dasTeamService";
import { removeVolunteerFromTeam } from "./RemoveVolunteerFromTeam";
import { Volunteer } from "../data/types";

describe("removeToolFromTeam", () => {

    it("basic", () => {
        const volunteer = {} as Volunteer;
        const team = {} as Team;

        const removeSpy = vi.spyOn(Team2VolunteerService.getInstance(), 'removeVolunteerFromTeam')
            .mockResolvedValue(true);

        removeVolunteerFromTeam(volunteer, team)
            .then((actual) => {
                expect(removeSpy).toBeCalledWith(volunteer, team);
                expect(actual).toBe(true)
            });
    });

});