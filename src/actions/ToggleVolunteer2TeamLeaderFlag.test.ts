/**
 *  ToggleVolunteer2DisciplineSeniorFlag.test.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { describe, expect, it, vi } from "vitest";
import { Team2Volunteer, team2VolunteerService } from "../services/dasTeam2VolunteerService";
import { toggleVolunteer2TeamLeaderFlag } from "./ToggleVolunteer2TeamLeaderFlag";

describe("toggleVolunteer2TeamLeaderFlag", () => {
    it.beforeEach(() => {
        vi.resetAllMocks();
    })

    it("basic", () => {
        const v2d = { leader: false } as Team2Volunteer;
        const updated = {} as Team2Volunteer;

        const updateSpy = vi.spyOn(team2VolunteerService, 'update')
            .mockResolvedValue(updated);

        toggleVolunteer2TeamLeaderFlag(v2d)
            .then((actual) => {
                expect(updateSpy).toBeCalledWith(v2d, { leader: true });
                expect(actual).toBe(updated)
            });
    });

    it("undefined", () => {
        const v2d = {} as Team2Volunteer;
        const updated = {} as Team2Volunteer;

        const updateSpy = vi.spyOn(team2VolunteerService, 'update')
            .mockResolvedValue(updated);

        toggleVolunteer2TeamLeaderFlag(v2d)
            .then((actual) => {
                expect(updateSpy).toBeCalledWith(v2d, { leader: true });
                expect(actual).toBe(updated)
            });
    });

});