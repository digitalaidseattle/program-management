/**
 *  mappingService.test.ts
 * 
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { describe, expect, it } from 'vitest';
import { TeamMemberService } from './teamMemberService';
import { Volunteer } from '../../data/types';

describe('mappingService tests', () => {

    it('getPeopleAt', async () => {
        const teamMemberService = TeamMemberService.getInstance();
        const peeps: Volunteer[] = [
            { location: "Bellevue, WA", name: 'alice' } as Volunteer,
            { location: "Bellevue, WA United States", name: 'bob' } as Volunteer,
            { location: "Bellingham, WA, USA", name: 'carol' } as Volunteer,
        ];

        const actual = await teamMemberService.getPeopleAt(peeps, { id: "1", name: '1', latitude: 47.6101, longitude: -122.2015 });
        expect(actual.length).toEqual(2);

        const actual2 = await teamMemberService.getPeopleAt(peeps, { id: "2", name: '2', latitude: 48.7519, longitude: -122.4787 });
        expect(actual2.length).toEqual(1);
    });

})
