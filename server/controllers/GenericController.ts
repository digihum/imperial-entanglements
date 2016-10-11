/**
 * @fileOverview Controller for element sets
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.0.1
 */

import { IController } from './IController';
import { Persistable } from '../core/Persistable';
import { Database } from '../core/Database';

export abstract class GenericController<T extends Persistable> implements IController {

    protected tableName: string;
    protected db : Database;

    constructor(
        db: Database,
        table: string) {
        this.db = db;
        this.tableName = table;
    }


    public getItemJson(obj: { new(): T; }, uid: number) : Promise<T> {
        return this.db.loadItem(this.tableName, uid)
        .then((data) => new obj().fromSchema(data));
    }

    public getCollectionJson(obj: { new(): T; }, params: any = {}) : Promise<T[]> {
        return this.db.loadCollection(this.tableName, params)
         .then((data) => data.map((datum) =>  new obj().fromSchema(datum)));
    }

    public postItem(data: T) : Promise<string> {
        return this.db.createItem(data);
    }

    public putItem(uid: number, data: T) : Promise<string> {
        return this.db.updateItem(data);
    }

    public patchItem(obj: { new(): T; }, uid: number, data: T) : Promise<boolean> {
        const o = new obj();
        const keys = Object.keys(data);

        o.deserialize(data);

        const updateObject = {};

        for (let i = 0; i < keys.length; i += 1) {
            if (o.hasOwnProperty(keys[i])) {
                updateObject[keys[i]] = o[keys[i]];
            }
        }

        return this.db.query()(this.tableName)
            .where({ uid })
            .update(updateObject)
            .then(() => true)
            .catch((err) => err);
    }

    public deleteItem(uid: number) : Promise<string> {
        return this.db.deleteItem(this.tableName, uid);
    }
}