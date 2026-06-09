/**
 *  VolunteerDao.ts
 *
 *  types, classes that support the mapping example
 * 
 *  @copyright 2026 Digital Aid Seattle
 *
 */

import { CodaDao } from "../../services/coda/CodaDao";
import { Profile } from "../../services/dasProfileDao";
import { Team, Volunteer } from "../types";

const DOC_ID = "24QYb2RP0g";
const TABLE_ID = "grid-YUAFhqfMkQ";

function jason2Entity(json: any): Team {
    const values = json.values;
    console.log(json)
    return {
        id: json.id,
        name: json.name,
        leads: values["Team lead"]
            .map((m: any) => ({
                id: m.rowId,
                name: m.name
            } as Volunteer)),
        members: values["Team member"]
            .map((m: any) => ({
                id: m.rowId,
                name: m.name
            } as Volunteer))
    } as Team
}
export class TeamDao extends CodaDao<Team> {

    private static instance: TeamDao;

    public static getInstance(): TeamDao {
        if (!TeamDao.instance) {
            this.instance = new TeamDao(
                DOC_ID,
                TABLE_ID,
                {
                    mapper: jason2Entity
                }
            );
        }
        return this.instance;
    }

    empty(profile: Profile): Volunteer {
        console.log(profile)
        throw new Error("Method not implemented.");
    }

}