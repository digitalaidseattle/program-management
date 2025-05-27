/**
 *  dasTeamsService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { AirtableEntityService } from "@digitalaidseattle/airtable";
import Airtable, { FieldSet, Record } from "airtable";
import { createContext, useEffect, useState } from "react";

const TEAMS_TABLE = 'tblcRB8AHw18uw2zb';

// const MAX_RECORDS = 200;
// const FILTER = ``

type Team = {
    id: string
    name: string
    volunteerIds: string[]
}

interface TeamContextType {
    team: Team | undefined,
    setTeam: (team: Team) => void
}

const TeamContext = createContext<TeamContextType>({
    team: undefined,
    setTeam: () => { }
});

const useTeams = () => {
    const [status, setStatus] = useState('idle');
    const [data, setData] = useState<Team[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setStatus('fetching');
            const response = await dasTeamsService.getAll()
            setData(response);
            setStatus('fetched');
        };
        fetchData();
    }, []);

    return { status, data };
};

const airtableClient = new Airtable({ apiKey: import.meta.env.VITE_AIRTABLE_ANON_KEY })

class DASTeamsService extends AirtableEntityService<Team> {

    public constructor() {
        super(airtableClient, TEAMS_TABLE);
    }

    transform(record: Record<FieldSet>): Team {
        return {
            id: record.id,
            name: record.fields['Team name'],
            volunteerIds: record.fields["volunteers on team"]
        } as Team
    }

    transformEntity(entity: Partial<Team>): Partial<FieldSet> {
        const fields: Partial<FieldSet> = {};
        if (entity.name !== undefined) {
            fields['Team name'] = entity.name;
        }
        if (entity.volunteerIds !== undefined) {
            fields['volunteers on team'] = entity.volunteerIds;
        }
        return fields;
    }
}

const dasTeamsService = new DASTeamsService();
export { dasTeamsService, TeamContext, useTeams };
export type { Team };

