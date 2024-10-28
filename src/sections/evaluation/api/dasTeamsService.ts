/**
 *  dasMeetingService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { createContext, useEffect, useState } from "react";
import { dasAirtableService } from "../../../services/airtableService";

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


class DASTeamsService {

    transform = (record: any): Team => {
        return {
            id: record.id,
            name: record.fields['Team name'],
            volunteerIds: record.fields["volunteers on team"]
        }
    }

    async getAll(): Promise<any[]> {
        const filter = ''
        return dasAirtableService.getAll(TEAMS_TABLE, filter)
            .then(records => records.map(r => this.transform(r)))
    }

}

const dasTeamsService = new DASTeamsService();
export { dasTeamsService, useTeams, TeamContext };
export type { Team };

