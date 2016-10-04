/**
 * @fileOverview Controller for element sets
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.0.1
 */

import { Config as KnexConfig } from 'knex';

import { AbstractController } from './IController';
import { PersistentObject } from '../../common/datamodel/PersistentObject';

export class GenericController<T extends PersistentObject> extends AbstractController<T> {

    private tableName: string;

    constructor(
        databaseConfig: KnexConfig,
        table: string) {
        super(databaseConfig);
        this.tableName = table;
    }


    public getItemJson(uid: number) : PromiseLike<T> {
        return this.db.loadItem(this.tableName, uid);
    }

    public getCollectionJson(params: Object = {}) : PromiseLike<string> {
        return this.db.loadCollection(this.tableName, params);
    }

    public postItem(data: T) : PromiseLike<string> {
        return this.db.createItem(data);
    }

    public putItem(uid: number, data: T) : PromiseLike<string> {
        return this.db.updateItem(data);
    }

    public patchItem(uid: number, data: T) : PromiseLike<string> {
        return Promise.resolve('');
    }

    public deleteItem(uid: number) : PromiseLike<string> {
        return this.db.deleteItem(this.tableName, uid);
    }
}