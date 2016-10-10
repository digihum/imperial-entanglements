/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import { Serializable } from './Serializable';
import { Element } from './Element';

class SourceMetadataElement {
    public element: Element;
    public value: string;
}

class SourceTag {
    public id: string;
}

// export interface AbstractSource {
//     locationType: 'physical' | 'digital';
//     metaData: SourceMetadataElement[];
//     creationDate: Date;
//     tags: SourceTag[];
//     location: FuzzyLocation;
//     name: string;
// }

export class Source implements Serializable {
    public uid: number | null;
    public name: string;
    public readonly: boolean;
    public metaData: SourceMetadataElement[];

    public serialize() : any {
        return this;
    }

    public deserialize(data: any) : Source {
        this.name = data.name;
        this.uid = data.uid;
        return this;
    }

}