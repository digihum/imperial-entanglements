/**
 * @fileOverview Controller for element sets
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.0.1
 */

import { Database } from '../core/Database';

import { Record, Serializer } from 'falcon-core';
import { GenericController } from './GenericController';

import { OperationNotPermittedException } from '../core/Exceptions';

import { omit } from 'lodash';

export class RecordController extends GenericController<Record> {

    constructor(db : Database) {
        super(db, 'records');
    }

    public static toSchema(data: Record) {
        const schemaOutput = omit(Serializer.toJson(data),
            'value',
            'valueType',
            'creationTimestamp',
            'lastmodifiedTimestamp');

        schemaOutput.value_type = data.valueType;

        if (data.valueType !== undefined && data.valueType !== 'source') {
            schemaOutput['value_' + data.valueType] = data.value;
        }

        return Object.assign({}, schemaOutput, {
            creation_timestamp: data.creationTimestamp,
            lastmodified_timeStamp: data.lastmodifiedTimestamp
        });
    }

    public static fromSchema(data: any) : Record {

        data.valueType = data.value_type;

        switch (data.value_type) {
            case 'entity':
                data.value = data.value_entity;
                break;
            case 'string':
                data.value = data.value_string;
                break;
            case 'date':
                data.value = data.value_date;
                break;
            case 'integer':
                data.value = data.value_integer;
                break;
            case 'point':
                data.value = data.value_point;
                break;
            case 'region':
                data.value = data.value_region;
                break;
            case 'source':
                data.value = data.source;
                break;
            default:
                data.value = null;
        }

        return Object.assign(Object.create(Record.prototype), data);
    }

    protected toSchema(data: Record) {
      return RecordController.toSchema(data);
    }

    protected fromSchema(data: any) {
      return RecordController.fromSchema(data);
    }

    public postItem(obj: { new(): Record; }, data: Record) : PromiseLike<string> {

        // predicate domain must equal value_type
        return this.db.select('predicates', ['range_type']).where({ uid: data.predicate })
        .then(([predicate]) => {
            if (data.valueType === predicate.range_type) {
                //TODO: still need to check entity type constraints
                return super.postItem(obj, data);
            }
            throw new OperationNotPermittedException({
                message: 'Attempted to add a record with an incorrect type!',
                data: Promise.resolve({})
            });
        });
    }

    public putItem(obj: { new(): Record; }, uid: number, data: Record) : PromiseLike<string> {

        //TODO: what happens if we only update the value - and do not send the valueType again?

        return this.db.select('predicates', ['range_type']).where({ uid: data.predicate })
        .then(([predicate]) => {
            if (data.valueType === predicate.range_type) {
                //TODO: still need to check entity type constraints
                return super.putItem(obj, uid, data);
            }
            throw new OperationNotPermittedException({
                message: 'Attempted to add a record with an incorrect type!',
                data: Promise.resolve({})
            });
        });
    }

    public patchItem(obj: { new(): Record; }, uid: number, data: Record) : PromiseLike<boolean> {
        return this.db.select('predicates', ['range_type']).where({ uid: data.predicate })
        .then(([predicate]) => {
            if (data.valueType === predicate.range_type) {
                //TODO: still need to check entity type constraints
                return super.patchItem(obj, uid, data);
            }
            throw new OperationNotPermittedException({
                message: 'Attempted to add a record with an incorrect type!',
                data: Promise.resolve({})
            });
        });
    }
}
