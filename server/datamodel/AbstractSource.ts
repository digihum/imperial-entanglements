/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import { FuzzyLocation } from './FuzzyLocation';
import * as Knex from 'knex';

const knex = Knex({
  client: 'sqlite3',
  connection: {
    filename: './mydb.sqlite'
  }
});

export class ElementSet {

    public uid: number;
    public uri: URL;
    public name: string;
    public description: string;

    public static columnNames : Map<string, string> = new Map([
        ['uid', 'uid'],
        ['uri', 'uri'],
        ['name', 'name'],
        ['description', 'description']
    ]);

    public static LOAD(id: number) : Promise<ElementSet> {
        return knex.select()
        .from('element_sets')
        .where({ uid: id })
        .first()
        .then((result) => result === undefined ? Promise.reject('Not Found') :
            Object.keys(result).reduce((prev, curr) =>
                ElementSet.columnNames.has(curr) ? Object.assign(prev, {[ElementSet.columnNames.get(curr)]: result[curr]}) : prev, {}));
    }
}

class Element {
    public uri: URL;
    public elementSet: ElementSet;
    public name: string;
    public description: string;
    public comment: string;
}

class SourceMetadataElement {
    public element: Element;
    public value: string;
}

class SourceTag {
    public id: string;
}

export interface AbstractSource {
    locationType: 'physical' | 'digital';
    metaData: SourceMetadataElement[];
    creationDate: Date;
    tags: SourceTag[];
    location: FuzzyLocation;
    name: string;
}