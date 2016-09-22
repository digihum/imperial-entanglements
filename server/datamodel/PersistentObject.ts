/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import * as Knex from 'knex';
import { mapGet } from '../core/MapGet';

const knex = Knex({
  client: 'sqlite3',
  connection: {
    filename: './mydb.sqlite'
  }
});

export interface PersistentObject {
    readonly tableName : string;
    readonly columnNames : Map<string, string>;
}

export function load<T>(a: PersistentObject, uid: number) : Promise<T> {
    return knex.select()
        .from(a.tableName)
        .where({ uid: uid })
        .first()
        .then((result) => result === undefined ? Promise.reject('Not Found') :
            Object.keys(result).reduce((prev, curr) =>
                a.columnNames.has(curr) ? Object.assign(prev, {[mapGet(a.columnNames, curr)]: result[curr]}) : prev, {}));
}

export function create<T>(a: PersistentObject) : Promise<T> {
    return knex(a.tableName).insert(a, 'uid');
}

export function replace<T>(a: PersistentObject) : Promise<T> {
    return knex(a.tableName).insert(a, 'uid');
}

export function update<T>(a: PersistentObject) : Promise<T> {
    return knex(a.tableName).insert(a, 'uid');
}