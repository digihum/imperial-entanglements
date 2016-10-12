/**
 * @fileOverview Generic controller interface
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import { Persistable } from '../core/Persistable';

export interface IController {

    getItemJson<T extends Persistable>(obj: { new(): T; }, uid: number) : Promise<T>;

    getCollectionJson<T extends Persistable>(obj: { new(): T; }, params: any) : Promise<T[]>;

    // create
    postItem<T extends Persistable>(obj: { new(): T; }, data: any) : Promise<boolean>;

    // replace
    putItem<T extends Persistable>(obj: { new(): T; }, uid: number, data: any) : Promise<boolean>;

    // delete
    deleteItem<T extends Persistable>(obj: { new(): T; }, uid: number) : Promise<boolean>;

    // update
    patchItem<T extends Persistable>(obj: { new(): T; }, uid: number, data: any) : Promise<boolean>;
}