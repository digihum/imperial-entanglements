/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import { FuzzyLocation } from './FuzzyLocation';
import { PersistentObject } from './PersistentObject';

// function mirror(arr: string[][]) : string[][] {
//     return arr.concat(arr.map(([a, b]) => [b, a]));
// }

export class ElementSet implements PersistentObject {

    public uid: number;
    public uri: URL;
    public name: string;
    public description: string;

    public readonly tableName : string = 'element_sets';
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