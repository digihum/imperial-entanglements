/**
 * @fileOverview Controller for element sets
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.0.1
 */

import { Database } from '../core/Database';

import { EntityType } from '../../common/datamodel/EntityType';
import { Persistable } from '../core/Persistable';
import { GenericController } from './GenericController';

import { PredicatePersistable } from './PredicateController';

import { EntityPersistable } from './EntityController';

import { OperationNotPermittedException } from '../core/Exceptions';

import { omit } from 'lodash';

export class EntityTypePersistable extends EntityType implements Persistable {

    public static readonly tableName: string = 'entity_types';

    public getTableName() : string {
        return EntityTypePersistable.tableName;
    }

    public toSchema() {
        return Object.assign(omit(this.serialize(),
                'sameAs',
                'parents',
                'children',
                'creationTimestamp',
                'lastmodifiedTimestamp'), {
            same_as: this.sameAs,
            creation_timestamp: this.creationTimestamp,
            lastmodified_timeStamp: this.lastmodifiedTimestamp
        });
    }

    public fromSchema(data: any) : EntityTypePersistable {
        this.deserialize(Object.assign(data, {
            'sameAs': data.same_as
        }));
        return this;
    }
}

export class EntityTypeController extends GenericController<EntityTypePersistable> {
    constructor(db : Database) {
        super(db, EntityTypePersistable.tableName);
    }

    public getItemJson(obj: { new(): EntityTypePersistable; }, uid: number) : PromiseLike<EntityTypePersistable> {
        return super.getItemJson(obj, uid)
        .then((result) => {
            return Promise.all([

                this.db.getAncestorsOf(uid, 'entity_types')
                .then((ancestors) => {
                    return this.db.select('entity_types').whereIn('uid', ancestors)
                    .then((results) => results.map((result) => new obj().fromSchema(result)));
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

    public deleteItem(obj: { new(): EntityTypePersistable; }, uid: number) : Promise<string> {
        // check if this entity is the parent of another entity or if it has any relationships
        // pointing towards it.
        return Promise.all([
            this.db.select(EntityTypePersistable.tableName).where('parent', '=', uid),
            this.db.select('entities').where('type', '=', uid),
            this.db.select('predicates').where('domain', '=', uid).orWhere('range_ref', '=', uid)
        ]).then(([entityTypes, entities, predicates]) => {
            if (entities.length + entityTypes.length + predicates.length === 0) {
                return this.db.deleteItem(this.tableName, uid);
            } else {
                throw new OperationNotPermittedException({
                    message: 'The operation could not be completed as the entity is referenced in other sources',
                    data: {
                        entityType: entityTypes.map((entityType) => new EntityTypePersistable().fromSchema(entityType)),
                        entity: entities.map((entity) => new EntityPersistable().fromSchema(entity)),
                        predicate: predicates.map((predicate) => new PredicatePersistable().fromSchema(predicate))
                    }
                });
            }
        });
    }
}