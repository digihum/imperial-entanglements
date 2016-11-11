/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */


import * as Knex from 'knex';
import { omit } from 'lodash';

import { Persistable } from './Persistable';

import { KeyNotFoundException } from './Exceptions';

export class Database {

    private knex : Knex;

    constructor(config: Knex.Config) {
        this.knex = Knex(config);
    }

    public query() : Knex {
        return this.knex;
    }

    public loadItem(a: string, uid: number) : Promise<any> {
        const query = this.knex.select()
            .from(a)
            .where({ uid: uid })
            .first();

        return query.then((result) => result === undefined ? Promise.reject(new KeyNotFoundException()) : result);
    }

    public loadCollection(a: string, params: Object) : Promise<any[]> {
        let query = this.knex.select()
            .from(a);

        Object.keys(params).forEach((param) => {
            query = query.whereIn(param, params[param]);
        });

        return query.then((results) => results === undefined ? Promise.reject(new KeyNotFoundException()) : results);
    }

    public createItem(a: Persistable) : Promise<any> {
        // throw warning if called with uid
        // validate that everything else has been sent
        const withoutUid = omit(a.toSchema(), ['uid', 'tableName']);
        return this.knex.insert(withoutUid, 'uid').into(a.getTableName()).returning('uid');
    }

    public updateItem(a: Persistable) : PromiseLike<any> {
        // assert - must have uid
        // validation?
        return this.knex(a.getTableName())
            .where({ 'uid': a.uid })
            .update(omit(a.toSchema(), ['tableName']));
    }

    public deleteItem(tableName: string, uid: number) : PromiseLike<any> {
        return this.knex(tableName)
            .where({ uid })
            .del();
    }
}
