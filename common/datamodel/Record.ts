/**
 * @fileOverview Abstract interface for entities
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */
import { Serializable } from './Serializable';

export class Record implements Serializable {

    public uid: number | null;
    public source: number;
    public predicate: number;
    public entity: number;
    public score: number;
    public value: string | null;

    public deserialize(data: any) : Record {
        //this.uid = this.uid;
        return this;
    }

    public serialize() : any {
        //this.uid = this.uid;
        return this;
    }
}