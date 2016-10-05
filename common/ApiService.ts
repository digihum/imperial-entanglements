/**
 * @fileOverview Various tool functions.
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import { PersistentObject } from './datamodel/PersistentObject';

export interface ApiService {
    getItem<T extends PersistentObject>(obj: { new(): T; }, baseUrl : string, uid: number) : Promise<T>;
    getCollection<T extends PersistentObject>(obj: { new(): T; }, baseUrl : string) : Promise<T[]>;

    postItem<T extends PersistentObject>(baseUrl : string, data: T) : Promise<boolean>;
    putItem<T extends PersistentObject>(baseUrl : string, uid: number, data: T) : Promise<boolean>;
    patchItem<T extends PersistentObject>(baseUrl : string, uid: number, data : T) : Promise<boolean>;
    delItem<T extends PersistentObject>(baseUrl : string, uid: number) : Promise<boolean>;
}