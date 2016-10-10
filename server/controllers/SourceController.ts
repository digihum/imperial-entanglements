/**
 * @fileOverview Controller for element sets
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.0.1
 */

import { Database } from '../core/Database';

import { Source } from '../../common/datamodel/AbstractSource';
import { Persistable } from '../core/Persistable';
import { GenericController } from './GenericController';

export class SourcePersistable extends Source implements Persistable {

    public static readonly tableName: string = 'sources';

    public getTableName() : string {
        return SourcePersistable.tableName;
    }

    public toSchema() {
        return this.serialize();
    }

    public fromSchema(data: any) : SourcePersistable {
        this.deserialize(data);
        return this;
    }
}


// SELECT elements.name, source_elements.value, elements.description, element_sets.name as 'element_set', elements.comment,  elements.uri
// FROM source_elements
// INNER JOIN elements ON source_elements.element = elements.uid
// INNER JOIN element_sets ON element_sets.uid = elements.element_set
// WHERE source_elements.source = 1;


export class SourceController extends GenericController<SourcePersistable> {
    constructor(db : Database) {
        super(db, SourcePersistable.tableName);
    }

    public getItemJson(obj: { new(): SourcePersistable; }, uid: number) : Promise<SourcePersistable> {
        return super.getItemJson(obj, uid)
        .then((source) => {
            return this.db.query().select(
                'elements.name',
                'source_elements.value',
                'elements.description',
                'element_sets.name as element_set',
                'elements.comment',
                'elements.uri')
            .from('source_elements')
            .innerJoin('elements', function() { this.on('source_elements.element', '=', 'elements.uid'); })
            .innerJoin('element_sets', function() { this.on('element_sets.uid', '=', 'elements.element_set'); })
            .where({
                'source_elements.source': 1
            })
            .then((sourceElements) => {
                source.metaData = sourceElements;
                return source;
            });
        });
    }
}