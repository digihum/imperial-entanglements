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

    //calculated
    public valueType: string | null = null;

    public deserialize(data: any) : Record {
        this.uid = data.uid !== undefined ? data.uid : null;
        this.source = data.source !== undefined ? data.source : null;
        this.predicate = data.predicate;
        this.entity = data.entity;
        this.score = data.score !== undefined ? data.score : null;
        this.valueType = data.valueType !== undefined ? data.valueType : null;
        this.value = data.value !== undefined ? data.value : null;
        return this;
    }

    public serialize() : any {
        return this;
    }
}

// Each value type will have it's own editor control :/
// entity = dropdown selector
// string = text editor
// date = date picker
// integer = numberic picker
// spatial point = lat/lng or point picker (opens new tab. creates new resource)
// spatial region = choose from a list or create new (opens new tab, creates new resource)

// score - star picker
// source - entity picker (with slight modification)
// value - custom (see above)
// entity - entity picker (with slight modification)