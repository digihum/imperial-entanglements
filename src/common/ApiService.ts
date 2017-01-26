/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

import { TrackedFalconItem, CompositeKey } from '@digihum/falcon-core';

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
    getItem<T extends TrackedFalconItem>(obj: { new(): T; }, baseUrl : string, uid: number | CompositeKey) : Promise<T>;
    getCollection<T extends TrackedFalconItem>(obj: { new(): T; }, baseUrl : string, params: any) : Promise<T[]>;

    postItem<T extends TrackedFalconItem>(obj: { new(): T; }, baseUrl : string, data: T, params: any) : Promise<number[]>;
    putItem<T extends TrackedFalconItem>(obj: { new(): T; }, baseUrl : string, uid: number | CompositeKey, data: T) : Promise<void>;

    //TODO: patch item takes a subset of an objects properties. This is currently being looked at in TS in the
    //context of the 'setState' function in react
    patchItem<T extends TrackedFalconItem>(obj: { new(): T; }, baseUrl : string, uid: number | CompositeKey, data : any) : Promise<void>;
    delItem<T extends TrackedFalconItem>(obj: { new(): T; }, baseUrl : string, uid: number | CompositeKey) : Promise<void>;

    query(graphQLQuery: string) : Promise<any>;
    getStats() : Promise<any>;
}
