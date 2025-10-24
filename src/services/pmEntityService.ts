/**
 *  PMEntityService.ts
 *
 *  extending to fix component library
 * 
 *  @copyright 20245Digital Aid Seattle
 *
 */

import { Entity, PageInfo, QueryModel, supabaseClient, SupabaseEntityService } from "@digitalaidseattle/supabase";

abstract class PMEntityService<T extends Entity> extends SupabaseEntityService<T> {

    async find(queryModel: QueryModel, select?: string, mapper?: (json: any) => T): Promise<PageInfo<T>> {
        try {
            let sortField = queryModel.sortField
            const sortOperator = { ascending: queryModel.sortDirection === 'asc' } as any
            if (sortField.includes('.')) {
                const split = sortField.split('.');
                sortField = `${split[0]}(${split[1]})`;
            }

            let query: any = supabaseClient
                .from(this.tableName)
                .select(select ?? '*', { count: 'exact' })
                .range(queryModel.page * queryModel.pageSize, (queryModel.page + 1) * queryModel.pageSize - 1)
                .order(sortField, sortOperator);

            const filterModel = (queryModel as any).filterModel;
            if (filterModel && filterModel.items) {
                filterModel.items.forEach((filter: any) => {
                    const field = filter.field;
                    const operator = filter.operator;
                    const value = filter.value;
                    if (field && operator && value) {
                        switch (operator) {
                            case '=':
                            case 'equals':
                                query = query.eq(field, value)
                                break;
                            case '!=':
                            case 'doesNotEqual':
                                query = query.neq(field, value)
                                break;
                            case '>':
                                query = query.gt(field, value)
                                break;
                            case '<':
                                query = query.lt(field, value)
                                break;
                            case 'contains':
                                query = query.ilike(field, `%${value}%`)
                                break;
                            case 'startsWith':
                                query = query.ilike(field, `${value}%`)
                                break;
                            case 'endsWith':
                                query = query.ilike(field, `%${value}`)
                                break;
                        }
                    }
                })
            }



            return query.then((resp: any) => {
                return {
                    rows: mapper ? resp.data.map((json: any) => mapper(json)) : resp.data,
                    totalRowCount: resp.count,
                };
            })
        } catch (err) {
            console.error('Unexpected error:', err);
            throw err;
        }
    }
}

export { PMEntityService };

