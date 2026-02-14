/**
 *  removeDisciplineFromVolunteer.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */
import { describe, expect, it, vi } from "vitest";
import { Discipline } from "../services/dasDisciplineService";
import { volunteer2DisciplineService } from "../services/dasVolunteer2DisciplineService";
import { Volunteer } from "../services/dasVolunteerService";
import { removeDisciplineFromVolunteer } from "./RemoveDisciplineFromVolunteer";

describe("removeDisciplineFromVolunteer", () => {

    it("basic", () => {
        const discipline = { id: "discipline_id" } as Discipline;
        const volunteer = { id: "volunteer_id" } as Volunteer;

        const addDisciplineToVolunteerSpy = vi.spyOn(volunteer2DisciplineService, 'removeDisciplineFromVolunteer')
            .mockResolvedValue(true);

        removeDisciplineFromVolunteer(discipline, volunteer)
            .then((actual) => {
                expect(addDisciplineToVolunteerSpy).toBeCalledWith(discipline, volunteer);
                expect(actual).toBe(true)
            });
    });

});