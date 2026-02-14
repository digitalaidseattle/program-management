/**
 *  proctorService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { Entity } from "@digitalaidseattle/core";
import { CodaRow, CodaService } from "../../services/codaService";

// @ts-ignore - Environment variables are defined at runtime
// @ts-ignore
const LINK_TABLE_ID = import.meta.env.VITE_CODA_SCHEDULE_LINK_TABLE_ID;

// Column IDs discovered from Coda API for schedule link table (grid-mp-Lzk8BLN)
const CODA_COLUMNS = {
    url: 'c-6ZlUhINYhy',      // "Link" column
    status: 'c-bcWSzbGxNd',   // "Status" column
    interviewer: 'c-txayd-tSjq' // "Interviewer" column
} as const;


type SchedulingLink = Entity & {
    url: string;
    status: string;
    interviewer: string;
}

function entity2coda(schedulingLink: SchedulingLink) {
    return {
        cells: [
            { column: CODA_COLUMNS.url, value: schedulingLink.url },
            { column: CODA_COLUMNS.status, value: schedulingLink.status },
            { column: CODA_COLUMNS.interviewer, value: schedulingLink.interviewer }
        ]
    };
}

function coda2entity(row: CodaRow): SchedulingLink {
    return {
        url: row.values[CODA_COLUMNS.url],
        status: row.values[CODA_COLUMNS.status],
        interviewer: row.values[CODA_COLUMNS.interviewer]
    } as SchedulingLink;
}

class SchedulingLinkService extends CodaService<SchedulingLink> {
    static AVAILABLE_STATUS = 'Available';
    static instance: SchedulingLinkService;

    static newInstance() {
        if (!this.instance) {
            this.instance = new SchedulingLinkService();
        }
        return this.instance;
    }

    constructor() {
        super(LINK_TABLE_ID, "*", coda2entity, entity2coda)
    }

    // REVIEW lookup current user?
    empty(): SchedulingLink {
        return {
            id: '',
            url: '',
            status: SchedulingLinkService.AVAILABLE_STATUS,
            interviewer: ''
        }
    }

    async findByName(name: string): Promise<SchedulingLink[]> {
        return this.findBy(CODA_COLUMNS.interviewer, name);
    }

}

export { SchedulingLinkService };
export type { SchedulingLink };

