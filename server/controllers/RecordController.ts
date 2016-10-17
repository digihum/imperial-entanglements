/**
 * @fileOverview Controller for element sets
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.0.1
 */

import { Database } from '../core/Database';

import { Record } from '../../common/datamodel/Record';
import { Persistable } from '../core/Persistable';
import { GenericController } from './GenericController';

import { omit } from 'lodash';

export class RecordPersistable extends Record implements Persistable {

    public static readonly tableName: string = 'records';

    public getTableName() : string {
        return RecordPersistable.tableName;
    }

    public toSchema() {
        return omit(this.serialize(), 'value', 'valueType');
    }

    public fromSchema(data: any) : RecordPersistable {

        if (data.entity !== null) {
            data.valueType = 'entity';
            data.value = data.entity;
        }

        if (data.string !== null) {
            data.valueType = 'string';
            data.value = data.string;
        }

        if (data.date !== null) {
            data.valueType = 'date';
            data.value = data.date;
        }

        if (data.integer !== null) {
            data.valueType = 'integer';
            data.value = data.integer;
        }

        if (data.spatial_point !== null) {
            data.valueType = 'spatial_point';
            data.value = data.spatial_point;
        }

        this.deserialize(data);
        return this;
    }
}

export class RecordController extends GenericController<RecordPersistable> {
    constructor(db : Database) {
        super(db, RecordPersistable.tableName);
    }

    public getItemJson(obj: { new(): RecordPersistable; }, uid: number) : Promise<RecordPersistable> {

        const fields = [
            'records.*',
            'records_entity.reference as entity',
            'records_string.value as string',
            'records_date.value as date',
            'records_integer.value as integer',
            'records_spatial_point.value as spatial_point'
            ];

        const query = this.db.query().select(fields)
            .from(this.tableName)
            .debug(true)
            .leftJoin('records_entity', 'records.uid', '=', 'records_entity.uid')
            .leftJoin('records_string', 'records.uid', '=', 'records_string.uid')
            .leftJoin('records_date', 'records.uid', '=', 'records_date.uid')
            .leftJoin('records_integer', 'records.uid', '=', 'records_integer.uid')
            .leftJoin('records_spatial_point', 'records.uid', '=', 'records_spatial_point.uid')
            .where({ 'records.uid': uid })
            .first();

        return query.then((data) => new obj().fromSchema(data));
    }

    //TODO: it is concivable that the first insert will succeed and the second will fail, the first
    // should be rolled back in this case.
    public postItem(obj: { new(): RecordPersistable; }, data: RecordPersistable) : Promise<string> {
        return super.postItem(obj, data);
        // .then(([id]) => {
        //     if (data.rangeIsReference) {
        //         return this.db.query().insert({ uid: id, range: data.range}).into('predicates_ref')
        //         .then(() => id);
        //     } else {
        //         return this.db.query().insert({ uid: id, range: data.range}).into('predicates_val')
        //         .then(() => id);
        //     }
        // });
    }
}