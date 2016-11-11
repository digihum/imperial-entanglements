/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import { Serializable, CompositeKey } from './datamodel/Serializable';

export const AppUrls : {
    element_set: string,
    record: string,
    entity: string,
    entity_type: string,
    predicate: string,
    source: string,
    element: string,
    source_element: string
} = {
    element_set: 'element_set',
    record: 'record',
    entity: 'entity',
    entity_type: 'entity_type',
    predicate: 'property',
    source: 'source',
    element: 'element',
    source_element: 'source_element'
};

export interface ApiService {
    getItem<T extends Serializable>(obj: { new(): T; }, baseUrl : string, uid: number | CompositeKey) : PromiseLike<T>;
    getCollection<T extends Serializable>(obj: { new(): T; }, baseUrl : string, params: any) : PromiseLike<T[]>;

    postItem<T extends Serializable>(obj: { new(): T; }, baseUrl : string, data: T) : PromiseLike<boolean>;
    putItem<T extends Serializable>(obj: { new(): T; }, baseUrl : string, uid: number | CompositeKey, data: T) : PromiseLike<boolean>;

    //TODO: patch item takes a subset of an objects properties. This is currently being looked at in TS in the 
    //context of the 'setState' function in react
    patchItem<T extends Serializable>(obj: { new(): T; }, baseUrl : string, uid: number | CompositeKey, data : any) : PromiseLike<boolean>;
    delItem<T extends Serializable>(obj: { new(): T; }, baseUrl : string, uid: number | CompositeKey) : PromiseLike<boolean>;

    query(graphQLQuery: string) : PromiseLike<any>;
} 