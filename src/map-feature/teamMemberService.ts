/**
 *  mappingService.ts
 *
 *  types, classes that support the mapping example
 * 
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { Location, LocationService } from './library/LocationService';
import { Volunteer, VolunteerDao } from './VolunteerDao';

class TeamMemberService {
    private static instance: TeamMemberService;

    public static getInstance(): TeamMemberService {
        if (!TeamMemberService.instance) {
            this.instance = new TeamMemberService();
        }
        return TeamMemberService.instance;
    }

    dao: VolunteerDao;
    locationService = LocationService.getInstance();
    public constructor() {
        this.dao = VolunteerDao.getInstance();
    }

    async getAll(): Promise<Volunteer[]> {
        return this.dao.getAll();
    }

    // Given a location, find all people with the same lat-long  (that's why we need all locations)
    async getPeopleAt(people: Volunteer[], location: Location): Promise<Volunteer[]> {
        const matching: Volunteer[] = [];
        for (let i = 0; i < people.length; i++) {
            const p = people[i];
            const match = await this.locationService.findByName(p.location.trim());
            if (match) {
                const atloc = (match.latitude === location.latitude) && (match.longitude === location.longitude);
                if (atloc) {
                    matching.push(p);
                }
            }
        };
        return matching;
    }

    getLocation(volunteer: Volunteer): Promise<Location | null> {
        return this.locationService.findByName(volunteer.location);
    }
}

export { TeamMemberService };
