/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import { Serializable } from './Serializable';

export class Element implements Serializable {
    public uid: number | null;
    public elementSet: number;
    public name: string;
    public description: string;
    public comment: string;

    public deserialize(data: any) : Element {
        this.name = data.name;
        this.uid = data.uid;
        this.elementSet = data.elementSet;
        this.description = data.description;
        this.comment = data.comment;
        return this;
    }

    public serialize() : any {
        return this;
    }
}
