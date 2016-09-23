/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import * as Knex from 'knex';
import { mapGet } from '../core/MapGet';
import { omit } from 'lodash';

const knex = Knex({
  client: 'sqlite3',
  connection: {
    filename: './mydb.sqlite'
  }
});

export interface PersistentObject {
    readonly tableName : string;
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
    return knex(a.tableName).insert(omit(a, ['uid']), 'uid');
}

export function replaceItem<T>(a: PersistentObject) : Promise<T> {
    // assert - must have uid
    // validation?
    return knex(a.tableName).insert(a, 'uid');
}

export function deleteItem<T>(a: PersistentObject) : Promise<T> {
    // assert - must have uid
    // warning if anything else
    return knex(a.tableName).insert(a, 'uid');
}