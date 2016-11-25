/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import { Serializable } from './Serializable';
import { SourceElement } from './SourceElement';

export class Source implements Serializable {
    public uid: number | null;
    public name: string;
    public readonly: boolean;
    public metaData: SourceElement[];
    public sameAs: string;
    public parent: number | null;
    public parents: number[];
    public children: number[];
    public creator: number;

    public creationTimestamp: string;
    public lastmodifiedTimestamp: string;


    public serialize() : any {
        return this;
    }

    public deserialize(data: any) : Source {
        this.name = data.name;
        this.uid = data.uid;
        this.metaData = data.metaData;
        this.sameAs = data.sameAs;
        this.parent = data.parent;
        this.parents = data.parents;
        this.children = data.children;
        this.creator = data.creator;

        this.creationTimestamp = data.creationTimestamp;
        this.lastmodifiedTimestamp = data.lastmodifiedTimestamp;

        return this;
    }

}