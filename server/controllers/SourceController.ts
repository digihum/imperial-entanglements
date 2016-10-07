/**
 * @fileOverview Controller for element sets
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.0.1
 */

import { Database } from '../core/Database';

import { Source } from '../../common/datamodel/AbstractSource';
import { Persistable } from '../core/Persistable';
import { GenericController } from './GenericController';

export class SourcePersistable extends Source implements Persistable {

    public static readonly tableName: string = 'sources';

    public getTableName() : string {
        return SourcePersistable.tableName;
    }

    public toSchema() {
        return this.serialize();
    }

    public fromSchema(data: any) : SourcePersistable {
        this.deserialize(data);
        return this;
    }
}

export class SourceController extends GenericController<SourcePersistable> {
    constructor(db : Database) {
        super(db, SourcePersistable.tableName);
    }
}