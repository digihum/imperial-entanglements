/**
 * @fileOverview Controller for source elements
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
const falcon_core_1 = require("@digihum/falcon-core");
const GenericController_1 = require("./GenericController");
const Exceptions_1 = require("../../common/Exceptions");
const lodash_1 = require("lodash");
class SourceElementController extends GenericController_1.GenericController {
    constructor(db) {
        super(db, 'source_elements');
    }
    toSchema(data) {
        return Object.assign(lodash_1.omit(falcon_core_1.Serializer.toJson(data), 'creationTimestamp', 'lastmodifiedTimestamp', 'uid', 'label'), {
            creation_timestamp: data.creationTimestamp,
            lastmodified_timestamp: data.lastmodifiedTimestamp,
            // TODO: check these exist
            source: data.uid.values['source'],
            element: data.uid.values['element']
        });
    }
    fromSchema(data) {
        return Object.assign(Object.create(falcon_core_1.SourceElement.prototype), Object.assign(data, {
            uid: {
                order: ['source', 'element'],
                values: {
                    source: data.source,
                    element: data.element
                }
            }
        }));
    }
    getItemJson(obj, uid) {
        return this.db.query().select()
            .from(this.tableName)
            .where(uid.values)
            .first()
            .then((result) => result === undefined ? Promise.reject(new Exceptions_1.KeyNotFoundException()) : result)
            .then((data) => this.fromSchema(data));
    }
    putItem(obj, uid, data) {
        return this.db.query()(this.tableName)
            .where(uid.values)
            .update(this.toSchema(data));
    }
    patchItem(obj, uid, data) {
        const schemaData = this.toSchema(data);
        const keys = Object.keys(schemaData);
        const updateObject = {};
        for (let i = 0; i < keys.length; i += 1) {
            if (schemaData[keys[i]] !== undefined) {
                updateObject[keys[i]] = schemaData[keys[i]];
            }
        }
        return this.db.query()(this.tableName)
            .where(uid.values)
            .update(updateObject)
            .then(() => true)
            .catch((err) => { throw new Error(err); });
    }
    deleteItem(obj, uid) {
        return this.db.query()(this.tableName)
            .where(uid.values)
            .del();
    }
}
exports.SourceElementController = SourceElementController;
//# sourceMappingURL=SourceElementController.js.map