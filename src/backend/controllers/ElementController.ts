/**
 * @fileOverview Controller for elements
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 ** @version 0.2.3
 */

import { Database } from '../data/Database';

import { Element, Serializer } from '@digihum/falcon-core';

import { GenericController } from './GenericController';

export class ElementController extends GenericController<Element> {

    constructor(db : Database) {
        super(db, 'elements');
    }

    public toSchema(data: Element) : any {
        return Serializer.toJson(data);
    }

    public fromSchema(data: any) : Element {
        return Object.assign(Object.create(Element.prototype), data);
    }
}
