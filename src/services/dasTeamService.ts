/**
 *  dasTeamService.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { Identifier, PageInfo, QueryModel } from "@digitalaidseattle/core";
import { TeamDao } from "../data/coda/TeamDao";
import { Team } from "../data/types";


class TeamService {

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

    dao: TeamDao;
    public constructor() {
        this.dao = TeamDao.getInstance();
    }

    getDao(): TeamDao {
        return this.dao as TeamDao;
    }

    async getById(id: Identifier): Promise<Team | null> {
        return this.getDao().getById(id);
    }

    async getAll(): Promise<Team[]> {
        return this.getDao().getAll();
    }
    async find(queryModel: QueryModel): Promise<PageInfo<Team>> {
        return this.getDao().find(queryModel);
    }

}


export { TeamService };

export type { Team };

