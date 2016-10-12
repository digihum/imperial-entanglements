/**
 * @fileOverview Abstract interface for locations
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import { Serializable } from './Serializable';

export class Predicate implements Serializable {
    public uid: number | null = null;
    public domain : number;
    public range: string | number;
    public name: string;
    public description: string | null = null;
    public sameAs: string[] | null = null;
    public readonly: boolean = false;

    //calculated
    public rangeIsReference: boolean;

    public serialize() : Object {
        return this;
    }

    public deserialize(data : any) : Predicate {
        this.uid = data.uid !== undefined ? data.uid : null;
        this.domain = data.domain;
        this.range = data.range;
        this.name = data.name;
        this.description = data.description !== undefined ? data.description : null;
        this.sameAs = data.sameAs !== undefined ? data.sameAs : null;

        this.readonly = data.readonly !== undefined ? data.readonly : false;
        this.rangeIsReference = data.rangeIsReference;
        return this;
    }
}