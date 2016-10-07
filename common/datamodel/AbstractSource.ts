/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import { FuzzyLocation } from './FuzzyLocation';
import { Serializable } from './Serializable';

// function mirror(arr: string[][]) : string[][] {
//     return arr.concat(arr.map(([a, b]) => [b, a]));
// }

export interface IElementSet {
    uid: number | null;
    uri: string | null;
    name: string;
    description: string | null;
}

export class ElementSet implements Serializable, IElementSet {

    public uid: number | null;
    public uri: string | null;
    public name: string;
    public description: string | null;

    public deserialize(data: any) : ElementSet {
        this.name = data.name;
        this.uid = data.uid;
        this.description = data.description;
        return this;
    }

    public serialize() : any {
        return {};
    }

    constructor(data: IElementSet = {
        uid: null,
        uri: null,
        name: '',
        description: null
    }) {
        this.uid = 'uid' in data ? data.uid : null;
        this.uri = 'uri' in data ? data.uri : null;
        this.name = data.name;
        this.description = 'description' in data ? data.description : null;
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

export class Source implements Serializable {
    public uid: number | null;
    public name: string;
    public readonly: boolean;

    public serialize() : any {
        return this;
    }

    public deserialize(data: any) : Source {
        this.name = data.name;
        this.uid = data.uid;
        return this;
    }

}