/**
 *  dasTeamsService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { FieldSet, Record } from "airtable";
import { createContext, useEffect, useState } from "react";
import { dasAirtableClient } from "../../../services/airtableClient";
import { AirtableRecordService } from "../../../services/airtableRecordService";

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
            const response = await dasTeamsService.findAll()
            setData(response);
            setStatus('fetched');
        };
        fetchData();
    }, []);

    return { status, data };
};


class DASTeamsService extends AirtableRecordService<Team> {

    public constructor() {
        super(dasAirtableClient.base(import.meta.env.VITE_AIRTABLE_BASE_ID_DAS), TEAMS_TABLE);
    }

    airtableTransform(record: Record<FieldSet>): Team {
        return {
            id: record.id,
            name: record.fields['Team name'],
            volunteerIds: record.fields["volunteers on team"]
        } as Team
    }
}

const dasTeamsService = new DASTeamsService();
export { dasTeamsService, TeamContext, useTeams };
export type { Team };

