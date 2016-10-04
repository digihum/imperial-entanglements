/**
 * @fileOverview Generic controller interface
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import { Config as KnexConfig } from 'knex';
import { Database } from '../core/Database';
import { PersistentObject } from '../../common/datamodel/PersistentObject';

export interface IController<T extends PersistentObject> {

    getItemPage(uid: number) : PromiseLike<string>;
    getItemEditPage(uid: number) : PromiseLike<string>;
    getItemJson(uid: number) : PromiseLike<T>;

    getCollectionPage() : PromiseLike<string>;
    getCollectionEditPage() : PromiseLike<string>;
    getCollectionJson(params: Object) : PromiseLike<string>;

    // create
    postItem(data: any) : PromiseLike<string>;

    // replace
    putItem(uid: number, data: any) : PromiseLike<string>;

    // delete
    deleteItem(uid: number) : PromiseLike<string>;

    // update
    patchItem(uid: number, data: any);
}

export abstract class AbstractController<T extends PersistentObject> implements IController<T> {

    protected db : Database<T>;

    constructor(databaseConfig: KnexConfig) {
        this.db = new Database<T>(databaseConfig);
    }

    public abstract getItemPage(uid: number) : PromiseLike<string>;
    public abstract getItemEditPage(uid: number) : PromiseLike<string>;
    public abstract getItemJson(uid: number) : PromiseLike<T>;

    public abstract getCollectionPage() : PromiseLike<string>;
    public abstract getCollectionEditPage() : PromiseLike<string>;
    public abstract getCollectionJson(params: Object) : PromiseLike<string>;

    // create
    public abstract postItem(data: any) : PromiseLike<string>;

    // replace
    public abstract putItem(uid: number, data: any) : PromiseLike<string>;

    // delete
    public abstract deleteItem(uid: number) : PromiseLike<string>;

    // update
    public abstract patchItem(uid: number, data: any);
}