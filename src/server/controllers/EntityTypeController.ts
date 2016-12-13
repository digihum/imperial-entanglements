/**
 * @fileOverview Controller for element sets
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.0.1
 */

import { Database } from '../core/Database';

import { EntityType, Serializer } from 'falcon-core';
import { GenericController } from './GenericController';

import { PredicateController } from './PredicateController';

import { EntityController } from './EntityController';

import { OperationNotPermittedException } from '../core/Exceptions';

import { omit } from 'lodash';

export class EntityTypeController extends GenericController<EntityType> {

    constructor(db : Database) {
        super(db, 'entity_types');
    }

    public toSchema(data: EntityType) {
        return Object.assign(omit(Serializer.toJson(data),
                'sameAs',
                'parents',
                'children',
                'creationTimestamp',
                'lastmodifiedTimestamp'), {
            same_as: data.sameAs,
            creation_timestamp: data.creationTimestamp,
            lastmodified_timeStamp: data.lastmodifiedTimestamp
        });
    }

    public fromSchema(data: any) : EntityType {
        return Object.assign(Object.create(EntityType.prototype), Object.assign(data, {
            'sameAs': data.same_as
        }));
    }

    public getItemJson(obj: { new(): EntityType; }, uid: number) : Promise<EntityType> {
        return super.getItemJson(obj, uid)
        .then((result) => {
            return Promise.all([

                this.db.getAncestorsOf(uid, 'entity_types')
                .then((ancestors) => {
                    return this.db.select('entity_types').whereIn('uid', ancestors)
                    .then((results) => results.map((result) => this.fromSchema(result)));
                }),

                this.db.select('entity_types', ['uid']).where({ parent: uid })
            ])
            .then(([parents, children]) => {
                result.parents = parents;
                result.children = children.map((child) => child.uid);
                return result;
            });
        });
    }

    public deleteItem(obj: { new(): EntityType; }, uid: number) : Promise<string> {
        // check if this entity is the parent of another entity or if it has any relationships
        // pointing towards it.
        return Promise.all([
            this.db.select(this.tableName).where('parent', '=', uid),
            this.db.select('entities').where('type', '=', uid),
            this.db.select('predicates').where('domain', '=', uid).orWhere('range_ref', '=', uid)
        ]).then(([entityTypes, entities, predicates]) => {
            if (entities.length + entityTypes.length + predicates.length === 0) {
                return this.db.deleteItem(this.tableName, uid);
            } else {
                throw new OperationNotPermittedException({
                    message: 'The operation could not be completed as the entity is referenced in other sources',
                    data: Promise.resolve({
                        entityType: entityTypes.map((entityType) => EntityController.fromSchema(entityType)),
                        entity: entities.map((entity) => EntityController.fromSchema(entity)),
                        predicate: predicates.map((predicate) => PredicateController.fromSchema(predicate))
                    })
                });
            }
        });
    }
}
