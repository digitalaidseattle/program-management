/**
 *  pmProjectService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { FieldSet, Record } from "airtable";
import { pmAirtableClient } from "../../../services/airtableClient";
import { AirtableRecordService } from "../../../services/airtableRecordService";
import { pmAirtableService } from "../../../services/airtableService";
import { pmContributorService } from "./pmContributorService";
import { Sprint } from "./pmSprintService";

const PROJECT_TABLE = 'tblFeZtplagoFIQBs';
const EPIC_TABLE = 'tblrCoHnjUwyC2kwq';
const FEATURE_TABLE = 'tblS6QtkKlKLKThO0';
const STORY_TABLE = 'tblyWQ2L5enBia3ew';
const TASK_TABLE = 'tbl9Ttk2DUsAP2iDx';

type Project = {
    id: string
    projectId: string
    name: string
    partner: string
    status: string
    startDate: Date
    epicIds: string[]
    epics: Epic[]
    contributorIds: string[]
    contributors: any[],
    sprintIds: string[]
    sprints: any[]
}

type ProjectProps = {
    project: Project,
};

type SprintProps = {
    sprint: Sprint
}

type ProjectsProps = {
    projects: Project[],
};

type Epic = {
    id: string
    epicId: string
    name: string
    description: string
    status: string
    startDate: Date
    featureIds: string[]
    features: Feature[]
}

type Feature = {
    id: string
    featureId: string
    name: string,
    description: string
    storyIds: string[],
    stories: Story[],
    status: string
}

type Story = {
    id: string
    storyId: string
    status: string
    name: string
    description: string
    taskIds: string[]
    tasks: Task[]
}

type Task = {
    id: string
    status: string
    name: string
    description: string
    assigneeIds: string[]
    assignees: any[]
}

class PMTaskService extends AirtableRecordService<Task> {

    public constructor() {
        super(pmAirtableClient.base(import.meta.env.VITE_AIRTABLE_PM_BASE_ID_DAS), TASK_TABLE);
    }

    airtableTransform(record: Record<FieldSet>): Task {
        return {
            id: record.id,
            name: record.fields['Name'],
            description: record.fields['Description'],
            status: record.fields['Task Status'],
            assigneeIds: record.fields['Task Assignee'],
            assignees: [] as any[]
        } as Task
    }

    findByStory(story: Story): Promise<Task[]> {
        const FILTER = `FIND('${story.storyId}', ARRAYJOIN({User Story}))`;
        return this.findAll(undefined, FILTER)
    }

    findBySprint(sprint: Sprint): Promise<Task[]> {
        const FILTER = `FIND('${sprint.sprintId}', ARRAYJOIN({Sprint}))`;
        return this.findAll(undefined, FILTER)
    }

    findByProject(project: Project): Promise<Task[]> {
        const FILTER = `FIND('${project.projectId}', ARRAYJOIN({Project Link}))`;
        return this.findAll(undefined, FILTER)
    }

}


class PMStoryService extends AirtableRecordService<Story> {

    public constructor() {
        super(pmAirtableClient.base(import.meta.env.VITE_AIRTABLE_PM_BASE_ID_DAS), STORY_TABLE);
    }

    airtableTransform(record: Record<FieldSet>): Story {
        return {
            id: record.id,
            storyId: record.fields['User Story ID'],
            name: record.fields['Story Name'],
            description: record.fields['Story Description'],
            taskIds: record.fields['Tasks'],
            tasks: [] as Task[],
            status: record.fields['Status']
        } as Story
    }

    findByFeature(feature: Feature): Promise<Story[]> {
        const FILTER = `FIND('${feature.featureId}', ARRAYJOIN({Feature}))`;
        return this.findAll(undefined, FILTER)
    }

}

class PMFeatureService extends AirtableRecordService<Feature> {

    public constructor() {
        super(pmAirtableClient.base(import.meta.env.VITE_AIRTABLE_PM_BASE_ID_DAS), FEATURE_TABLE);
    }

    airtableTransform(record: Record<FieldSet>): Feature {
        return {
            id: record.id,
            featureId: record.fields['Feature ID'],
            name: record.fields['Name'],
            description: record.fields['Description'],
            storyIds: record.fields['User Story'],
            stories: [] as Story[],
            status: record.fields['Status']
        } as Feature
    }

    async findByEpic(epic: Epic): Promise<Feature[]> {
        const FILTER = `FIND('${epic.epicId}', ARRAYJOIN({Epics}))`;
        return this.findAll(undefined, FILTER)
    }

}

class PMEpicService extends AirtableRecordService<Epic> {

    public constructor() {
        super(pmAirtableClient.base(import.meta.env.VITE_AIRTABLE_PM_BASE_ID_DAS), EPIC_TABLE);
    }

    airtableTransform(record: Record<FieldSet>): Epic {
        return {
            id: record.id,
            epicId: record.fields['Epic Name'],
            name: record.fields['Epic ID'],
            description: record.fields['Description'],
            status: record.fields['Status'],
            featureIds: record.fields['Feature'],
            startDate: record.fields['Start Date'] ? new Date(Date.parse(record.fields['Start Date'] as string)) : undefined,
        } as Epic
    }

    async findByProject(project: Project): Promise<Epic[]> {
        const FILTER = `FIND('${project.projectId}', ARRAYJOIN({Project}))`;
        return this.findAll(undefined, FILTER)
    }

}

class PMProjectService extends AirtableRecordService<Project> {

    public constructor() {
        super(pmAirtableClient.base(import.meta.env.VITE_AIRTABLE_PM_BASE_ID_DAS), PROJECT_TABLE);
    }

    airtableTransform(record: Record<FieldSet>): Project {
        return {
            id: record.id,
            projectId: record.fields['Project Name'],
            name: record.fields['Project Name'],
            partner: record.fields['Partners'],
            status: record.fields['Status'],
            startDate: record.fields['Start Date'] ? new Date(Date.parse(record.fields['Start Date'] as string)) : undefined,
            epicIds: record.fields['Epics'] ?? [],
            epics: [] as any[],
            contributorIds: record.fields['Project Team'] ?? [],
            contributors: [] as any[],
            sprintIds: record.fields['Sprint'] ?? [],
            sprints: [] as any[]
        } as Project
    }

    getContributors = async (project: any): Promise<any> => {
        return Promise
            .all(project.contributorIds.map((eid: string) => pmContributorService.getById(eid)))
    }

    getFeatures = async (epic: Epic): Promise<Feature[]> => {
        return Promise
            .all(epic.featureIds.map((eid: string) => pmFeatureService.getById(eid)))
    }

    getStories = async (feature: Feature): Promise<Story[]> => {
        return Promise
            .all(feature.storyIds.map((sid: string) => pmStoryService.getById(sid)))
    }

    getTasks = async (story: Story): Promise<Task[]> => {
        return Promise
            .all(story.taskIds.map((tid: string) => pmTaskService.getById(tid)))
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

const pmTaskService = new PMTaskService()
const pmStoryService = new PMStoryService()
const pmFeatureService = new PMFeatureService()
const pmEpicService = new PMEpicService()
const pmProjectService = new PMProjectService()
export { pmTaskService, pmStoryService, pmFeatureService, pmEpicService, pmProjectService };
export type { Task, Story, Feature, Epic, Project, ProjectProps, SprintProps, ProjectsProps };

