/**
 * @fileOverview Generic controller interface
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

import { FalconItem, CompositeKey } from '@digihum/falcon-core';
export interface IController {

    getItemJson<T extends FalconItem>(obj: { new(): T; }, uid: number | CompositeKey) : Promise<T>;

    getCollectionJson<T extends FalconItem>(obj: { new(): T; }, params: any) : Promise<T[]>;

    // create
    postItem<T extends FalconItem>(obj: { new(): T; }, data: T, params: any) : Promise<any>;

    // replace
    putItem<T extends FalconItem>(obj: { new(): T; }, uid: number | CompositeKey, data: T) : Promise<any>;

    // delete
    deleteItem<T extends FalconItem>(obj: { new(): T; }, uid: number | CompositeKey) : Promise<any>;

    // update
    patchItem<T extends FalconItem>(obj: { new(): T; }, uid: number | CompositeKey, data: any) : Promise<any>;
}
