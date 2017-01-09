/**
 * @fileOverview Controller for sources
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.0.1
 */

import { Database } from '../data/Database';

import { Source, Serializer } from 'falcon-core';
import { GenericController } from './GenericController';

import { OperationNotPermittedException } from '../../common/Exceptions';

import { RecordController } from './RecordController';

import { omit, groupBy, flatten, map as pluck } from 'lodash';

export class SourceController extends GenericController<Source> {

    constructor(db : Database) {
        super(db, 'sources');
    }

    public toSchema(data: Source) {
        return Object.assign({}, omit(Serializer.toJson(data),
            'metaData',
            'sameAs',
            'parents',
            'children',
            'creationTimestamp',
            'lastmodifiedTimestamp'
        ), {
            same_as: data.sameAs,
            creation_timestamp: data.creationTimestamp,
            lastmodified_timeStamp: data.lastmodifiedTimestamp
        });
    }

    public fromSchema(data: any) : Source {
        return Object.assign(Object.create(Source.prototype), Object.assign(data, {
            'sameAs': data.same_as
        }));
    }

    // override the getItemJson and getCollectionJson functions to also get information about the
    // metadata associated with the retrieved source

    private getMetadata(fields : string[], sourceId: number) : Promise<any> {

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
                const a = groupBy(flatten(results), 'label');
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

    public getItemJson(obj: { new(): Source; }, uid: number) : Promise<Source> {
        return super.getItemJson(obj, uid)
        .then((source) => {

            if (source.uid === null) {
                throw new Error('could not find source');
            }

            return Promise.all([
                this.getMetadata([
                'source_elements.source as source',
                'elements.label',
                'source_elements.value',
                'elements.description',
                'element_sets.label as element_set',
                'elements.comment',
                'elements.uri',
                'elements.uid as element_uid'], source.uid),

                this.db.query().select('uid').from('sources').where({ parent: uid }),

                this.db.query().raw(`
                    WITH RECURSIVE parent_of(uid, parent) AS  (SELECT uid, parent FROM sources),
                    ancestor(uid) AS (
                    SELECT parent FROM parent_of WHERE uid=?
                    UNION ALL
                    SELECT parent FROM parent_of JOIN ancestor USING(uid) )

                    SELECT uid
                    FROM ancestor;
                `, uid)
            ])
            .then(([sourceElements, children, parents]) => {
                source.metaData = sourceElements;
                source.children = children.map((child) => child.uid).filter((child) => child !== null);
                source.parents = parents.map((parent) => parent.uid).filter((parent) => parent !== null);
                return source;
            });
        });
    }

    public getCollectionJson(obj: { new(): Source; }, params: any = {}) : Promise<Source[]> {
        return super.getCollectionJson(obj, params)
        .then((sources) => {
            return Promise.all(sources.map((source) => {

                if (source.uid === null) {
                    throw new Error('could not find source');
                }

                return this.getMetadata([
                    'elements.label',
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
    public async deleteItem(obj: { new(): Source; }, uid: number) : Promise<string> {
        // check if this entity is the parent of another entity or if it has any relationships
        // pointing towards it.

        const [ records, sources ] = await Promise.all([
            this.db.loadCollection('records', { source: uid}),
            this.db.loadCollection('sources', { parent: uid})
        ]);

        if (records.length + sources.length === 0) {
            return this.db.deleteItem(this.tableName, uid);
        } else {
            throw new OperationNotPermittedException({
                message: 'The operation could not be completed as the source is used by other records',
                data: Promise.resolve({
                    record: records.map((record) => RecordController.fromSchema(record)),
                    source: sources.map((source) => this.fromSchema(source))
                })
            });
        }
    }
}
