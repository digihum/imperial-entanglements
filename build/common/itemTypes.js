/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var falcon_core_1 = require("@digihum/falcon-core");
var simpleKey = function (raw) {
    return parseInt(raw[0]);
};
exports.itemTypes = {
    element_set: {
        machineName: 'element_set',
        name: 'Element Set',
        plural: 'Element Sets',
        workspace: '',
        buildKey: simpleKey,
        item: falcon_core_1.ElementSet
    },
    element: {
        machineName: 'element',
        name: 'Element',
        plural: 'Elements',
        workspace: '',
        buildKey: simpleKey,
        item: falcon_core_1.Element
    },
    record: {
        machineName: 'record',
        name: 'Record',
        plural: 'Records',
        workspace: '',
        buildKey: simpleKey,
        item: falcon_core_1.Record
    },
    entity: {
        machineName: 'entity',
        name: 'Entity',
        plural: 'Entities',
        workspace: 'entity',
        buildKey: simpleKey,
        item: falcon_core_1.Entity
    },
    entity_type: {
        machineName: 'entity_type',
        name: 'Entity Type',
        plural: 'Entity Types',
        workspace: 'entity_type',
        buildKey: simpleKey,
        item: falcon_core_1.EntityType
    },
    predicate: {
        machineName: 'predicate',
        name: 'Property',
        plural: 'Properties',
        workspace: 'predicate',
        buildKey: simpleKey,
        item: falcon_core_1.Predicate
    },
    source: {
        machineName: 'source',
        name: 'Source',
        plural: 'Sources',
        workspace: 'source',
        buildKey: simpleKey,
        item: falcon_core_1.Source
    },
    source_element: {
        machineName: 'source_element',
        name: 'Source Element',
        plural: 'Source Elements',
        workspace: '',
        buildKey: function (raw) { return ({
            order: ['source', 'element'],
            values: {
                source: parseInt(raw[0]),
                element: parseInt(raw[1])
            }
        }); },
        item: falcon_core_1.SourceElement
    }
};
//# sourceMappingURL=itemTypes.js.map