/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import * as Knex from 'knex';
import { omit } from 'lodash';

const knex = Knex({
  client: 'sqlite3',
  connection: {
    filename: './mydb.sqlite'
  }
});

export interface PersistentObject {
    readonly tableName : string;
    uid: number | null;
}

export function loadItem<T>(a: PersistentObject, uid: number) : Promise<T> {
    return knex.select()
        .from(a.tableName)
        .where({ uid: uid })
        .first()
        .then((result) => result === undefined ? Promise.reject('Not Found') :
            Object.keys(result).reduce((prev, curr) =>
                Object.assign(prev, {[curr]: result[curr]}), {}));
}

export function createItem<T>(a: PersistentObject) : Promise<T> {
    // throw warning if called with uid
    // validate that everything else has been sent
    const withoutUid = omit(a, ['uid', 'tableName']);
    return knex.insert(withoutUid, 'uid').into(a.tableName);
}

export function updateItem<T>(a: PersistentObject) : Promise<T> {
    // assert - must have uid
    // validation?
    return knex(a.tableName)
        .where({ 'uid': a.uid })
        .update(omit(a, ['tableName']));
}

export function deleteItem<T>(tableName: string, uid: number) : Promise<T> {
    return knex(tableName)
        .where({ uid })
        .del();
}