/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import { FalconItem, CompositeKey } from 'falcon-core';

import { itemTypes } from './itemTypes';

export const AppUrls : {
    element_set: string,
    record: string,
    entity: string,
    entity_type: string,
    predicate: string,
    source: string,
    source_element: string,
    element: string
} = {
    element_set: itemTypes.element_set.machineName,
    record:  itemTypes.record.machineName,
    entity:  itemTypes.entity.machineName,
    entity_type:  itemTypes.entity_type.machineName,
    predicate:  itemTypes.predicate.machineName,
    source:  itemTypes.source.machineName,
    source_element:  itemTypes.source_element.machineName,
    element: 'element'
};

export interface ApiService {
    getItem<T extends FalconItem>(obj: { new(): T; }, baseUrl : string, uid: number | CompositeKey) : PromiseLike<T>;
    getCollection<T extends FalconItem>(obj: { new(): T; }, baseUrl : string, params: any) : PromiseLike<T[]>;

    postItem<T extends FalconItem>(obj: { new(): T; }, baseUrl : string, data: T) : PromiseLike<any>;
    putItem<T extends FalconItem>(obj: { new(): T; }, baseUrl : string, uid: number | CompositeKey, data: T) : PromiseLike<any>;

    //TODO: patch item takes a subset of an objects properties. This is currently being looked at in TS in the
    //context of the 'setState' function in react
    patchItem<T extends FalconItem>(obj: { new(): T; }, baseUrl : string, uid: number | CompositeKey, data : any) : PromiseLike<any>;
    delItem<T extends FalconItem>(obj: { new(): T; }, baseUrl : string, uid: number | CompositeKey) : PromiseLike<any>;

    query(graphQLQuery: string) : PromiseLike<any>;
    getStats() : PromiseLike<any>;
}
