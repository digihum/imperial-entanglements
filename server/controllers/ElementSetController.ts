/**
 * @fileOverview Controller for element sets
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.0.1
 */

import { Database } from '../core/Database';

import { ElementSet } from '../../common/datamodel/AbstractSource';
import { Persistable } from '../core/Persistable';
import { GenericController } from './GenericController';

export class ElementSetPersistable extends ElementSet implements Persistable {

    public static readonly tableName: string = 'element_sets';

    public getTableName() : string {
        return ElementSetPersistable.tableName;
    }

    public toSchema() {
        return this.serialize();
    }

    public fromSchema(data: any) : ElementSetPersistable {
        this.deserialize(data);
        return this;
    }
}

export class ElementSetController extends GenericController<ElementSetPersistable> {
    constructor(db : Database) {
        super(db, ElementSetPersistable.tableName);
    }
}