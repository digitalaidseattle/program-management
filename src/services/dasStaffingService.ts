/**
 *  dasVentureService.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { Identifier } from "@digitalaidseattle/core";
import { SupabaseEntityService } from "@digitalaidseattle/supabase";
import { Staffing, StaffingDao } from "./dasStaffingDao";

class StaffingService extends SupabaseEntityService<Staffing> {
    STATUSES = [
        "Proposed",
        "Filled",
        "Please fill",
        "Maybe filled",
        "Cancelled",
        "Declined by Contributor"
    ]

    IMPORTANCES = [
        "Imperative",
        "Nice to have"
    ]

    TIMINGS = [
        "At the start",
        "1/3 into the Venture",
        "2/3 into the Venture"
    ]

    EXPERIENCE_LEVELS = [
        "Junior",
        "Mid",
        "Senior"
    ]

    static _instance: StaffingService;

    static getInstance(): StaffingService {
        if (!this._instance) {
            this._instance = new StaffingService();
        }
        return this._instance;
    }

    public constructor() {
        super(StaffingDao.getInstance());
    }

    getDao(): StaffingDao {
        return this.dao as StaffingDao;
    }

    async findByVolunteerId(volunteerId: Identifier): Promise<Staffing[]> {
        return this.getDao().findByVolunteerId(volunteerId);
    }

    async findByVentureId(ventureId: Identifier): Promise<Staffing[]> {
        return this.getDao().findByVentureId(ventureId);
    }
}

export { StaffingService };
export type { Staffing };

