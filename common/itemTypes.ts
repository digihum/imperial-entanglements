/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

interface ItemDescription {
    machineName: string;
    name: string;
    plural: string;
    workspace: string;
}

interface ItemTypes {
    element_set: ItemDescription;
    record: ItemDescription;
    entity: ItemDescription;
    entity_type: ItemDescription;
    predicate: ItemDescription;
    source: ItemDescription;
    source_element: ItemDescription;
}

export const itemTypes : ItemTypes = {

    element_set: {
        machineName: 'element_set',
        name: 'Element Set',
        plural: 'Element Sets',
        workspace: ''
    },

    record: {
        machineName: 'record',
        name: 'Record',
        plural: 'Records',
        workspace: ''
    },

    entity:  {
        machineName: 'entity',
        name: 'Entity',
        plural: 'Entities',
        workspace: 'entity'
    },

    entity_type: {
        machineName: 'entity_type',
        name: 'Entity Type',
        plural: 'Entity Types',
        workspace: 'entity_type'
    },

    predicate: {
        machineName: 'property',
        name: 'Property',
        plural: 'Properties',
        workspace: 'predicate'
    },

    source: {
        machineName: 'source',
        name: 'Source',
        plural: 'Sources',
        workspace: 'source'
    },

    source_element: {
        machineName: 'source_element',
        name: 'Source Element',
        plural: 'Source Elements',
        workspace: ''
    }
};