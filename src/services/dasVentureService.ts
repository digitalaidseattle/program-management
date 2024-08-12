/**
 *  projectService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { pmAirtableService } from "./airtableService";


const PROJECT_TABLE = 'tblFeZtplagoFIQBs';
const EPIC_TABLE = 'tblrCoHnjUwyC2kwq';
const CONTRIBUTOR_TABLE = 'tblOhMRP0MpMXzmjy';
const SPRINT_TABLE = 'tbliVWHEcbUD1sVVA';
const FEATURE_TABLE = 'tblS6QtkKlKLKThO0';
const STORY_TABLE = 'tblyWQ2L5enBia3ew';
const TASK_TABLE = 'tbl9Ttk2DUsAP2iDx';

const MAX_RECORDS = 100;
const FILTER = ``

type VentureProps = {
    venture: any,
};

type SprintProps = {
    sprint: any
}

class DASVentureService {
    
    addEpic = async (epic: any): Promise<any[]> => {
        return pmAirtableService.createRecord(EPIC_TABLE, epic)
            .then(resp => resp)
    }

    getAll = async (): Promise<any[]> => {
        return pmAirtableService.getTableRecords(PROJECT_TABLE, MAX_RECORDS, FILTER)
            .then(records => records.map(r => {
                return {
                    id: r.id,
                    name: r.fields['Project Name'],
                    partner: r.fields['Partners'],
                    status: r.fields['Status'],
                    startDate: r.fields['Start Date']
                } as any
            }));
    }

    getById = async (id: string): Promise<any> => {
        return pmAirtableService.getRecord(PROJECT_TABLE, id)
            .then(r => {
                return {
                    id: r.id,
                    name: r.fields['Project Name'],
                    partner: r.fields['Partners'],
                    status: r.fields['Status'],
                    startDate: r.fields['Start Date'],
                    epicIds: r.fields['Epics'] ?? [],
                    epics: [],
                    contributorIds: r.fields['Project Team'] ?? [],
                    contributors: [],
                    sprintIds: r.fields['Sprint'] ?? [],
                    sprints: []
                } as any
            })
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

const ventureService = new DASVentureService()
export { ventureService };
export type { SprintProps, VentureProps };

