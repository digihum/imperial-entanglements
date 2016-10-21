/**
 * @fileOverview Controller for element sets
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.0.1
 */

import { Database } from '../core/Database';

import { Source } from '../../common/datamodel/Source';
import { Persistable } from '../core/Persistable';
import { GenericController } from './GenericController';

import { omit } from 'lodash';

export class SourcePersistable extends Source implements Persistable {

    public static readonly tableName: string = 'sources';

    public getTableName() : string {
        return SourcePersistable.tableName;
    }

    public toSchema() {
        return omit(this.serialize(), 'metaData');
    }

    public fromSchema(data: any) : SourcePersistable {
        this.deserialize(data);
        return this;
    }
}

export class SourceController extends GenericController<SourcePersistable> {
    constructor(db : Database) {
        super(db, SourcePersistable.tableName);
    }

    // override the getItemJson and getCollectionJson functions to also get information about the 
    // metadata associated with the retrieved source

    private getMetadata(fields : string[], sourceId: number) : Promise<any> {
        return this.db.query().select(fields)
            .from('source_elements')
            .innerJoin('elements', function() { this.on('source_elements.element', '=', 'elements.uid'); })
            .innerJoin('element_sets', function() { this.on('element_sets.uid', '=', 'elements.element_set'); })
            .where({
                'source_elements.source': sourceId
            });
    }

    public getItemJson(obj: { new(): SourcePersistable; }, uid: number) : Promise<SourcePersistable> {
        return super.getItemJson(obj, uid)
        .then((source) => {

            if (source.uid === null) {
                throw new Error('could not find source');
            }

            return this.getMetadata([
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
}