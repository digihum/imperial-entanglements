/**
 * @fileOverview Controller for element sets
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.2.0
 */

import { Database } from '../data/Database';

import { ElementSet, Serializer } from '@digihum/falcon-core';
import { GenericController } from './GenericController';

import { omit } from 'lodash';

export class ElementSetController extends GenericController<ElementSet> {

    constructor(db : Database) {
        super(db, 'element_sets');
    }

    public static toSchema(data: ElementSet) : any {
        return omit(Serializer.toJson(data), 'elements');
    }

    public static fromSchema(data: any) : ElementSet {
        return { ... Object.create(ElementSet.prototype), ... data};
        // return Object.assign(Object.create(ElementSet.prototype), data);
    }

    protected toSchema(data: ElementSet) : any {
        return ElementSetController.toSchema(data);
    }

    protected fromSchema(data: any) : ElementSet {
        return ElementSetController.fromSchema(data);
    }

    public getItemJson(obj: { new(): ElementSet }, uid: number) : Promise<ElementSet> {
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
