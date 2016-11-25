/**
 * @fileOverview Controller for element sets
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.0.1
 */

import { Database } from '../core/Database';

import { SourceElement } from '../../common/datamodel/SourceElement';
import { Persistable } from '../core/Persistable';
import { GenericController } from './GenericController';

import { KeyNotFoundException } from '../core/Exceptions';

import { CompositeKey } from '../../common/datamodel/Serializable';

import { omit } from 'lodash';

export class SourceElementPersistable extends SourceElement implements Persistable {

    public static readonly tableName: string = 'source_elements';

    public getTableName() : string {
        return SourceElementPersistable.tableName;
    }

    public toSchema() {
        return Object.assign(omit(this.serialize(),
            'creationTimestamp',
            'lastmodifiedTimestamp',
            'uid'
        ), {
            creation_timestamp: this.creationTimestamp,
            lastmodified_timeStamp: this.lastmodifiedTimestamp,
            source: this.uid.values.source,
            element: this.uid.values.element
        });
    }

    public fromSchema(data: any) : SourceElementPersistable {
        this.deserialize(Object.assign(data, {
                uid: {
                order: ['source', 'element'],
                values: {
                    source: data.source,
                    element: data.element
                }
            }
        }));
        return this;
    }
}

export class SourceElementController extends GenericController<SourceElementPersistable> {
    constructor(db : Database) {
        super(db, SourceElementPersistable.tableName);
    }

    public getItemJson(obj: { new(): SourceElementPersistable; }, uid: CompositeKey) : PromiseLike<SourceElementPersistable> {
        return this.db.query().select()
        .from(this.tableName)
        .where(uid.values)
        .first()
        .then((result) => result === undefined ? Promise.reject(new KeyNotFoundException()) : result)
        .then((data) => new obj().fromSchema(data));
    }

    public putItem(obj: { new(): SourceElementPersistable; }, uid: CompositeKey, data: SourceElementPersistable) : PromiseLike<string> {
        return this.db.query()(this.tableName)
            .where(uid.values)
            .update(omit(data.toSchema(), ['tableName']));
    }

    public patchItem(obj: { new(): SourceElementPersistable; }, uid: CompositeKey, data: SourceElementPersistable) : PromiseLike<boolean> {
        const o = new obj();
        const schemaData = o.deserialize(data).toSchema();

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

    public deleteItem(obj: { new(): SourceElementPersistable; }, uid: CompositeKey) : PromiseLike<string> {
        return this.db.query()(this.tableName)
            .where(uid.values)
            .del();
    }
}