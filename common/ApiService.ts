/**
 * @fileOverview Various tool functions.
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import { Serializable } from './datamodel/Serializable';

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
    getItem<T extends Serializable>(obj: { new(): T; }, baseUrl : string, uid: number) : Promise<T>;
    getCollection<T extends Serializable>(obj: { new(): T; }, baseUrl : string, params: any) : Promise<T[]>;

    postItem<T extends Serializable>(obj: { new(): T; }, baseUrl : string, data: T) : Promise<boolean>;
    putItem<T extends Serializable>(obj: { new(): T; }, baseUrl : string, uid: number, data: T) : Promise<boolean>;

    //TODO: patch item takes a subset of an objects properties. This is currently being looked at in TS in the 
    //context of the 'setState' function in react
    patchItem<T extends Serializable>(obj: { new(): T; }, baseUrl : string, uid: number, data : any) : Promise<boolean>;
    delItem<T extends Serializable>(obj: { new(): T; }, baseUrl : string, uid: number) : Promise<boolean>;
} 