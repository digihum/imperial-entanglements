/**
 * @fileOverview Controller for element sets
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.0.1
 */

import { Database } from '../core/Database';

import { Element } from '../../common/datamodel/Element';
import { Persistable } from '../core/Persistable';
import { GenericController } from './GenericController';

export class ElementPersistable extends Element implements Persistable {

    public static readonly tableName: string = 'elements';

    public getTableName() : string {
        return ElementPersistable.tableName;
    }

    public toSchema() {
        return this.serialize();
    }

    public fromSchema(data: any) : ElementPersistable {
        this.deserialize(data);
        return this;
    }
}

export class ElementController extends GenericController<ElementPersistable> {
    constructor(db : Database) {
        super(db, ElementPersistable.tableName);
    }
}