
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
import { Venture } from "../types";

const DOC_ID = "24QYb2RP0g";
const TABLE_ID = "grid-UdXLv7wwqh";


function json2Entity(json: any): Venture {
    const values = json.values;
    // console.log(json, values)
    return {
        id: json.id,
        title: json.name,
        coda_id: json.id,
        status: CodaDao.removeBackTicks(values["Venture Status"]),  
        venture_code: CodaDao.removeBackTicks(values["Prospective Venture Code"]),  
    } as Venture
}
export class VentureDao extends CodaDao<Venture> {

    private static instance: VentureDao;

    public static getInstance(): VentureDao {
        if (!VentureDao.instance) {
            this.instance = new VentureDao(
                DOC_ID,
                TABLE_ID,
                {
                    mapper: json2Entity
                }
            );
        }
        return this.instance;
    }

    empty(profile: Profile): Venture {
        console.log(profile)
        throw new Error("Method not implemented.");
    }

    async getActive(): Promise<Venture[]> {
        return this.findBy('Venture Status', 'Active');
    }

}