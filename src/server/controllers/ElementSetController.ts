/**
 * @fileOverview Controller for element sets
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.0.1
 */

import { Database } from '../core/Database';

import { ElementSet } from '../../common/datamodel/ElementSet';
import { Persistable } from '../core/Persistable';
import { GenericController } from './GenericController';

import { omit } from 'lodash';

export class ElementSetPersistable extends ElementSet implements Persistable {

    public static readonly tableName: string = 'element_sets';

    public getTableName() : string {
        return ElementSetPersistable.tableName;
    }

    public toSchema() {
        return omit(this.serialize(), 'elements');
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

    public getItemJson(obj: { new(): ElementSetPersistable; }, uid: number) : PromiseLike<ElementSetPersistable> {
        return super.getItemJson(obj, uid)
        .then((elementSet) => {

            if (elementSet.uid === null) {
                throw new Error('could not find source');
            }

            return this.db.select('elements')
                .where({ 'element_set': elementSet.uid })
                .then((elements) => {
                    elementSet.elements = elements;
                    return elementSet;
                });
        });
    }
}