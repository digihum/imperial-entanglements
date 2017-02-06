/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var falcon_core_1 = require("@digihum/falcon-core");
exports.emptyDataStore = {
    all: {
        entity: { value: [], lastUpdate: null },
        entity_type: { value: [], lastUpdate: null },
        predicate: { value: [], lastUpdate: null },
        source: { value: [], lastUpdate: null },
        dublinCore: { value: new falcon_core_1.ElementSet(), lastUpdate: null }
    },
    records: [],
    tabs: {
        entity: {},
        entity_type: {},
        predicate: {},
        source: {}
    },
    lockedSource: null
};
//# sourceMappingURL=DataStore.js.map