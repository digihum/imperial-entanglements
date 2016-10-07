/**
 * @fileOverview Various tool functions.
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import { PersistentObject } from './datamodel/PersistentObject';

export class AppUrls {
    public static elementSet: string = 'element_set';
    public static record: string = 'record';
    public static entity: string = 'entity';
    public static entityType: string = 'entity_type';
    public static predicate: string = 'predicate';
    public static source: string = 'source';

    public tmp: string;
}

export interface ApiService {
    getItem<T extends PersistentObject>(obj: { new(): T; }, baseUrl : string, uid: number) : Promise<T>;
    getCollection<T extends PersistentObject>(obj: { new(): T; }, baseUrl : string, params: any) : Promise<T[]>;

    postItem<T extends PersistentObject>(baseUrl : string, data: T) : Promise<boolean>;
    putItem<T extends PersistentObject>(baseUrl : string, uid: number, data: T) : Promise<boolean>;
    patchItem<T extends PersistentObject>(baseUrl : string, uid: number, data : T) : Promise<boolean>;
    delItem<T extends PersistentObject>(baseUrl : string, uid: number) : Promise<boolean>;
} 