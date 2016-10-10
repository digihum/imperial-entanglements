/**
 * @fileOverview Abstract interface for locations
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import { Serializable } from './Serializable';

export class Predicate implements Serializable {
    public uid: number | null;
    public domain : string;
    public range: string;
    public name: string;
    public description: string;
    public sameAs: string[];
    public readonly: boolean;

    //calculated
    public rangeIsReference: boolean;

    public serialize() : Object {
        return this;
    }

    public deserialize(data : any) : Predicate {
        this.uid = data.uid;
        this.readonly = data.readonly;
        this.domain = data.domain;
        this.name = data.name;
        this.description = data.description;
        this.rangeIsReference = data.rangeIsReference;
        this.range = data.range;
        return this;
    }
}