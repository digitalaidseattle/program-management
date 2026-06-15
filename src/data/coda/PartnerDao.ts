
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
const TABLE_ID = "grid-P2ZacIlmvx";

function json2Entity(json: any): any {
    const values = json.values;
    console.log(json, values)
    return {
        id: json.id,
    } as Venture
}
export class PartnerDao extends CodaDao<any> {

    private static instance: PartnerDao;

    public static getInstance(): PartnerDao {
        if (!PartnerDao.instance) {
            this.instance = new PartnerDao(
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

}