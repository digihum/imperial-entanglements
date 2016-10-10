/**
 * @fileOverview Abstract interface for locations
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import { Serializable } from './Serializable';

export class Predicate implements Serializable {
    public uid: number | null;
    public domain : 'Any';
    public range: 'Any';
    public name: string;
    public description: string;
    public sameAs: string[];
    public readonly: boolean;

    public serialize() : Object {
        return this;
    }

    public deserialize(data : any) : Predicate {
        this.uid = data.uid;
        this.readonly = data.readonly;
        this.domain = data.domain;
        this.name = data.name;
        this.description = data.description;
        return this;
    }
}