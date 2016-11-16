/**
 * @fileOverview Controller for element sets
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.0.1
 */

import { IController } from './IController';
import { Persistable } from '../core/Persistable';
import { Database } from '../core/Database';

import { CompositeKey } from '../../common/datamodel/Serializable';

export abstract class GenericController<T extends Persistable> implements IController {

    protected tableName: string;
    protected db : Database;

    constructor(
        db: Database,
        table: string) {
        this.db = db;
        this.tableName = table;
    }


    public getItemJson(obj: { new(): T; }, uid: number | CompositeKey) : PromiseLike<T> {

        if (typeof(uid) !== 'number') {
            throw new Error('Expected single column identifier');
        }

        return this.db.loadItem(this.tableName, uid)
        .then((data) => new obj().fromSchema(data));
    }

    public getCollectionJson(obj: { new(): T; }, params: any = {}) : PromiseLike<T[]> {
        return this.db.loadCollection(this.tableName, params)
         .then((data) => data.map((datum) =>  new obj().fromSchema(datum)));
    }

    public postItem(obj: { new(): T; }, data: T) : Promise<string> {
        return this.db.createItem(new obj().deserialize(data));
    }

    public putItem(obj: { new(): T; }, uid: number | CompositeKey, data: T) : PromiseLike<string> {

        if (typeof(uid) !== 'number') {
            throw new Error('Expected single column identifier');
        }

        return this.db.updateItem(new obj().deserialize(data));
    }

    public patchItem(obj: { new(): T; }, uid: number | CompositeKey, data: T) : PromiseLike<boolean> {
        const o = new obj();
        const schemaData = o.deserialize(data).toSchema();

        const keys = Object.keys(schemaData);

        const updateObject = {};

        if (typeof(uid) !== 'number') {
            throw new Error('Expected single column identifier');
        }

        for (let i = 0; i < keys.length; i += 1) {
            if (schemaData[keys[i]] !== undefined) {
                updateObject[keys[i]] = schemaData[keys[i]];
            }
        }

        return this.db.loadItem(this.tableName, uid)
        .then((originalData) => {
            return this.putItem(obj, uid, Object.assign(new obj().fromSchema(originalData).serialize(), updateObject));
        });
    }

    public deleteItem(obj: { new(): T; }, uid: number | CompositeKey) : PromiseLike<string> {

        if (typeof(uid) !== 'number') {
            throw new Error('Expected single column identifier');
        }

        return this.db.deleteItem(this.tableName, uid);
    }
}