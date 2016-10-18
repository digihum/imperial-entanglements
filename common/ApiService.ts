/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import { Serializable } from './datamodel/Serializable';

export class AppUrls {
    public static elementSet: string = 'element_set';
    public static record: string = 'record';
    public static entity: string = 'entity';
    public static entityType: string = 'entity_type';
    public static predicate: string = 'predicate';
    public static source: string = 'source';
    public static element: string = 'element';
    public static sourceElement: string = 'source_element';

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