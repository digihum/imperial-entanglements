/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import { Serializable, CompositeKey } from './Serializable';

export class SourceElement implements Serializable {

    public uid: CompositeKey;
    public value: string;
    public creator: number;

    public creationTimestamp: string;
    public lastmodifiedTimestamp: string;


    public deserialize(data: any) : SourceElement {
        this.uid = data.uid;
        this.value = data.value;
        this.creator = data.creator;

        this.creationTimestamp = data.creationTimestamp;
        this.lastmodifiedTimestamp = data.lastmodifiedTimestamp;

        return this;
    }

    public serialize() : any {
        return this;
    }
}