/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import { Serializable } from './Serializable';

export class SourceElement implements Serializable {
    public uid: number | null;
    public source: number;
    public element: number;
    public value: string;

    public deserialize(data: any) : SourceElement {
        this.uid = data.uid !== undefined ? data.uid : null;
        this.source = data.source !== undefined ? data.source : null;
        this.element = data.element !== undefined ? data.element : null;
        this.value = data.value !== undefined ? data.value : null;
        return this;
    }

    public serialize() : any {
        return this;
    }
}