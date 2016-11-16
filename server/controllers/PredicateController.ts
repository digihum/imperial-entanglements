/**
 * @fileOverview Controller for element sets
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.0.1
 */

import { Database } from '../core/Database';

import { Predicate } from '../../common/datamodel/Predicate';
import { Persistable } from '../core/Persistable';
import { GenericController } from './GenericController';

import { OperationNotPermittedException } from '../core/Exceptions';

import { RecordPersistable } from './RecordController';

import { omit } from 'lodash';

export class PredicatePersistable extends Predicate implements Persistable {

    public static readonly tableName: string = 'predicates';

    public getTableName() : string {
        return PredicatePersistable.tableName;
    }

    public toSchema() {
        const out : { [s: string] : any } = Object.assign(omit(this.serialize(),
            'range',
            'rangeIsReference',
            'sameAs',
            'creationTimestamp',
            'lastmodifiedTimestamp'
        ), {
            same_as: this.sameAs,
            range_type: this.rangeIsReference ? 'entity' : this.range,
            creation_timestamp: this.creationTimestamp,
            lastmodified_timeStamp: this.lastmodifiedTimestamp
        });

        if (this.rangeIsReference) {
            out['range_ref'] = this.range;
        } else {
            out['range_ref'] = null;
        }

        return out;
    }

    public fromSchema(data: any) : PredicatePersistable {
        if (data.range_type === 'entity') {
            data.range = data.range_ref;
            data.rangeIsReference = true;
        } else {
            data.range = data.range_type;
            data.rangeIsReference = false;
        }
        this.deserialize(Object.assign(data, {
            'sameAs': data.same_as
        }));
        return this;
    }
}

export class PredicateController extends GenericController<PredicatePersistable> {

    constructor(db : Database) {
        super(db, PredicatePersistable.tableName);
    }

    public getCollectionJson(obj: { new(): PredicatePersistable; }, params: any = {}) : PromiseLike<PredicatePersistable[]>  {
        if (params.domain !== undefined) {
            return this.db.getAncestorsOf(params.domain[0], 'entity_types')
            .then((ancestors) => {
                return this.db.select('predicates').whereIn('domain', ancestors.concat([params.domain[0]]))
                .then((results) => results.map((result) => new obj().fromSchema(result)));
            });
        } else {
            return super.getCollectionJson(obj, params);
        }
    }

    public putItem(obj: { new(): PredicatePersistable; }, uid: number, data: PredicatePersistable) : PromiseLike<string> {

        if (typeof(uid) !== 'number') {
            throw new Error('Expected single column identifier');
        }

        return this.db.updateItem(new obj().deserialize(data));
    }

    public patchItem(obj: { new(): PredicatePersistable; }, uid: number, data: PredicatePersistable) : PromiseLike<boolean> {

        if (data.domain !== undefined) {
            return this.db.select('records', ['entities.type as entityType'])
                .distinct()
                .where({ predicate: uid })
                .innerJoin('entities', 'records.entity', 'entities.uid')
            .then((records) => {

                if (records.length > 0) {

                    return this.db.getChildrenOf(data.domain, 'entity_types')
                    .then((res) => {
                        records.map((e) => e.entityType)
                        .forEach((e) => {
                            if (res.indexOf(e) === -1) {
                                throw new OperationNotPermittedException({
                                    message: 'The operation could not be completed as it would invalidate predicate relationships',
                                    data: {
                                    }
                                });
                            }
                        });
                    }).then(() => super.patchItem(obj, uid, data));
                }

                return super.patchItem(obj, uid, data);
            });
        }

        //TODO: fix range enforcement
        if (data.range !== undefined) {

            return this.db.select('records')
                .where({ predicate: uid })
            .then((records) => {

                if (records.length > 0) {

                    if (data.rangeIsReference === false) {
                        throw new OperationNotPermittedException({
                            message: 'The operation could not be completed as it would invalidate predicate relationships',
                            data: {}
                        });
                    }

                    return this.db.getChildrenOf(data.range, 'entity_types')
                    .then((res) => {
                        records.map((e) => e.value_entity)
                        .forEach((e) => {
                            if (res.indexOf(e) === -1) {
                                throw new OperationNotPermittedException({
                                    message: 'The operation could not be completed as it would invalidate predicate relationships',
                                    data: {
                                    }
                                });
                            }
                        });
                    }).then(() => super.patchItem(obj, uid, data));
                }

                return super.patchItem(obj, uid, data);
            });
        }

        return super.patchItem(obj, uid, data);
    }

     public deleteItem(obj: { new(): PredicatePersistable; }, uid: number) : PromiseLike<string> {
        // check if this entity is the parent of another entity or if it has any relationships
        // pointing towards it.
        return Promise.all([
            this.db.loadCollection('records', { predicate: uid})
        ]).then(([records]) => {
            if (records.length === 0) {
                return this.db.deleteItem(this.tableName, uid);
            } else {
                throw new OperationNotPermittedException({
                    message: 'The operation could not be completed as the predicate is used by other records',
                    data: {
                        record: records.map((record) => new RecordPersistable().fromSchema(record))
                    }
                });
            }
        });
    }
}