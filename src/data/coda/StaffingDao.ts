/**
 *  VolunteerDao.ts
 *
 *  types, classes that support the mapping example
 * 
 *  @copyright 2026 Digital Aid Seattle
 *
 */

import { CodaDao } from "../../services/coda/CodaDao";
import { Staffing } from "../types";

const DOC_ID = "24QYb2RP0g";
const TABLE_ID = "grid-sync-1054-Table-dynamic-0942f75031c84924c851de026ddc252b6abce8eb7fd9659e9672397dba45bec7";

function jason2Entity(json: any): Staffing {
    const values = json.values;
    return {
        id: json.id,
        venture_id: values["Prospective ventures"]?.rowId,
        venture_name: json.name,
        volunteer_id: values["Volunteer assigned"]?.rowId,
        volunteer_name: values["Volunteer assigned"]?.name,
        role: values["Role"]?.name,
        status: CodaDao.removeBackTicks(values["Staffing status"]),
        importance: CodaDao.removeBackTicks(values["Importance"]),
        timing: CodaDao.removeBackTicks(values["Timing"])
    } as Staffing
}
export class StaffingDao extends CodaDao<Staffing> {

    private static instance: StaffingDao;

    public static getInstance(): StaffingDao {
        if (!StaffingDao.instance) {
            this.instance = new StaffingDao(
                DOC_ID,
                TABLE_ID,
                {
                    mapper: jason2Entity
                }
            );
        }
        return this.instance;
    }

}