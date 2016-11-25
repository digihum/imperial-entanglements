/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import { Serializable } from './Serializable';
import { Element } from './Element';

export class ElementSet implements Serializable {

    public uid: number | null;
    public uri: string | null;
    public name: string;
    public description: string | null;
    public elements: Element[] | null;

    public deserialize(data: any) : ElementSet {
        this.name = data.name;
        this.uid = data.uid;
        this.uri = data.uri;
        this.description = data.description;
        this.elements = data.elements;
        return this;
    }

    public serialize() : any {
        return this;
    }
}