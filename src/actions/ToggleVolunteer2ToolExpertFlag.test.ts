/**
 *  ToggleVolunteer2ToolExpertFlag.test.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { describe, expect, it, vi } from "vitest";
import { Volunteer2Tool, volunteer2ToolService } from "../services/dasVolunteer2ToolService";
import { toggleVolunteer2ToolExpertFlag } from "./ToggleVolunteer2ToolExpertFlag";

describe("toggleVolunteer2TeamLeaderFlag", () => {
    it.beforeEach(() => {
        vi.resetAllMocks();
    })

    it("basic", () => {
        const v2t = { expert: true } as Volunteer2Tool;
        const updated = {} as Volunteer2Tool;

        const updateSpy = vi.spyOn(volunteer2ToolService, 'update')
            .mockResolvedValue(updated);

        toggleVolunteer2ToolExpertFlag(v2t)
            .then((actual) => {
                expect(updateSpy).toBeCalledWith(v2t, { expert: false });
                expect(actual).toBe(updated)
            });
    });

    it("undefined", () => {
        const v2t = {} as Volunteer2Tool;
        const updated = {} as Volunteer2Tool;

        const updateSpy = vi.spyOn(volunteer2ToolService, 'update')
            .mockResolvedValue(updated);

        toggleVolunteer2ToolExpertFlag(v2t)
            .then((actual) => {
                expect(updateSpy).toBeCalledWith(v2t, { expert: true });
                expect(actual).toBe(updated)
            });
    });

});