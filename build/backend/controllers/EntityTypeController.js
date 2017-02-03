/**
 * @fileOverview Controller for entity types
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
const PredicateController_1 = require("./PredicateController");
const EntityController_1 = require("./EntityController");
const Exceptions_1 = require("../../common/Exceptions");
const lodash_1 = require("lodash");
class EntityTypeController extends GenericController_1.GenericController {
    constructor(db) {
        super(db, 'entity_types');
    }
    toSchema(data) {
        return Object.assign(lodash_1.omit(falcon_core_1.Serializer.toJson(data), 'sameAs', 'parents', 'children', 'creationTimestamp', 'lastmodifiedTimestamp'), {
            same_as: data.sameAs,
            creation_timestamp: data.creationTimestamp,
            lastmodified_timestamp: data.lastmodifiedTimestamp
        });
    }
    fromSchema(data) {
        return Object.assign(Object.create(falcon_core_1.EntityType.prototype), Object.assign(data, {
            'sameAs': data.same_as
        }));
    }
    getItemJson(obj, uid) {
        return super.getItemJson(obj, uid)
            .then((result) => {
            return Promise.all([
                this.db.getAncestorsOf(uid, 'entity_types'),
                this.db.select('entity_types', ['uid']).where({ parent: uid })
            ])
                .then(([parents, children]) => {
                result.parents = parents;
                result.children = children.map((child) => child.uid);
                return result;
            });
        });
    }
    deleteItem(obj, uid) {
        return __awaiter(this, void 0, void 0, function* () {
            // check if this entity is the parent of another entity or if it has any relationships
            // pointing towards it.
            const [entityTypes, entities, predicates] = yield Promise.all([
                this.db.select(this.tableName).where('parent', '=', uid),
                this.db.select('entities').where('type', '=', uid),
                this.db.select('predicates').where('domain', '=', uid).orWhere('range_ref', '=', uid)
            ]);
            if (entities.length + entityTypes.length + predicates.length === 0) {
                return this.db.deleteItem(this.tableName, uid);
            }
            else {
                throw new Exceptions_1.OperationNotPermittedException({
                    message: 'The operation could not be completed as the entity is referenced in other sources',
                    data: Promise.resolve({
                        entityType: entityTypes.map((entityType) => EntityController_1.EntityController.fromSchema(entityType)),
                        entity: entities.map((entity) => EntityController_1.EntityController.fromSchema(entity)),
                        predicate: predicates.map((predicate) => PredicateController_1.PredicateController.fromSchema(predicate))
                    })
                });
            }
        });
    }
}
exports.EntityTypeController = EntityTypeController;
//# sourceMappingURL=EntityTypeController.js.map