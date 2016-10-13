/**
 * @fileOverview Abstract interface for entities
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */
import { Serializable } from './Serializable';

export class Record implements Serializable {

    public uid: number | null = null;
    public source: number | null = null;
    public predicate: number;
    public entity: number;
    public score: number | null = null;
    public value: string | null = null;

    public deserialize(data: any) : Record {
        this.uid = data.uid !== undefined ? data.uid : null;
        this.source = data.source !== undefined ? data.source : null;
        this.predicate = data.predicate;
        this.entity = data.entity;
        this.score = data.score !== undefined ? data.score : null;
        return this;
    }

    public serialize() : any {
        return this;
    }
}