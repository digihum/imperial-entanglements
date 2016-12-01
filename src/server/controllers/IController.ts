/**
 * @fileOverview Generic controller interface
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import { FalconItem, CompositeKey } from 'falcon-core';
export interface IController {

    getItemJson<T extends FalconItem>(obj: { new(): T; }, uid: number | CompositeKey) : PromiseLike<T>;

    getCollectionJson<T extends FalconItem>(obj: { new(): T; }, params: any) : PromiseLike<T[]>;

    // create
    postItem<T extends FalconItem>(obj: { new(): T; }, data: T) : PromiseLike<any>;

    // replace
    putItem<T extends FalconItem>(obj: { new(): T; }, uid: number | CompositeKey, data: T) : PromiseLike<any>;

    // delete
    deleteItem<T extends FalconItem>(obj: { new(): T; }, uid: number | CompositeKey) : PromiseLike<any>;

    // update
    patchItem<T extends FalconItem>(obj: { new(): T; }, uid: number | CompositeKey, data: any) : PromiseLike<any>;
}
