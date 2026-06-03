import { describe, expect, it, vi } from "vitest";
import { Discipline } from "../services/dasDisciplineService";
import { Volunteer2Discipline, Volunteer2DisciplineService } from "../services/dasVolunteer2DisciplineService";
import { Volunteer } from "../services/dasVolunteerDao";
import { addDisciplineToVolunteer } from "./AddDisciplineToVolunteer";

describe("addDisciplineToVolunteer", () => {

    it("basic", () => {
        const discipline = { id: "discipline_id" } as Discipline;
        const volunteer = { id: "volunteer_id" } as Volunteer;
        const v2d = {} as Volunteer2Discipline;

        const addDisciplineToVolunteerSpy = vi.spyOn(Volunteer2DisciplineService.getInstance(), 'addDisciplineToVolunteer')
            .mockResolvedValue(v2d);

        addDisciplineToVolunteer(discipline, volunteer)
            .then((actual) => {
                expect(addDisciplineToVolunteerSpy).toBeCalledWith(discipline, volunteer);
                expect(actual).toBe(v2d)
            });
    });

});