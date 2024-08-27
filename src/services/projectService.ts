/**
 *  projectService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { dasAirtableService, pmAirtableService } from "./airtableService";

const EPIC_TABLE = 'tblrCoHnjUwyC2kwq';
const CONTRIBUTOR_TABLE = 'tblOhMRP0MpMXzmjy';
const SPRINT_TABLE = 'tbliVWHEcbUD1sVVA';
const FEATURE_TABLE = 'tblS6QtkKlKLKThO0';
const STORY_TABLE = 'tblyWQ2L5enBia3ew';
const TASK_TABLE = 'tbl9Ttk2DUsAP2iDx';


type VentureProps = {
    venture: any,
};

type SprintProps = {
    sprint: any
}
const PARTNER_TABLE = 'tblqttKinLZJ2JXo7';
const VENTURES_TABLE = 'tblRpJek5SjacLaen'; // VENTURE SEEDS/PAINPOINTS TABLE

class ProjectService {
    filteredStatuses = ['Active', 'Under evaluation'];

    async airtableTransform(fields: any): Promise<any> {
        return dasAirtableService.getRecord(PARTNER_TABLE, fields.Partner[0])
            .then(resp => {
                console.log('ven',fields)
                const logos: any[] = resp.fields['logo'] as any[];
                return {
                    id: fields['AirTable ID'],
                    title: resp.fields['Org name'],
                    painpoint: fields['Painpoint Shorthand'],
                    status: fields['Status'],
                    problem: fields['Problem (for DAS website)'],
                    solution: fields['Solution (for DAS website)'],
                    impact: fields['Impact (for DAS website)'],
                    description: resp.fields['Org description'],
                    imageSrc: (logos && logos.length > 0) ? logos[0].url : null,
                    programAreas: fields['Foci (from Partner)'],
                    projectLink: `project/${fields['AirTable ID']}`,
                    ventureCode: fields['Prospective Venture Code'],
                    evaluatingTaskGroup: fields['Evaluating Task Group'] ? fields['Evaluating Task Group'][0] : undefined,
                }
            })
    }

    async getAll(): Promise<any[]> {
        const MAX_RECORDS = 100;
        const FILTER = ``;
        // const ACTIVE_FILTER = '';
        return await dasAirtableService
            .getTableRecords(VENTURES_TABLE, MAX_RECORDS, FILTER)
            .then(records => Promise.all(records.map(record => this.airtableTransform(record.fields))))
    }

    async getAllByStatus(filteredStatuses: string[]): Promise<any[]> {
        const MAX_RECORDS = 100;
        const FILTER = `OR(${filteredStatuses.map(s => `{Status} = "${s}"`).join(", ")})`;
        return await dasAirtableService
            .getTableRecords(VENTURES_TABLE, MAX_RECORDS, FILTER)
            .then(records => Promise.all(records.map(record => this.airtableTransform(record.fields))))
    }

    getById = async (id: string): Promise<any> => {
        return dasAirtableService.getRecord(VENTURES_TABLE, id)
            .then(r => this.airtableTransform(r.fields))
    }

    update = async (venture: any, changes: any): Promise<any> => {
        return dasAirtableService.update(VENTURES_TABLE, venture.id, changes)
            .then(r => this.airtableTransform(r.fields))
            .catch(err => console.error('error', err))
    }


    addEpic = async (epic: any): Promise<any[]> => {
        return pmAirtableService.createRecord(EPIC_TABLE, epic)
            .then(resp => resp)
    }

    getEpics = async (project: any): Promise<any> => {
        return Promise.all(project.epicIds
            .map((e: string) => pmAirtableService.getRecord(EPIC_TABLE, e)))
            .then((resps: any) =>
                resps.map((r: any) => {
                    return {
                        id: r.id,
                        name: r.fields['Epic Name'],
                        status: r.fields['Status'],
                        description: r.fields['Description'],
                        featureIds: r.fields['Feature'],
                        features: []
                    } as any
                })
            )
    }

    getContributors = async (project: any): Promise<any> => {
        return Promise.all(project.contributorIds
            .map((e: string) => pmAirtableService.getRecord(CONTRIBUTOR_TABLE, e)))
            .then((resps: any) =>
                resps.map((r: any) => {
                    return {
                        id: r.id,
                        name: r.fields['Name'],
                        email: r.fields['DAS email'],
                        role: r.fields['Role']
                    } as any
                })
            )
    }

    getSprints = async (project: any): Promise<any> => {
        return Promise.all(project.sprintIds
            .map((e: string) => pmAirtableService.getRecord(SPRINT_TABLE, e)))
            .then((resps: any) =>
                resps.map((s: any) => {
                    return {
                        id: s.id,
                        name: s.fields['Sprint Name'],
                        goal: s.fields['Sprint Goal'],
                        startDate: s.fields['Start Date'],
                        endDate: s.fields['End Date'],
                        taskIds: s.fields['Tasks']
                    } as any
                })
            )
    }

    getFeatures = async (epic: any): Promise<any> => {
        return Promise.all(epic.featureIds
            .map((e: string) => pmAirtableService.getRecord(FEATURE_TABLE, e)))
            .then((resps: any) =>
                resps.map((f: any) => {
                    return {
                        id: f.id,
                        name: f.fields['Name'],
                        storyIds: f.fields['User Story'],
                        stories: [],
                        status: f.fields['Status']
                    } as any
                })
            )
    }

    getStories = async (feature: any): Promise<any> => {
        return Promise.all(feature.storyIds
            .map((s: string) => pmAirtableService.getRecord(STORY_TABLE, s)))
            .then((resps: any) =>
                resps.map((s: any) => {
                    return {
                        id: s.id,
                        name: s.fields['Story Name'],
                        taskIds: s.fields['Tasks'],
                        tasks: [],
                        description: s.fields['Story Description']
                    } as any
                })
            )
    }

    getTasks = async (story: any): Promise<any> => {
        return Promise.all(story.taskIds
            .map((t: string) => pmAirtableService.getRecord(TASK_TABLE, t)))
            .then((resps: any) =>
                resps.map((t: any) => {
                    return {
                        id: t.id,
                        name: t.fields['Name'],
                        description: t.fields['Description'],
                        status: t.fields['Task Status']
                    } as any
                })
            )
    }

    addSprint = async (): Promise<any> => {
        const sprint = {
            "Start Date": "2024-06-26",
            "End Date": "2024-07-16",
            "Project": ["rec4773yUtwBtzf5Z"],
            "Sprint Goal": "map visualization for past hospitals",
            "Status": "Active",
        }

        return pmAirtableService.createRecord('tbliVWHEcbUD1sVVA', sprint)
            .then(resp => resp)
    }
}

const projectService = new ProjectService()
export { projectService };
export type { SprintProps, VentureProps };

