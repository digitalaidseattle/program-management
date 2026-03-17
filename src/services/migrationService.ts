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
import { partnerService, profile2PartnerService } from './dasPartnerService';
import { Profile, profileService } from './dasProfileService';
import { Role, RoleService } from './dasRoleService';
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
        'Contacts': this.migrateContacts,
        'Contact Pics': this.downloadContactPics,
        'Update roles': this.updateRoles,
    }

    migrateVentures(): Promise<void> {
        return new AirtableService(VENTURES_TABLE).getAll()
            .then(records => {
                const transformed = records.map(record => {
                    console.log(record);

                    const supa = ({
                        id: uuid(),
                        airtable_id: record.id,
                        painpoint: record['Painpoint Shorthand'],
                        status: record['Status'],
                        problem: record['Problem (for DAS website)'],
                        solution: record['Solution (for DAS website)'],
                        impact: record['Impact (for DAS website)'],
                        program_areas: record['Foci (from Partner)'],
                        venture_code: record['Prospective Venture Code'],
                        partner_airtable_id: record["Partner"]
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
                        name: record['Org name'],
                        type: record['Type'],
                        shorthand_name: record['Org shorthand'],
                        status: record['Status'],
                        description: record['Org description'],
                        gdrive_link: record['Gdrive link URL'],
                        hubspot_link: record["Hubspot interface"],
                        miro_link: record["Miro Board Link"],
                        overview_link: record["Overview link"],
                        logo_url: record["logo"] ? (record["logo"] as any[])[0].url : undefined,
                        internal_champion: record["Internal Champion"],
                        website: record["Website"],
                        foci: record["Foci"],
                        ally_utility: record["Ally utility"],
                        general_phone: record["General phone"],
                        internal_thoughts: record["Internal thoughts"]
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
                    console.log(r)
                    const profileId = uuid()
                    volunteers.push({
                        id: uuid(),
                        profile_id: profileId,
                        airtable_id: r.id,
                        status: r['Manual Status'],
                        affliation: r['Affiliation (from Volunteer Affiliation)'],
                        join_date: r['join date'],
                        position: r['Position'],
                        disciplines: r['Disciplines'],
                        github: r['Github'],
                        das_email: r['DAS email'],
                        slack_id: r['Slack ID'],
                        hope_to_give: r['In DAS I hope to give'],
                        hope_to_get: r['In DAS, I hope to get'],
                        communication_preferences: r['Communication preferences'],
                        linkedin: r['Linkedin URL'],
                        tool_ids: r['Tools we use']
                    });
                    profiles.push({
                        id: profileId,
                        name: r['Name'],
                        first_name: r['First name'],
                        last_name: r['Last name'],
                        email: r['Personal email'],
                        phone: r['Phone'],
                        location: r['Location'],
                        pic: r["pic"] ? (r["pic"] as any[])[0].url : undefined
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
                        name: r['Name'],
                        experts: r['in-house expert(s)'],
                        status: r['status'],
                        overview: r['Onboarding overview'],
                        logo: r["logo"] ? (r["logo"] as any[])[0].url : undefined,
                        description: r['Description'],
                        teams: r['Teams'],
                        admins: r['Admin(s)']
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
                        name: r['Name'],
                        volunteer_ids: r['Volunteers'],
                        status: r['Status'],
                        details: r['Details'],
                        slack: r['Our Slack channel'],
                        senior_ids: r["Senior"],
                        icon: ''
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
                        name: r['Team name'],
                        volunteer_ids: r['volunteers on team'],
                        welcome_message: r['Welcome message'],
                        okrs: r['OKRs 2'],
                        forecast_ids: r['Team forecast'],
                        purpose: r['Purpose'],
                        status: r['Status'],
                        leader_ids: r['Leader'],
                        tool_ids: r['tools'],
                        decision_making: r['Decision-making process'],
                        not_included: r['What is NOT included in this Team?'],
                        knowledge_management: r['Knowledge Management plan'],
                        new_to_the_team: r['New to the team?'],
                        slack_channel: r['Slack Channel']
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
                    } as unknown as Role)
                });
                RoleService.instance().batchInsert(transformed)
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
        const roleService = RoleService.instance()
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
                    .forEach(async record => {
                        const partner = partners.find(p => p.airtable_id === record.id);
                        if (partner) {
                            const location = `logos/${partner.id}`;
                            await storageService.removeFile(location);
                            const url = record['logo'] ? record['logo'][0].url : undefined;
                            fetch(url)
                                .then(resp => resp.blob()
                                    .then(async blob => {
                                        await storageService.upload(location, blob);
                                        await partnerService.update(partner.id, { logo_url: location });
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
                    .forEach(async record => {
                        const tool = tools.find(p => p.airtable_id === record.id);
                        if (tool) {
                            const location = `logos/${tool.id}`;
                            await storageService.removeFile(location);
                            const url = record['logo'] ? record['logo'][0].url : undefined;
                            fetch(url)
                                .then(resp => resp.blob()
                                    .then(async blob => {
                                        await storageService.upload(location, blob);
                                        await toolService.update(tool.id, { logo: location });
                                    })
                                )
                        } else {
                            console.error(`no tool for aritable record: ${record.id}`, record)
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
                    .forEach(async record => {
                        const discipline = disciplines.find(p => p.airtable_id === record.id);
                        if (discipline) {
                            const location = `icons/${discipline.id}`;
                            await storageService.removeFile(location);
                            const url = record['icon'] ? record['icon'][0].url : undefined;
                            fetch(url)
                                .then(resp => resp.blob()
                                    .then(async blob => {
                                        await storageService.upload(location, blob);
                                        await disciplineService.update(discipline.id, { icon: location });
                                    })
                                )
                        } else {
                            console.error(`no icon for aritable record: ${record.id}`)
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

    //  had some issues with linking, so leaving just in case
    async linkContacts(): Promise<void> {
        const partners = await partnerService.getAll();
        const profiles = await profileService.getAll();

        await new AirtableService(CONTACT_TABLE)
            .getAll()
            .then(records => {
                records
                    .forEach(async record => {
                        const partner = partners.find(p => (record["Partners/Allies"] ?? []).includes(p.airtable_id));
                        const profile = profiles.find(p => record["Person"] === p.name);
                        if (partner && profile) {
                            const p2p = {
                                partner_id: partner.id,
                                profile_id: profile.id,
                                title: record["Title"]
                            }
                            const inserted = await profile2PartnerService.insert(p2p);
                            console.log(inserted);
                        } else {
                            console.warn(`no partner or profile for contact: ${record.id}  ${record["Person"]}`)
                        }
                    });
            })
    }


    async downloadContactPics(): Promise<void> {
        const profiles = await profileService.getAll();
        await new AirtableService(CONTACT_TABLE)
            .getAll()
            .then(records => {
                records
                    .forEach(async record => {
                        const profile = profiles.find(p => record["Person"] === p.name);
                        if (profile) {
                            const location = `profiles/${profile.id}`;
                            await storageService.removeFile(location);
                            const url = record['Pic'] ? record['Pic'][0].url : undefined;
                            fetch(url)
                                .then(resp => resp.blob()
                                    .then(async blob => {
                                        await storageService.upload(location, blob);
                                        await profileService.update(profile.id, { pic: location });
                                    })
                                )
                        } else {
                            console.warn(`no pic for aritable record: ${record.id}`, record)
                        }
                    });
            })
    }

    async updateRoles(): Promise<void> {
        const roleService = RoleService.instance();
        return new AirtableService(ROLES_TABLE).getAll()
            .then(records => {
                records.forEach(async record => {
                    const supa = await roleService.findByAirtableId(record.id)
                    if (supa) {

                        const url = record['image'] ? record['image'][0].url : null;
                        const pic = `icons/${supa.id}:1`;
                        if (url) {
                            console.log(record, url, pic)
                            fetch(url)
                                .then(resp => resp.blob()
                                    .then(blob => {
                                        storageService.removeFile(pic)
                                            .then(() => {
                                                storageService.upload(pic, blob)
                                                    .then((data: any) => console.log(`uploaded ${pic!}`, data))
                                                    .catch(err => console.error(err))
                                            })
                                    }))
                        }
                        roleService.update(supa.id!,
                            {
                                pic: pic,
                                headline: record['Headline'], // 'Headline'
                                location: record['Location'],  // 'Location'
                                responsibilities: record['Responsibilities'], // 'Responsibilities
                                qualifications: record['Preferred Qualifications'], /// 'Preferred Qualifications
                                key_attributes: record['Key attributes for success'], //Key attributes for success
                                tags: record['Role tags']
                            }
                        )
                    }
                });
            })
    }


}
const migrationService = new MigrationService();

export { migrationService };

