"use strict";
/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
const itemTypes_1 = require("../../common/itemTypes");
const ServerApiService_1 = require("../ServerApiService");
const QueryEngine_1 = require("../QueryEngine");
const controllers_1 = require("../../backend/controllers/controllers");
exports.wrapDatabase = (db, fakeCreator) => {
    const routes = new Map([
        [itemTypes_1.itemTypes.element_set.machineName, new controllers_1.ElementSetController(db)],
        [itemTypes_1.itemTypes.record.machineName, new controllers_1.RecordController(db)],
        [itemTypes_1.itemTypes.entity_type.machineName, new controllers_1.EntityTypeController(db)],
        [itemTypes_1.itemTypes.entity.machineName, new controllers_1.EntityController(db)],
        [itemTypes_1.itemTypes.predicate.machineName, new controllers_1.PredicateController(db)],
        [itemTypes_1.itemTypes.source.machineName, new controllers_1.SourceController(db)],
        [itemTypes_1.itemTypes.element.machineName, new controllers_1.ElementController(db)],
        [itemTypes_1.itemTypes.source_element.machineName, new controllers_1.SourceElementController(db)]
    ]);
    return new ServerApiService_1.ServerApiService(db, routes, new QueryEngine_1.QueryEngine(db), fakeCreator);
};
//# sourceMappingURL=wrapDatabase.js.map