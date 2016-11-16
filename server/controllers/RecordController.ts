/**
 * @fileOverview Controller for element sets
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.0.1
 */

import { Database } from '../core/Database';

import { Record } from '../../common/datamodel/Record';
import { Persistable } from '../core/Persistable';
import { GenericController } from './GenericController';

import { OperationNotPermittedException } from '../core/Exceptions';

import { omit } from 'lodash';

export class RecordPersistable extends Record implements Persistable {

    public static readonly tableName: string = 'records';

    public getTableName() : string {
        return RecordPersistable.tableName;
    }

    public toSchema() {
        const schemaOutput = omit(this.serialize(),
            'value',
            'valueType',
            'creationTimestamp',
            'lastmodifiedTimestamp');

        schemaOutput.value_type = this.valueType;

        if (this.valueType !== undefined && this.valueType !== 'source') {
            schemaOutput['value_' + this.valueType] = this.value;
        }

        return Object.assign({}, schemaOutput, {
            creation_timestamp: this.creationTimestamp,
            lastmodified_timeStamp: this.lastmodifiedTimestamp
        });
    }

    public fromSchema(data: any) : RecordPersistable {

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

        this.deserialize(data);
        return this;
    }
}

export class RecordController extends GenericController<RecordPersistable> {
    constructor(db : Database) {
        super(db, RecordPersistable.tableName);
    }

    public postItem(obj: { new(): RecordPersistable; }, data: RecordPersistable) : PromiseLike<string> {

        // predicate domain must equal value_type
        return this.db.query()('predicates').select('range_type').where({ uid: data.predicate })
        .then(([predicate]) => {
            if (data.valueType === predicate.range_type) {
                //TODO: still need to check entity type constraints
                return super.postItem(obj, data);
            }
            throw new OperationNotPermittedException({
                message: 'Attempted to add a record with an incorrect type!',
                data: []
            });
        });
    }

    public putItem(obj: { new(): RecordPersistable; }, uid: number, data: RecordPersistable) : PromiseLike<string> {

        //TODO: what happens if we only update the value - and do not send the valueType again?

        return this.db.query()('predicates').select('range_type').where({ uid: data.predicate })
        .then(([predicate]) => {
            if (data.valueType === predicate.range_type) {
                //TODO: still need to check entity type constraints
                return super.putItem(obj, uid, data);
            }
            throw new OperationNotPermittedException({
                message: 'Attempted to add a record with an incorrect type!',
                data: []
            });
        });
    }

    public patchItem(obj: { new(): RecordPersistable; }, uid: number, data: RecordPersistable) : PromiseLike<boolean> {
        return this.db.query()('predicates').select('range_type').where({ uid: data.predicate })
        .then(([predicate]) => {
            if (data.valueType === predicate.range_type) {
                //TODO: still need to check entity type constraints
                return super.patchItem(obj, uid, data);
            }
            throw new OperationNotPermittedException({
                message: 'Attempted to add a record with an incorrect type!',
                data: []
            });
        });
    }
}