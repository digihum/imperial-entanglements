/**
 * @fileOverview Controller for element sets
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.0.1
 */

import { Database } from '../core/Database';

import { ElementSet, Serializer } from 'falcon-core';
import { GenericController } from './GenericController';

import { omit } from 'lodash';

export class ElementSetController extends GenericController<ElementSet> {

    constructor(db : Database) {
        super(db, 'element_sets');
    }

    public toSchema(data: ElementSet) : any {
        return omit(Serializer.toJson(data), 'elements');
    }

    public fromSchema(data: any) : ElementSet {
        return Object.assign(Object.create(ElementSet.prototype), data);
    }

    public getItemJson(obj: { new(): ElementSet }, uid: number) : PromiseLike<ElementSet> {
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
