/**
 * @fileOverview Generic controller interface
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import { Database } from '../core/Database';
import { PersistentObject } from '../../common/datamodel/PersistentObject';

export interface IController {

    getItemJson<T extends PersistentObject>(obj: { new(): T; }, uid: number) : Promise<T>;

    getCollectionJson<T extends PersistentObject>(obj: { new(): T; }, params: Object) : Promise<T[]>;

    // create
    postItem<T extends PersistentObject>(data: any) : Promise<boolean>;

    // replace
    putItem<T extends PersistentObject>(uid: number, data: any) : Promise<boolean>;

    // delete
    deleteItem<T extends PersistentObject>(uid: number) : Promise<boolean>;

    // update
    patchItem<T extends PersistentObject>(uid: number, data: any) : Promise<boolean>;
}

export abstract class AbstractController implements IController {

    protected db : Database;

    constructor(db: Database) {
        this.db = db;
    }

    public abstract getItemJson<T extends PersistentObject>(obj: { new(): T; }, uid: number) : Promise<T>;

    public abstract getCollectionJson<T extends PersistentObject>(obj: { new(): T; }, params: Object) : Promise<T[]>;

    // create
    public abstract postItem<T extends PersistentObject>(data: any) : Promise<string>;

    // replace
    public abstract putItem<T extends PersistentObject>(uid: number, data: any) : Promise<string>;

    // delete
    public abstract deleteItem<T extends PersistentObject>(uid: number) : Promise<string>;

    // update
    public abstract patchItem<T extends PersistentObject>(uid: number, data: any);
}