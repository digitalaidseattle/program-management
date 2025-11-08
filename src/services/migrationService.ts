/**
 *  migrationService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { v4 as uuid } from 'uuid';
import { storageService } from '../App';
import { AirtableService } from './airtableService';
import { disciplineService } from './dasDisciplineService';
import { partnerService, Profile2Partner, profile2PartnerService } from './dasPartnerService';
import { Profile, profileService } from './dasProfileService';
import { roleService } from './dasRoleService';
import { Staffing, staffingService } from './dasStaffingService';
import { Team2Tool, team2ToolService } from './dasTeam2ToolService';
import { team2VolunteerService } from './dasTeam2VolunteerService';
import { Forecast, forecastService, OKR, okrService, teamService } from './dasTeamService';
import { toolService } from './dasToolsService';
import { ventureService } from './dasVentureService';
import { Volunteer2Discipline, volunteer2DisciplineService } from './dasVolunteer2DisciplineService';
import { Volunteer2Tool, volunteer2ToolService } from './dasVolunteer2ToolService';
import { Volunteer, volunteerService } from "./dasVolunteerService";

const VOLUNTEER_TABLE = 'tblqGbhGVH6v36xwA';
const DISCIPLINES_TABLE = 'tblAL15eUBFRIrdVH';
const TOOLS_TABLE = 'tblw3OBUGxqqwgYmC';
const TEAM_TABLE = 'tblcRB8AHw18uw2zb';
const PARTNERS_TABLE = 'tblqttKinLZJ2JXo7';
const VENTURES_TABLE = 'tblRpJek5SjacLaen'; // VENTURE SEEDS/PAINPOINTS TABLE
const ROLES_TABLE = 'tblBNPY8DODvUU3ZA';
const STAFFING_TABLE = 'tbllAEHFTFX5IZDZL';
const OKR_TABLE = 'tblBEgmnxKDyycRX6';
const FORECAST_TABLE = 'tblbIMTclZeJ6IA4i';
const CONTACT_TABLE = 'tblWyd8yGHbKdchXs';

class MigrationService {

    migrators: { [key: string]: () => Promise<void> } = {
        'Volunteers': this.migrateVolunteers,
        'Ventures': this.migrateVentures,
        'Partners': this.migratePartners,
        'Tools': this.migrateTools,
        'Teams': this.migrateTeams,
        'Disciplines': this.migrateDisciplines,
        'Roles': this.migrateRoles,
        'Team/Volunteer': this.joinTeamVolunteer,
        'Venture/Partner': this.joinVenturePartner,
        'Volunteer/Discipline': this.joinVolunteerDiscipline,
        'Team/Tool': this.joinTeamTool,
        'Volunteer/Tool': this.joinVolunteerTool,
        'Staffing Needs': this.migrateStaffingNeeds,
        'Partner Logos': this.downloadPartnerLogos,
        'Tool Logos': this.downloadToolLogos,
        'Team Logos': this.downloadTeamIcons,
        'Discipline Logos': this.downloadDisciplineIcons,
        'OKRs': this.migrateOkrs,
        'Forecast': this.migrateForecasts,
        'Contacts': this.migrateContacts
    }

    migrateVentures(): Promise<void> {
        return new AirtableService(VENTURES_TABLE).getAll()
            .then(records => {
                const transformed = records.map(record => {
                    const supa = ({
                        id: uuid(),
                        airtable_id: record.id,
                        painpoint: record.fields['Painpoint Shorthand'],
                        status: record.fields['Status'],
                        problem: record.fields['Problem (for DAS website)'],
                        solution: record.fields['Solution (for DAS website)'],
                        impact: record.fields['Impact (for DAS website)'],
                        program_areas: record.fields['Foci (from Partner)'],
                        venture_code: record.fields['Prospective Venture Code'],
                        partner_airtable_id: record.fields["Partner"]
                    }) as any;
                    delete supa.airtable_partner_id;
                    return supa
                });
                ventureService.batchInsert(transformed)
            });
    }

    migratePartners(): Promise<void> {
        return new AirtableService(PARTNERS_TABLE).getAll()
            .then(records => {
                const transformed = records.map(record => {
                    return ({
                        id: uuid(),
                        airtable_id: record.id,
                        name: record.fields['Org name'],
                        type: record.fields['Type'],
                        shorthand_name: record.fields['Org shorthand'],
                        status: record.fields['Status'],
                        description: record.fields['Org description'],
                        gdrive_link: record.fields['Gdrive link URL'],
                        hubspot_link: record.fields["Hubspot interface"],
                        miro_link: record.fields["Miro Board Link"],
                        overview_link: record.fields["Overview link"],
                        logo_url: record.fields["logo"] ? (record.fields["logo"] as any[])[0].url : undefined,
                        internal_champion: record.fields["Internal Champion"],
                        website: record.fields["Website"],
                        foci: record.fields["Foci"],
                        ally_utility: record.fields["Ally utility"],
                        general_phone: record.fields["General phone"],
                        internal_thoughts: record.fields["Internal thoughts"]
                    })
                });
                partnerService.batchInsert(transformed)
            })
    }

    migrateVolunteers(): Promise<void> {
        const volunteers: Volunteer[] = [];
        const profiles: Profile[] = [];
        return new AirtableService(VOLUNTEER_TABLE).getAll()
            .then(records => {
                records.forEach(r => {
                    const profileId = uuid()
                    volunteers.push({
                        id: uuid(),
                        profile_id: profileId,
                        airtable_id: r.fields['Name'],
                        status: r.fields['Manual Status'],
                        affliation: r.fields['Affiliation (from Volunteer Affiliation)'],
                        join_date: r.fields['join date'],
                        position: r.fields['Position'],
                        disciplines: r.fields['Disciplines'],
                        github: r.fields['Github'],
                        das_email: r.fields['DAS email'],
                        slack_id: r.fields['Slack ID'],
                        hope_to_give: r.fields['In DAS I hope to give'],
                        hope_to_get: r.fields['In DAS, I hope to get'],
                        communication_preferences: r.fields['Communication preferences'],
                        linkedin: r.fields['Linkedin URL'],
                        tool_ids: r.fields['Tools we use']
                    });
                    profiles.push({
                        id: profileId,
                        name: r.fields['Name'],
                        first_name: r.fields['First name'],
                        last_name: r.fields['Last name'],
                        email: r.fields['Personal email'],
                        phone: r.fields['Phone'],
                        location: r.fields['Location'],
                        pic: r.fields["pic"] ? (r.fields["pic"] as any[])[0].url : undefined
                    })
                });
                profileService.batchInsert(profiles)
                    .then(() => volunteerService.batchInsert(volunteers))
            })
    }

    migrateTools(): Promise<void> {
        return new AirtableService(TOOLS_TABLE).getAll()
            .then(records => {
                const transformed = records.map(r => {
                    return ({
                        id: uuid(),
                        airtable_id: r.id,
                        name: r.fields['Name'],
                        experts: r.fields['in-house expert(s)'],
                        status: r.fields['status'],
                        overview: r.fields['Onboarding overview'],
                        logo: r.fields["logo"] ? (r.fields["logo"] as any[])[0].url : undefined,
                        description: r.fields['Description'],
                        teams: r.fields['Teams'],
                        admins: r.fields['Admin(s)']
                    })
                });
                toolService.batchInsert(transformed)
            })
    }

    migrateDisciplines(): Promise<void> {
        return new AirtableService(DISCIPLINES_TABLE).getAll()
            .then(records => {
                const transformed = records.map(r => {
                    return ({
                        id: uuid(),
                        airtable_id: r.id,
                        name: r.fields['Name'],
                        volunteer_ids: r.fields['Volunteers'],
                        status: r.fields['Status'],
                        details: r.fields['Details'],
                        slack: r.fields['Our Slack channel'],
                        senior_ids: r.fields["Senior"]
                    })
                });
                disciplineService.batchInsert(transformed)
            })
    }

    migrateTeams(): Promise<void> {
        return new AirtableService(TEAM_TABLE).getAll()
            .then(records => {
                const transformed = records.map(r => {
                    return ({
                        id: uuid(),
                        airtable_id: r.id,
                        name: r.fields['Team name'],
                        volunteer_ids: r.fields['volunteers on team'],
                        welcome_message: r.fields['Welcome message'],
                        okrs: r.fields['OKRs 2'],
                        forecast_ids: r.fields['Team forecast'],
                        purpose: r.fields['Purpose'],
                        status: r.fields['Status'],
                        leader_ids: r.fields['Leader'],
                        tool_ids: r.fields['tools'],
                        decision_making: r.fields['Decision-making process'],
                        not_included: r.fields['What is NOT included in this Team?'],
                        knowledge_management: r.fields['Knowledge Management plan'],
                        new_to_the_team: r.fields['New to the team?'],
                        slack_channel: r.fields['Slack Channel']
                    })
                });
                teamService.batchInsert(transformed)
            })
    }

    migrateRoles(): Promise<void> {
        return new AirtableService(ROLES_TABLE).getAll()
            .then(records => {
                const transformed = records.map(record => {
                    return ({
                        id: uuid(),
                        airtable_id: record.id,
                        name: record['Role'],
                        status: record['Status'],
                        urgency: record['Urgency']
                    })
                });
                roleService.batchInsert(transformed)
            })
    }


    joinTeamVolunteer(): Promise<void> {
        return teamService.getAll()
            .then(teams => {
                teams.forEach(team => {
                    if (team.volunteer_ids && team.volunteer_ids.length > 0) {
                        Promise.all(
                            team.volunteer_ids
                                .map(async vol_id => {
                                    const volunteer = await volunteerService.findByAirtableId(vol_id);
                                    return ({
                                        team_id: team.id,
                                        volunteer_id: volunteer.id,
                                        leader: (team.leader_ids ?? []).includes(volunteer.airtable_id)
                                    })
                                }))

                            .then(resp => {
                                if (resp.length > 0) {
                                    console.log(resp);
                                    team2VolunteerService.batchInsert(resp)
                                }
                            })
                    }
                })
            })
    }

    joinVenturePartner(): Promise<void> {
        return ventureService.getAll()
            .then(ventures => {
                ventures.forEach(venture => {
                    if (venture.partner_airtable_id) {
                        venture.partner_airtable_id
                            .map(async airtable_id => {
                                const partner = await partnerService.findByAirtableId(airtable_id);
                                await ventureService.update(venture.id, { partner_id: partner.id });
                            })
                    }
                })
                alert('Done')
            })
    }

    joinVolunteerDiscipline(): Promise<void> {
        return volunteerService.getAll()
            .then(volunteers => {
                volunteers.forEach(volunteer => {
                    const records = (volunteer.disciplines ?? [])
                        .map(disc => {
                            return disciplineService.findByAirtableId(disc)
                                .then(discipline => ({
                                    volunteer_id: volunteer.id,
                                    discipline_id: discipline.id,
                                    senior: (discipline.senior_ids ?? []).includes(volunteer.airtable_id)
                                } as Volunteer2Discipline))
                        })
                    Promise.all(records)
                        .then(batched => {
                            volunteer2DisciplineService.batchInsert(batched);
                        })
                })
                alert('Done')
            })
    }

    async joinVolunteerTool(): Promise<void> {
        const airtableVolunteers = await new AirtableService(VOLUNTEER_TABLE).getAll();
        return volunteerService.getAll()
            .then(volunteers => {
                volunteers.forEach(volunteer => {
                    const airVolunteer = airtableVolunteers.find(av => av.id === volunteer.airtable_id);
                    const tool_ids: string[] = airVolunteer["Expert in Tools"] ?? []
                    const records = tool_ids
                        .map(toolId => {
                            return toolService.findByAirtableId(toolId)
                                .then(tool => ({
                                    volunteer_id: volunteer.id,
                                    tool_id: tool.id
                                } as Volunteer2Tool))
                        })
                    Promise.all(records)
                        .then(batched => {
                            // console.log('batched', batched)
                            volunteer2ToolService.batchInsert(batched)
                        })
                })
                alert('Done')
            })
    }

    async downloadVolunteerPics(): Promise<void> {

        const volunteers = await volunteerService.getAll();
        await new AirtableService(VOLUNTEER_TABLE)
            .getAll()
            .then(records => {
                records
                    .forEach(record => {
                        const volunteer = volunteers.find(v => v.airtable_id === record.id);
                        const url = record['pic'] ? record['pic'][0].url : undefined;
                        if (volunteer && url) {
                            fetch(url)
                                .then(resp => resp.blob()
                                    .then(blob => {
                                        storageService.upload(`profiles/${volunteer.profile!.id}`, blob)
                                            .then((data: any) => console.log(data))
                                    })
                                )
                        } else {
                            console.log(record)
                            console.warn(`no pic for aritable record: ${record.id}`)
                        }
                    })
            })
    }

    joinTeamTool(): Promise<void> {
        return teamService.getAll()
            .then(teams => {
                teams.forEach(team => {
                    const records = (team.tool_ids ?? [])
                        .map(tool_id => {
                            return toolService.findByAirtableId(tool_id)
                                .then(tool => ({
                                    team_id: team.id,
                                    tool_id: tool.id,
                                } as Team2Tool))
                        })
                    Promise.all(records)
                        .then(batched => {
                            team2ToolService.batchInsert(batched);
                        })
                })
                alert('Done')
            })
    }

    migrateStaffingNeeds(): Promise<void> {
        return new AirtableService(STAFFING_TABLE).getAll()
            .then(records => {
                Promise.all(records.map(async r => {
                    console.log(r)
                    const venture = r['Prospective Ventures'] ? await ventureService.findByAirtableId(r['Prospective Ventures'][0]) : null;
                    const team = r['Cadre Teams'] ? await teamService.findByAirtableId(r['Cadre Teams'][0]) : null;
                    const role = r['Role'] ? await roleService.findByAirtableId(r['Role'][0]) : null;
                    const volunteer = r['Volunteer Assigned'] ? await volunteerService.findByAirtableId(r['Volunteer Assigned'][0]) : null;
                    const supa = ({
                        id: uuid(),
                        airtable_id: r.id,
                        venture_id: venture ? venture.id : undefined,
                        team_id: team ? team.id : undefined,
                        role_id: role ? role.id : undefined,
                        volunteer_id: volunteer ? volunteer.id : undefined,
                        status: r['Status'],
                        timing: r['Timing'],
                        level: r['Level requirement'],
                        skills: r['Desired skills'],
                        importance: r['Importance']
                    }) as Staffing;
                    return supa
                }))
                    .then(transformed => staffingService.batchInsert(transformed))
            })
    }

    async migrateOkrs(): Promise<void> {
        return new AirtableService(OKR_TABLE).getAll()
            .then(records => {
                Promise.all(records.map(async r => {
                    const team = r['Teams'] ? await teamService.findByAirtableId(r['Teams'][0]) : null;
                    const supa = ({
                        id: uuid(),
                        team_id: team?.id,
                        airtable_id: r.id,
                        title: r['Title'],
                        description: r['Details'],
                        health_rating: r['Health Rating'],
                        start_date: r['Start Date'],
                        end_date: r['End Date'],
                    }) as OKR;
                    return supa
                }))
                    .then(transformed => okrService.batchInsert(transformed))
            })
    }

    async migrateForecasts(): Promise<void> {
        return new AirtableService(FORECAST_TABLE).getAll()
            .then(records => {
                Promise.all(records
                    .filter(r => !JSON.stringify(r).includes('#ERROR'))
                    .map(async r => {
                        const team = r['Team'] ? await teamService.findByAirtableId(r['Team'][0]) : null;
                        const supa = ({
                            id: uuid(),
                            team_id: team?.id,
                            airtable_id: r.id,
                            title: r['Entry'],
                            description: r['Forecast'],
                            performance: r['Performance?'],
                            start_date: r['Start date'],
                            end_date: r['Delivery date'],
                        }) as Forecast;
                        return supa
                    }))
                    .then(transformed => {
                        forecastService.batchInsert(transformed)
                    })
            })
    }

    async downloadPartnerLogos(): Promise<void> {
        const partners = await partnerService.getAll();
        await new AirtableService(PARTNERS_TABLE)
            .getAll()
            .then(records => {
                records
                    .forEach(record => {
                        const partner = partners.find(p => p.airtable_id === record.id);
                        const url = record['logo'] ? record['logo'][0].url : undefined;
                        if (partner && url) {
                            console.log(partner, url)
                            fetch(url)
                                .then(resp => resp.blob()
                                    .then(blob => {
                                        storageService.upload(`logos/${partner.id}`, blob)
                                            .then((data: any) => console.log(data))
                                    })
                                )
                        } else {
                            console.log(record)
                            console.warn(`no pic for aritable record: ${record.id}`)
                        }
                    })
            })
    }

    async downloadToolLogos(): Promise<void> {
        const tools = await toolService.getAll();
        await new AirtableService(TOOLS_TABLE)
            .getAll()
            .then(records => {
                records
                    .forEach(record => {
                        const tool = tools.find(p => p.airtable_id === record.id);
                        const url = record['logo'] ? record['logo'][0].url : undefined;
                        if (tool && url) {
                            fetch(url)
                                .then(resp => resp.blob()
                                    .then(blob => {
                                        storageService.upload(`logos/${tool.id}`, blob)
                                            .then((data: any) => console.log(data))
                                    })
                                )
                        } else {
                            console.log(record)
                            console.warn(`no pic for aritable record: ${record.id}`)
                        }
                    })
            })
    }

    async downloadTeamIcons(): Promise<void> {
        const teams = await teamService.getAll();
        await new AirtableService(TEAM_TABLE)
            .getAll()
            .then(records => {
                records
                    .forEach(record => {
                        const team = teams.find(p => p.airtable_id === record.id);
                        const url = record['icon'] ? record['icon'][0].url : undefined;
                        if (team && url) {
                            fetch(url)
                                .then(resp => resp.blob()
                                    .then(blob => {
                                        storageService.upload(`icons/${team.id}`, blob)
                                            .then((data: any) => console.log(data))
                                    })
                                )
                        } else {
                            console.log(record)
                            console.warn(`no pic for aritable record: ${record.id}`)
                        }
                    })
            })
    }

    async downloadDisciplineIcons(): Promise<void> {
        const disciplines = await disciplineService.getAll();
        await new AirtableService(DISCIPLINES_TABLE)
            .getAll()
            .then(records => {
                records
                    .forEach(record => {
                        const discipline = disciplines.find(p => p.airtable_id === record.id);
                        const url = record['icon'] ? record['icon'][0].url : undefined;
                        if (discipline && url) {
                            fetch(url)
                                .then(resp => resp.blob()
                                    .then(blob => {
                                        storageService.upload(`icons/${discipline.id}`, blob)
                                            .then((data: any) => console.log(data))
                                    })
                                )
                        } else {
                            console.log(record)
                            console.warn(`no icon for aritable record: ${record.id}`)
                        }
                    })
            })
    }

    async migrateContacts(): Promise<void> {
        const partners = await partnerService.getAll();
        await new AirtableService(CONTACT_TABLE)
            .getAll()
            .then(records => {
                records
                    .forEach(async record => {
                        // try {
                        //     const profile = await profileService.findByName(record["Person"]);
                        //     if (profile) {
                        //         console.log('found', profile)
                        //         await profileService.delete(profile.id);
                        //     } else {
                        //         console.error('no profile', record["Person"])
                        //     }
                        // } catch (err) {
                        //     console.error(err)
                        // }
                        const partner = partners.find(p => (record["Partners/Allies"] ?? []).includes(p.airtable_id));
                        if (partner) {
                            const proposed = {
                                id: uuid(),
                                name: record["Person"],
                                first_name: record["First name"],
                                last_name: record["Last name"],
                                email: record["Email"],
                                phone: record["Phone"],
                                location: record["Location"],
                                pic: ""
                            }
                            const profile = await profileService.insert(proposed);
                            const p2p = {
                                partner_id: partner.id,
                                profile_id: profile.id,
                                title: record["Title"]
                            }
                            const inserted = await profile2PartnerService.insert(p2p);
                            console.log(proposed, inserted);
                        } else {
                            console.warn(`no partner for contact: ${record.id}  ${record["Person"]}`)
                        }
                    });
            })
    }

}
const migrationService = new MigrationService();

export { migrationService };

