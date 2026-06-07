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
const TABLE_ID = "grid-4vzF6VuaPV";

function jason2Entity(json: any): Team {
    const values = json.values;
    if (values['First name'] === '```Lakshmi```')
        console.log(values)
    return {
        id: json.id,
        name: CodaDao.removeBackTicks(values["Name"]),

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