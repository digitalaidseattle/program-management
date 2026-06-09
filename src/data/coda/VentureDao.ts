
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
        icon: values["Org Icon - For DAS Website"]
            ? Array.isArray(values["Org Icon - For DAS Website"])
                ? values["Org Icon - For DAS Website"][0].url
                : values["Org Icon - For DAS Website"].url
            : undefined,
        program_areas: Array.isArray(values["Foci - For DAS Website"])
            ? values["Foci - For DAS Website"].map((elem: string) => CodaDao.removeBackTicks(elem))
            : [],
        painpoint: CodaDao.removeBackTicks(values["Painpoint"]),
        problem: CodaDao.removeBackTicks(values["Problem - For DAS Website"]),
        solution: CodaDao.removeBackTicks(values["Solution - For DAS Website"]),
        impact: CodaDao.removeBackTicks(values["Impact - For DAS Website"]),
        partner_name: CodaDao.removeBackTicks(values["Org Name"])
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