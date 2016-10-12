/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import { Serializable } from './Serializable';
import { Element } from './Element';

export class ElementSet implements Serializable {

    public uid: number | null = null;
    public uri: string | null = null;
    public name: string;
    public description: string | null = null;
    public elements: Element[] | null = null;

    public deserialize(data: any) : ElementSet {
        this.name = data.name;
        this.uid = data.uid !== undefined ? data.uid : null;
        this.uri = data.uri !== undefined ? data.uri : null;
        this.description = data.description !== undefined ? data.description : null;
        this.elements = data.elements !== undefined ? data.elements : null;
        return this;
    }

    public serialize() : any {
        return this;
    }
}