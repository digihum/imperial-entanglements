/**
 * @fileOverview Abstract interface for locations
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import { Serializable } from './Serializable';

export class Predicate implements Serializable {
    public uid: number | null;
    public domain : number;
    public range: string | number;
    public name: string;
    public description: string | null;
    public sameAs: string | null;
    public readonly: boolean | null;
    public creator: number;

    public creationTimestamp: string;
    public lastmodifiedTimestamp: string;


    //calculated
    public rangeIsReference: boolean;

    public serialize() : Object {
        return this;
    }

    public deserialize(data : any) : Predicate {
        this.uid = data.uid;
        this.domain = data.domain;
        this.range = data.range;
        this.name = data.name;
        this.description = data.description;
        this.sameAs = data.sameAs;

        this.readonly = data.readonly;
        this.rangeIsReference = data.rangeIsReference;
        this.creator = data.creator;

        this.creationTimestamp = data.creationTimestamp;
        this.lastmodifiedTimestamp = data.lastmodifiedTimestamp;

        return this;
    }
}