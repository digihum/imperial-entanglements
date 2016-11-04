/**
 * @fileOverview Controller for element sets
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.0.1
 */

import { Database } from '../core/Database';

import { Source } from '../../common/datamodel/datamodel';
import { Persistable } from '../core/Persistable';
import { GenericController } from './GenericController';

import { OperationNotPermittedException } from '../core/Exceptions';

import { RecordPersistable } from './RecordController';

import { omit, groupBy, flatten, map as pluck } from 'lodash';

export class SourcePersistable extends Source implements Persistable {

    public static readonly tableName: string = 'sources';

    public getTableName() : string {
        return SourcePersistable.tableName;
    }

    public toSchema() {
        return Object.assign({}, omit(this.serialize(),
            'metaData',
            'sameAs',
            'parents',
            'creationTimestamp',
            'lastmodifiedTimestamp'
        ), {
            same_as: this.sameAs,
            creation_timestamp: this.creationTimestamp,
            lastmodified_timeStamp: this.lastmodifiedTimestamp
        });
    }

    public fromSchema(data: any) : SourcePersistable {
        this.deserialize(Object.assign(data, {
            'sameAs': data.same_as
        }));
        return this;
    }
}

export class SourceController extends GenericController<SourcePersistable> {
    constructor(db : Database) {
        super(db, SourcePersistable.tableName);
    }

    // override the getItemJson and getCollectionJson functions to also get information about the 
    // metadata associated with the retrieved source

    private getMetadata(fields : string[], sourceId: number) : PromiseLike<any> {

        return this.db.query().raw(`
            WITH RECURSIVE parent_of(uid, parent) AS  (SELECT uid, parent FROM sources),
                ancestor(uid) AS (
                SELECT parent FROM parent_of WHERE uid=?
                UNION ALL
                SELECT parent FROM parent_of JOIN ancestor USING(uid) )
            
            SELECT *
                FROM ancestor;
        `, sourceId).then((parents) => {
            parents = pluck(parents, 'uid');
            parents.pop();
            parents = [sourceId].concat(parents);
            return Promise.all(parents.map((parent) =>
                this.db.query().select(fields)
                .from('source_elements')
                .innerJoin('elements', function() { this.on('source_elements.element', '=', 'elements.uid'); })
                .innerJoin('element_sets', function() { this.on('element_sets.uid', '=', 'elements.element_set'); })
                .where({ 'source_elements.source': parent })

            )).then((results) => {
                const a = groupBy(flatten(results), 'name');
                return Object.keys(a).reduce((prev, cur) => {
                    const meta = omit(a[cur][0], 'source', 'value');
                    meta['values'] = a[cur]
                        .map((val) => ({ source: val.source, value: val.value, uid: val.uid }))
                        .sort((a, b) => parents.indexOf(a.source) - parents.indexOf(b.source));
                    return Object.assign(prev, { [cur]: meta });
                }, {});
            });
        });
    }

    public getItemJson(obj: { new(): SourcePersistable; }, uid: number) : Promise<SourcePersistable> {
        return super.getItemJson(obj, uid)
        .then((source) => {

            if (source.uid === null) {
                throw new Error('could not find source');
            }

            return this.getMetadata([
                'source_elements.source as source',
                'elements.name',
                'source_elements.value',
                'elements.description',
                'element_sets.name as element_set',
                'elements.comment',
                'elements.uri',
                'elements.uid as element_uid',
                'source_elements.uid'], source.uid)
            .then((sourceElements) => {
                source.metaData = sourceElements;
                return source;
            });
        });
    }

    public getCollectionJson(obj: { new(): SourcePersistable; }, params: any = {}) : Promise<SourcePersistable[]> {
        return super.getCollectionJson(obj, params)
        .then((sources) => {
            return Promise.all(sources.map((source) => {

                if (source.uid === null) {
                    throw new Error('could not find source');
                }

                return this.getMetadata([
                    'elements.name',
                    'source_elements.value'
                ], source.uid)
                .then((sourceElements) => {
                    source.metaData = sourceElements;
                    return source;
                });

            }));
        });
    }

    //TODO should find every child source, not just the direct children
    public deleteItem(obj: { new(): SourcePersistable; }, uid: number) : Promise<string> {
        // check if this entity is the parent of another entity or if it has any relationships
        // pointing towards it.
        return Promise.all([
            this.db.loadCollection('records', { source: uid}),
            this.db.loadCollection('sources', { parent: uid})
        ]).then(([records, sources]) => {
            if (records.length === 0) {
                return this.db.deleteItem(this.tableName, uid);
            } else {
                throw new OperationNotPermittedException({
                    message: 'The operation could not be completed as the source is used by other records',
                    data: {
                        record: records.map((record) => new RecordPersistable().fromSchema(record)),
                        sources: sources.map((source) => new SourcePersistable().fromSchema(source))
                    }
                });
            }
        });
    }
}