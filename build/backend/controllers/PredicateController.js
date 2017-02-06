/**
 * @fileOverview Controller for predicates
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const falcon_core_1 = require("@digihum/falcon-core");
const GenericController_1 = require("./GenericController");
const Exceptions_1 = require("../../common/Exceptions");
const RecordController_1 = require("./RecordController");
const lodash_1 = require("lodash");
class PredicateController extends GenericController_1.GenericController {
    constructor(db) {
        super(db, 'predicates', 'predicate_complete');
    }
    static toSchema(data) {
        const allowedKeys = new Set(['uid', 'uses', 'label', 'domain', 'range',
            'description', 'rangeIsReference', 'sameAs', 'creator', 'creationTimestamp', 'lastmodifiedTimestamp']);
        const extraKeys = Object.keys(data).filter((a) => !allowedKeys.has(a));
        if (extraKeys.length > 0) {
            throw new Exceptions_1.InvalidUpdateException('Unknown keys: ' + extraKeys.join(', '));
        }
        const out = Object.assign(lodash_1.omit(falcon_core_1.Serializer.toJson(data), 'range', 'rangeIsReference', 'sameAs', 'creationTimestamp', 'lastmodifiedTimestamp', 'uses'), {
            same_as: data.sameAs,
            range_type: data.rangeIsReference ? 'entity' : data.range,
            creation_timestamp: data.creationTimestamp,
            lastmodified_timestamp: data.lastmodifiedTimestamp
        });
        if (data.rangeIsReference) {
            out['range_ref'] = data.range;
        }
        else {
            out['range_ref'] = null;
        }
        return out;
    }
    static fromSchema(data) {
        if (data.range_type === 'entity') {
            data.range = data.range_ref;
            data.rangeIsReference = true;
        }
        else {
            data.range = data.range_type;
            data.rangeIsReference = false;
        }
        if (data.uses === null) {
            data.uses = 0;
        }
        return Object.assign(Object.create(falcon_core_1.Predicate.prototype), {
            'uid': data.uid,
            'sameAs': data.same_as,
            'label': data.label,
            'lastmodifiedTimestamp': data.lastmodified_timestamp,
            'creationTimestamp': data.creation_timestamp,
            'rangeIsReference': data.rangeIsReference,
            'range': data.range,
            'domain': data.domain,
            'uses': data.uses,
            'description': data.description
        });
    }
    toSchema(data) {
        return PredicateController.toSchema(data);
    }
    fromSchema(data) {
        return PredicateController.fromSchema(data);
    }
    getCollectionJson(obj, params = {}) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (params.domain !== undefined) {
                //TODO: this check should be unecessery
                const ancestorIds = yield this.db.getAncestorsOf(lodash_1.isArray(params.domain) ? params.domain[0] : params.domain, 'entity_types');
                return this.db.select(this.readTableName).whereIn('domain', ancestorIds.concat([params.domain[0]]))
                    .then((results) => results.map((result) => this.fromSchema(result)));
            }
            else {
                return _super("getCollectionJson").call(this, obj, params);
            }
        });
    }
    putItem(obj, uid, data) {
        if (typeof (uid) !== 'number') {
            throw new Error('Expected single column identifier');
        }
        return this.db.updateItem(this.tableName, falcon_core_1.Serializer.toJson(data));
    }
    // public patchItem(obj: { new(): Predicate; }, uid: number, data: Predicate) : Promise<boolean> {
    //     if (data.domain !== undefined) {
    //         return this.db.select('records', ['entities.type as entityType'])
    //             .distinct()
    //             .where({ predicate: uid })
    //             .innerJoin('entities', 'records.entity', 'entities.uid')
    //         .then((records) => {
    //             if (records.length > 0) {
    //                 return this.db.getChildrenOf(data.domain, 'entity_types')
    //                 .then((res) => {
    //                     records.map((e) => e.entityType)
    //                     .forEach((e) => {
    //                         if (res.indexOf(e) === -1) {
    //                             throw new OperationNotPermittedException({
    //                                 message: 'The operation could not be completed as it would invalidate predicate relationships',
    //                                 data: Promise.resolve({})
    //                             });
    //                         }
    //                     });
    //                 }).then(() => super.patchItem(obj, uid, data));
    //             }
    //             return super.patchItem(obj, uid, data);
    //         });
    //     }
    //     //TODO: fix range enforcement
    //     if (data.range !== undefined) {
    //         return this.db.select('records')
    //             .where({ predicate: uid })
    //         .then((records) => {
    //             if (records.length > 0) {
    //                 if (data.rangeIsReference === false) {
    //                     throw new OperationNotPermittedException({
    //                         message: 'The operation could not be completed as it would invalidate predicate relationships',
    //                         data: Promise.resolve({})
    //                     });
    //                 }
    //                 return this.db.getChildrenOf(parseInt(data.range as string), 'entity_types')
    //                 .then((res) => {
    //                     records.map((e) => e.value_entity)
    //                     .forEach((e) => {
    //                         if (res.indexOf(e) === -1) {
    //                             throw new OperationNotPermittedException({
    //                                 message: 'The operation could not be completed as it would invalidate predicate relationships',
    //                                 data: Promise.resolve({})
    //                             });
    //                         }
    //                     });
    //                 }).then(() => super.patchItem(obj, uid, data));
    //             }
    //             return super.patchItem(obj, uid, data);
    //         });
    //     }
    //     return super.patchItem(obj, uid, data);
    // }
    deleteItem(obj, uid) {
        return __awaiter(this, void 0, void 0, function* () {
            // check if this entity is the parent of another entity or if it has any relationships
            // pointing towards it.
            const records = yield this.db.loadCollection('records', { predicate: uid });
            if (records.length === 0) {
                return this.db.deleteItem(this.tableName, uid);
            }
            else {
                throw new Exceptions_1.OperationNotPermittedException({
                    message: 'The operation could not be completed as the predicate is used by other records',
                    data: Promise.resolve({
                        record: records.map((record) => RecordController_1.RecordController.fromSchema(record))
                    })
                });
            }
        });
    }
}
exports.PredicateController = PredicateController;
//# sourceMappingURL=PredicateController.js.map