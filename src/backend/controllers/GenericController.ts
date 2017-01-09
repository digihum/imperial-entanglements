/**
 * @fileOverview Generic controller containing logic common to most controller classes
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.0.1
 */

import { IController } from './IController';
import { Database } from '../data/Database';

import { CompositeKey, FalconItem } from 'falcon-core';

export abstract class GenericController<T extends FalconItem> implements IController {

    protected tableName: string;
    protected readTableName: string;

    protected db : Database;

    constructor(
        db: Database,
        table: string,
        readTable?: string) {
        this.db = db;
        this.tableName = table;
        this.readTableName = readTable === undefined ? table : readTable;
    }

    protected abstract fromSchema(data: any) : T;
    protected abstract toSchema(data: T) : any;


    public getItemJson(obj: { new(): T; }, uid: number | CompositeKey) : Promise<T> {

        if (typeof(uid) !== 'number') {
            throw new Error('Expected single column identifier');
        }

        return this.db.loadItem(this.readTableName, uid)
        .then((data) => this.fromSchema(data));
    }

    public getCollectionJson(obj: { new(): T; }, params: any = {}) : Promise<T[]> {
        return this.db.loadCollection(this.readTableName, params)
         .then((data) => data.map((datum) =>  this.fromSchema(datum)));
    }

    public postItem(obj: { new(): T; }, data: T) : Promise<any> {
        return this.db.createItem(this.tableName, this.toSchema(data));
    }

    public putItem(obj: { new(): T; }, uid: number | CompositeKey, data: T) : Promise<string> {

        if (typeof(uid) !== 'number') {
            throw new Error('Expected single column identifier');
        }

        return this.db.updateItem(this.tableName, this.toSchema(data));
    }

    public patchItem(obj: { new(): T; }, uid: number | CompositeKey, data: T) : Promise<boolean> {

        if (typeof(uid) !== 'number') {
            throw new Error('Expected single column identifier');
        }

        return this.db.loadItem(this.tableName, uid)
        .then((originalData) => {
            return this.db.updateItem(this.tableName, this.toSchema(Object.assign(this.fromSchema(originalData), data)));
        });
    }

    public deleteItem(obj: { new(): T; }, uid: number | CompositeKey) : Promise<string> {

        if (typeof(uid) !== 'number') {
            throw new Error('Expected single column identifier');
        }

        return this.db.deleteItem(this.tableName, uid);
    }
}
