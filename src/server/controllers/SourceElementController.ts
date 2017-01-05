/**
 * @fileOverview Controller for source elements
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.0.1
 */

import { Database } from '../core/Database';

import { SourceElement, Serializer, CompositeKey } from 'falcon-core';

import { GenericController } from './GenericController';

import { KeyNotFoundException } from '../core/Exceptions';

import { omit } from 'lodash';

export class SourceElementController extends GenericController<SourceElement> {

    constructor(db : Database) {
        super(db, 'source_elements');
    }

     public toSchema(data: SourceElement) {
        return Object.assign(omit(Serializer.toJson(data),
            'creationTimestamp',
            'lastmodifiedTimestamp',
            'uid',
            'label'
        ), {
            creation_timestamp: data.creationTimestamp,
            lastmodified_timeStamp: data.lastmodifiedTimestamp,
            // TODO: check these exist
            source: data.uid.values['source'],
            element: data.uid.values['element']
        });
    }

    public fromSchema(data: any) : SourceElement {
        return Object.assign(Object.create(SourceElement.prototype), Object.assign(data, {
                uid: {
                order: ['source', 'element'],
                values: {
                    source: data.source,
                    element: data.element
                }
            }
        }));
    }

    public getItemJson(obj: { new(): SourceElement; }, uid: CompositeKey) : Promise<SourceElement> {
        return this.db.query().select()
        .from(this.tableName)
        .where(uid.values)
        .first()
        .then((result) => result === undefined ? Promise.reject(new KeyNotFoundException()) : result)
        .then((data) => this.fromSchema(data));
    }

    public putItem(obj: { new(): SourceElement; }, uid: CompositeKey, data: SourceElement) : Promise<string> {
        return this.db.query()(this.tableName)
            .where(uid.values)
            .update(this.toSchema(data));
    }

    public patchItem(obj: { new(): SourceElement; }, uid: CompositeKey, data: SourceElement) : Promise<boolean> {
        const schemaData = this.toSchema(data);

        const keys = Object.keys(schemaData);

        const updateObject = {};

        for (let i = 0; i < keys.length; i += 1) {
            if (schemaData[keys[i]] !== undefined) {
                updateObject[keys[i]] = schemaData[keys[i]];
            }
        }

        return this.db.query()(this.tableName)
            .where(uid.values)
            .update(updateObject)
            .then(() => true)
            .catch((err) => { throw new Error(err); });
    }

    public deleteItem(obj: { new(): SourceElement; }, uid: CompositeKey) : Promise<string> {
        return this.db.query()(this.tableName)
            .where(uid.values)
            .del();
    }
}
