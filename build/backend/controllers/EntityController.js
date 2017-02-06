/**
 * @fileOverview Controller for entities
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
const lodash_1 = require("lodash");
class EntityController extends GenericController_1.GenericController {
    constructor(db) {
        super(db, 'entities');
    }
    static fromSchema(data) {
        return Object.assign(Object.create(falcon_core_1.Entity.prototype), {
            entityType: data.type,
            uid: data.uid,
            label: data.label,
            parent: data.parent
        });
    }
    static toSchema(data) {
        const allowedKeys = new Set(['uid', 'label', 'entityType', 'parent', 'creator', 'creationTimestamp', 'lastmodifiedTimestamp']);
        const extraKeys = Object.keys(data).filter((a) => !allowedKeys.has(a));
        if (extraKeys.length > 0) {
            throw new Exceptions_1.InvalidUpdateException('Unknown keys: ' + extraKeys.join(', '));
        }
        return Object.assign(lodash_1.omit(falcon_core_1.Serializer.toJson(data), 'entityType', 'creationTimestamp', 'lastmodifiedTimestamp'), {
            type: data.entityType,
            creation_timestamp: data.creationTimestamp,
            lastmodified_timestamp: data.lastmodifiedTimestamp
        });
    }
    fromSchema(data) {
        return EntityController.fromSchema(data);
    }
    toSchema(data) {
        return EntityController.toSchema(data);
    }
    getCollectionJson(obj, params = {}) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (params.type !== undefined) {
                const ancestorTypes = yield this.db.getChildrenOf(lodash_1.isArray(params.type) ? params.type[0] : params.type, 'entity_types');
                return this.db.select('entities')
                    .whereIn('type', ancestorTypes)
                    .then((rawEntities) => rawEntities.map((entity) => this.fromSchema(entity)));
            }
            else {
                return _super("getCollectionJson").call(this, obj, params);
            }
        });
    }
    postItem(obj, data, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.createItem(this.tableName, this.toSchema(data));
            if (params.clone !== undefined) {
                const recordsToClone = yield this.db.query()('records').where({ entity: params.clone })
                    .then((records) => records.map((record) => (__assign({}, record, { entity: result[0], uid: undefined }))));
                yield this.db.query()('records').insert(recordsToClone).then(() => { });
            }
            return result;
        });
    }
    deleteItem(obj, uid) {
        return __awaiter(this, void 0, void 0, function* () {
            // check if this entity is the parent of another entity or if it has any relationships
            // pointing towards it.
            const [entities, records] = yield Promise.all([
                this.db.select(this.tableName).where('parent', '=', uid),
                this.db.select('records').where('value_entity', '=', uid)
            ]);
            if (entities.length + records.length === 0) {
                return this.db.deleteItem(this.tableName, uid);
            }
            else {
                throw new Exceptions_1.OperationNotPermittedException({
                    message: 'The operation could not be completed as the entity is referenced in other sources',
                    data: Promise.resolve({
                        entity: entities,
                        record: records
                    })
                });
            }
        });
    }
}
exports.EntityController = EntityController;
//# sourceMappingURL=EntityController.js.map