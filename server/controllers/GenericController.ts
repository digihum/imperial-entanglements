/**
 * @fileOverview Controller for element sets
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.0.1
 */

import { AbstractController } from './IController';
import { PersistentObject } from '../../common/datamodel/PersistentObject';
import { Database } from '../core/Database';

export class GenericController<T extends PersistentObject> extends AbstractController {

    private tableName: string;

    constructor(
        db: Database,
        table: string) {
        super(db);
        this.tableName = table;
    }


    public getItemJson(obj: { new(): T; }, uid: number) : Promise<T> {
        return this.db.loadItem(this.tableName, uid)
        .then((data) => new obj().fromJson(data));
    }

    public getCollectionJson(obj: { new(): T; }, params: Object = {}) : Promise<T[]> {
        return this.db.loadCollection(this.tableName, params)
         .then((data) => data.map((datum) => new obj().fromJson(datum)));
    }

    public postItem(data: T) : Promise<string> {
        return this.db.createItem(data);
    }

    public putItem(uid: number, data: T) : Promise<string> {
        return this.db.updateItem(data);
    }

    public patchItem(uid: number, data: T) : Promise<string> {
        return Promise.resolve('');
    }

    public deleteItem(uid: number) : Promise<string> {
        return this.db.deleteItem(this.tableName, uid);
    }
}