/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

import { CompositeKey, FalconItem, ElementSet, Record, Entity, EntityType, Predicate, Source, SourceElement, Element } from 'falcon-core';

interface ItemDescription {
    machineName: string;
    name: string;
    plural: string;
    workspace: string;
    buildKey: (raw: string[]) => number | CompositeKey;
    item: (new() => FalconItem);
}

interface ItemTypes {
    element_set: ItemDescription;
    element: ItemDescription;
    record: ItemDescription;
    entity: ItemDescription;
    entity_type: ItemDescription;
    predicate: ItemDescription;
    source: ItemDescription;
    source_element: ItemDescription;
}

const simpleKey = (raw: string[]) => {
  return parseInt(raw[0]);
};

export const itemTypes : ItemTypes = {

    element_set: {
        machineName: 'element_set',
        name: 'Element Set',
        plural: 'Element Sets',
        workspace: '',
        buildKey: simpleKey,
        item: ElementSet
    },

    element: {
        machineName: 'element',
        name: 'Element',
        plural: 'Elements',
        workspace: '',
        buildKey: simpleKey,
        item: Element
    },

    record: {
        machineName: 'record',
        name: 'Record',
        plural: 'Records',
        workspace: '',
        buildKey: simpleKey,
        item: Record
    },

    entity:  {
        machineName: 'entity',
        name: 'Entity',
        plural: 'Entities',
        workspace: 'entity',
        buildKey: simpleKey,
        item: Entity
    },

    entity_type: {
        machineName: 'entity_type',
        name: 'Entity Type',
        plural: 'Entity Types',
        workspace: 'entity_type',
        buildKey: simpleKey,
        item: EntityType
    },

    predicate: {
        machineName: 'predicate',
        name: 'Property',
        plural: 'Properties',
        workspace: 'predicate',
        buildKey: simpleKey,
        item: Predicate
    },

    source: {
        machineName: 'source',
        name: 'Source',
        plural: 'Sources',
        workspace: 'source',
        buildKey: simpleKey,
        item: Source
    },

    source_element: {
        machineName: 'source_element',
        name: 'Source Element',
        plural: 'Source Elements',
        workspace: '',
        buildKey: (raw: string[]) => ({
            order: ['source', 'element'],
            values: {
                source: parseInt(raw[0]),
                element: parseInt(raw[1])
            }
        }),
        item: SourceElement
    }
};
