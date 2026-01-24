/**
 *  ToggleVolunteer2DisciplineSeniorFlag.test.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { describe, expect, it, vi } from "vitest";
import { Volunteer2Discipline, volunteer2DisciplineService } from "../services/dasVolunteer2DisciplineService";
import { toggleVolunteer2DisciplineSeniorFlag } from "./ToggleVolunteer2DisciplineSeniorFlag";

describe("toggleVolunteer2DisciplineSeniorFlag", () => {

    it("basic", () => {
        const v2d = {senior: false} as Volunteer2Discipline;
        const updated = {} as Volunteer2Discipline;

        const updateSpy = vi.spyOn(volunteer2DisciplineService, 'update')
            .mockResolvedValue(updated);

        toggleVolunteer2DisciplineSeniorFlag(v2d)
            .then((actual) => {
                expect(updateSpy).toBeCalledWith(v2d, { senior: true });
                expect(actual).toBe(updated)
            });
    });

});