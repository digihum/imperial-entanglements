/**
 * @fileOverview Generic controller interface
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import { Persistable } from '../core/Persistable';
import { CompositeKey } from '../../common/datamodel/Serializable';

export interface IController {

    getItemJson<T extends Persistable>(obj: { new(): T; }, uid: number | CompositeKey) : PromiseLike<T>;

    getCollectionJson<T extends Persistable>(obj: { new(): T; }, params: any) : PromiseLike<T[]>;

    // create
    postItem<T extends Persistable>(obj: { new(): T; }, data: any) : PromiseLike<boolean>;

    // replace
    putItem<T extends Persistable>(obj: { new(): T; }, uid: number | CompositeKey, data: any) : PromiseLike<boolean>;

    // delete
    deleteItem<T extends Persistable>(obj: { new(): T; }, uid: number | CompositeKey) : PromiseLike<boolean>;

    // update
    patchItem<T extends Persistable>(obj: { new(): T; }, uid: number | CompositeKey, data: any) : PromiseLike<boolean>;
}