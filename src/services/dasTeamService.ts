/**
 *  dasTeamService.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { SupabaseEntityService } from "@digitalaidseattle/supabase";
import { Forecast, ForecastDao, OKR, OKRDao, Team, TeamDao } from "./dasTeamDao";
import { PageInfo, QueryModel } from "@digitalaidseattle/core";


class TeamService extends SupabaseEntityService<Team> {

    static STATUSES = [
        'Active',
        'constant',
        'yet to begin'
    ];

    static _instance: TeamService;

    static getInstance(): TeamService {
        if (!this._instance) {
            this._instance = new TeamService();
        }
        return this._instance;
    }

    public constructor() {
        super(TeamDao.getInstance());
    }

    getDao(): TeamDao {
        return this.dao as TeamDao;
    }

    async find(queryModel: QueryModel): Promise<PageInfo<Team>> {
        return this.getDao().find(queryModel);
    }

    async findByAirtableId(airtableId: string): Promise<Team> {
        return this.getDao().findByAirtableId(airtableId);
    }

    async findByStatus(status: string): Promise<Team[]> {
        return this.getDao().findByStatus(status);
    }
}

class OKRService extends SupabaseEntityService<OKR> {

    static _instance: OKRService;

    static getInstance(): OKRService {
        if (!this._instance) {
            this._instance = new OKRService();
        }
        return this._instance;
    }

    public constructor() {
        super(OKRDao.getInstance());
    }

    getDao(): OKRDao {
        return this.dao as OKRDao;
    }

    empty(team: Team): OKR {
        return this.getDao().empty(team);
    }
}

class ForecastService extends SupabaseEntityService<Forecast> {
    static _instance: ForecastService;

    static getInstance(): ForecastService {
        if (!this._instance) {
            this._instance = new ForecastService();
        }
        return this._instance;
    }


    public constructor() {
        super(ForecastDao.getInstance());
    }

    getDao(): ForecastDao {
        return this.dao as ForecastDao;
    }

    empty(team: Team): Forecast {
        return this.getDao().empty(team);
    }
}

export { ForecastService, OKRService, TeamService };

export type { Forecast, OKR, Team };

