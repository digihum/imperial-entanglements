/**
 * @fileOverview Controller for element sets
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.0.1
 */

import { Database } from '../core/Database';

import { SourceElement } from '../../common/datamodel/SourceElement';
import { Persistable } from '../core/Persistable';
import { GenericController } from './GenericController';

import { omit } from 'lodash';

export class SourceElementPersistable extends SourceElement implements Persistable {

    public static readonly tableName: string = 'source_elements';

    public getTableName() : string {
        return SourceElementPersistable.tableName;
    }

    public toSchema() {
        return omit(this.serialize(), 'value', 'valueType');
    }

    public fromSchema(data: any) : SourceElementPersistable {
        this.deserialize(data);
        return this;
    }
}

export class SourceElementController extends GenericController<SourceElementPersistable> {
    constructor(db : Database) {
        super(db, SourceElementPersistable.tableName);
    }
}