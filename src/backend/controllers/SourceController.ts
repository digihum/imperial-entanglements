/**
 * @fileOverview Controller for sources
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 ** @version 0.2.3
 */

import { Database } from '../data/Database';

import { Source, Serializer } from '@digihum/falcon-core';
import { GenericController } from './GenericController';

import { OperationNotPermittedException, InvalidUpdateException } from '../../common/Exceptions';

import { RecordController } from './RecordController';

import { omit, groupBy, flatten, map as pluck } from 'lodash';

export class SourceController extends GenericController<Source> {

    constructor(db : Database) {
        super(db, 'sources');
    }

    public toSchema(data: Source) {

        const allowedKeys = new Set(['uid', 'label', 'parent', 'sameAs', 'readonly', 'creator', 'creationTimestamp', 'lastmodifiedTimestamp']);

        const extraKeys = Object.keys(data).filter((a) => !allowedKeys.has(a));

        if (extraKeys.length > 0) {
          throw new InvalidUpdateException('Unknown keys: ' + extraKeys.join(', '));
        }

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
            lastmodified_timestamp: data.lastmodifiedTimestamp
        });
    }

    public fromSchema(data: any) : Source {
        return Object.assign(Object.create(Source.prototype), Object.assign(omit(data,
          'same_as',
          'creation_timestamp',
          'lastmodified_timestamp'
        ), {
            'sameAs': data.same_as,
            'creationTimestamp': data.creation_timestamp,
            'lastmodifiedTimestamp': data.lastmodified_timestamp
        }));
    }

    // override the getItemJson and getCollectionJson functions to also get information about the
    // metadata associated with the retrieved source

    private getMetadata(fields : string[], sourceId: number) : Promise<any> {

        return this.db.getAncestorsOf(sourceId, 'sources')
          .then((parents) => {
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

                this.db.getAncestorsOf(uid, 'sources')
            ])
            .then(([sourceElements, children, parents]) => {
                source.metaData = sourceElements;
                source.children = children.map((child) => child.uid).filter((child) => child !== null);
                source.parents = parents;
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
