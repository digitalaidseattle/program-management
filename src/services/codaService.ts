/**
 *  codaService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { EntityService, Identifier, User } from "@digitalaidseattle/core";
import { Entity } from "@digitalaidseattle/supabase";

// @ts-ignore - Vite injects env at runtime
const CODA_API_TOKEN = import.meta.env.VITE_CODA_API_TOKEN;

type CodaRow = {
    id: string;
    values: Record<string, any>;
}

abstract class CodaService<T extends Entity> implements EntityService<T> {
    documentId = '';
    tableName = '';
    select = '*';
    mapper = (json: any) => (json as T);
    entityToCodaMapper = (_entity: T) => ({} as any);
    documentBase = '';

    constructor(documentId: string, tableName: string, opts?: { select?: string, mapper?: (json: any) => T, entityToCodaMapper?: (_entity: T) => {} }) {
        this.documentId = documentId;
        this.tableName = tableName;
        this.documentBase = `https://coda.io/apis/v1/docs/${this.documentId}/tables/${this.tableName}`;
        this.select = opts ? opts.select ?? '*' : "*";
        this.mapper = opts ? opts.mapper ?? ((json: any) => json) : ((json: any) => json);
        this.entityToCodaMapper = opts ? opts.entityToCodaMapper ?? ((_entity: any) => ({} as any)) : ((_entity: any) => ({} as any));

    }

    getDocumentBase() {
        return
    }


    upsert(_entity: T, _select?: string, _mapper?: ((json: any) => T) | undefined, _user?: User): Promise<T> {
        throw new Error("Method not implemented.");
    }

    getById(_id: Identifier, _select?: string, _mapper?: ((json: any) => T) | undefined): Promise<T | null> {
        throw new Error("Method not implemented.");
    }

    insert(_entity: T, _select?: string, _mapper?: ((json: any) => T) | undefined, _user?: User): Promise<T> {
        throw new Error("Method not implemented.");
    }

    update(_id: Identifier, _changes: Partial<T>, _select?: string, _mapper?: ((json: any) => T) | undefined, _user?: User): Promise<T> {
        throw new Error("Method not implemented.");
    }

    delete(_id: Identifier, _user?: User): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async getAll(_count?: number, _select?: string, _mapper?: (json: any) => T): Promise<T[]> {
        const params = new URLSearchParams({
            limit: "200",
            useColumnNames: "true",
            valueFormat: "rich"
        });
        const url = `${this.documentBase}/rows?${params}`;

        const resp = await fetch(url, {
            headers: { 'Authorization': `Bearer ${CODA_API_TOKEN}` }
        });

        if (!resp.ok) {
            const error = await resp.json().catch(() => ({ message: resp.statusText }));
            throw new Error(`Failed to fetch rows: ${error.message || resp.statusText}`);
        }

        const data = await resp.json();
        return data.items.map((json: any) => this.mapper(json))
    }

    async batchInsert(entities: T[], _select?: string, _mapper?: (json: any) => T, _user?: User): Promise<T[]> {
        // }
        // async createRows(tableId: string, rows: { cells: { column: string, value: any }[] }[]): Promise<any> {
        const rows = entities.map(entity => this.entityToCodaMapper(entity));

        const resp = await fetch(`${this.documentBase}/rows`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${CODA_API_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rows })
        });

        // Coda API returns 202 Accepted for async processing
        if (resp.status !== 202 && !resp.ok) {
            const error = await resp.json()
                .catch(() => ({ message: resp.statusText }));
            throw new Error(`Failed to create rows: ${error.message || resp.statusText}`);
        }

        // Return the response (202 Accepted means the request was queued successfully)
        return resp.json()
            .then(data => {
                console.log(data)
                // TODO look up rows
                return data.addedRowIds.map((id: string) => ({ id: id }))
            })

    }

    async findBy(column: string, name: string): Promise<T[]> {
        const url = `${this.documentBase}/rows?query=${column}:"${name}"`;
        const resp = await fetch(encodeURI(url), {
            headers: { 'Authorization': `Bearer ${CODA_API_TOKEN}` }
        });

        if (!resp.ok) {
            const error = await resp.json().catch(() => ({ message: resp.statusText }));
            throw new Error(`Failed to fetch rows: ${error.message || resp.statusText}`);
        }

        const data = await resp.json();
        return data.items.map((json: any) => this.mapper(json))
    }
}

export { CodaService };
export type { CodaRow }

