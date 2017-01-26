/**
 * @fileOverview Controller for predicates
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.2.0
 */

import { Database } from '../data/Database';

import { Predicate, Serializer } from 'falcon-core';

import { GenericController } from './GenericController';

import { OperationNotPermittedException, InvalidUpdateException } from '../../common/Exceptions';

import { RecordController } from './RecordController';

import { omit, isArray } from 'lodash';

export class PredicateController extends GenericController<Predicate> {

    constructor(db : Database) {
        super(db, 'predicates', 'predicate_complete');
    }

    public static toSchema(data: Predicate) {

        const allowedKeys = new Set(['uid', 'uses', 'label', 'domain', 'range',
          'description', 'rangeIsReference', 'sameAs', 'creator', 'creationTimestamp', 'lastmodifiedTimestamp']);

        const extraKeys = Object.keys(data).filter((a) => !allowedKeys.has(a));

        if (extraKeys.length > 0) {
          throw new InvalidUpdateException('Unknown keys: ' + extraKeys.join(', '));
        }

        const out : { [s: string] : any } = Object.assign(omit(Serializer.toJson(data),
            'range',
            'rangeIsReference',
            'sameAs',
            'creationTimestamp',
            'lastmodifiedTimestamp',
            'uses'
        ), {
            same_as: data.sameAs,
            range_type: data.rangeIsReference ? 'entity' : data.range,
            creation_timestamp: data.creationTimestamp,
            lastmodified_timestamp: data.lastmodifiedTimestamp
        });

        if (data.rangeIsReference) {
            out['range_ref'] = data.range;
        } else {
            out['range_ref'] = null;
        }

        return out;
    }

    public static fromSchema(data: any) : Predicate {
        if (data.range_type === 'entity') {
            data.range = data.range_ref;
            data.rangeIsReference = true;
        } else {
            data.range = data.range_type;
            data.rangeIsReference = false;
        }

        if (data.uses === null) {
          data.uses = 0;
        }

        return Object.assign(Object.create(Predicate.prototype),

         {
           'uid': data.uid,
            'sameAs': data.same_as,
            'label': data.label,
            'lastmodifiedTimestamp': data.lastmodified_timestamp,
            'creationTimestamp': data.creation_timestamp,
            'rangeIsReference': data.rangeIsReference,
            'range': data.range,
            'domain': data.domain,
            'uses': data.uses

        });
    }


    protected toSchema(data: Predicate) {
        return PredicateController.toSchema(data);
    }

    protected fromSchema(data: any) : Predicate {
        return PredicateController.fromSchema(data);
    }

    public async getCollectionJson(obj: { new(): Predicate; }, params: any = {}) : Promise<Predicate[]>  {
        if (params.domain !== undefined) {
            //TODO: this check should be unecessery
            const ancestorIds = await this.db.getAncestorsOf(isArray(params.domain) ? params.domain[0] : params.domain, 'entity_types');

            return this.db.select(this.readTableName).whereIn('domain', ancestorIds.concat([params.domain[0]]))
              .then((results) => results.map((result) => this.fromSchema(result)));

        } else {
            return super.getCollectionJson(obj, params);
        }
    }

    public putItem(obj: { new(): Predicate; }, uid: number, data: Predicate) : Promise<string> {

        if (typeof(uid) !== 'number') {
            throw new Error('Expected single column identifier');
        }

        return this.db.updateItem(this.tableName, Serializer.toJson(data));
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

     public async deleteItem(obj: { new(): Predicate; }, uid: number) : Promise<string> {
        // check if this entity is the parent of another entity or if it has any relationships
        // pointing towards it.

        const records = await this.db.loadCollection('records', { predicate: uid });

        if (records.length === 0) {
            return this.db.deleteItem(this.tableName, uid);
        } else {
            throw new OperationNotPermittedException({
                message: 'The operation could not be completed as the predicate is used by other records',
                data: Promise.resolve({
                    record: records.map((record) => RecordController.fromSchema(record))
                })
            });
        }
    }
}
