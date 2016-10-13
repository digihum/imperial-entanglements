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
        this.deserialize(data);
        return this;
    }
}

export class RecordController extends GenericController<RecordPersistable> {
    constructor(db : Database) {
        super(db, RecordPersistable.tableName);
    }

    //TODO: it is concivable that the first insert will succeed and the second will fail, the first
    // should be rolled back in this case.
    public postItem(obj: { new(): RecordPersistable; }, data: RecordPersistable) : Promise<string> {
        return super.postItem(obj, data)
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