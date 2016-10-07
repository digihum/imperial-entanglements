/**
 * @fileOverview Abstract interface for entity type
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import { Serializable } from './Serializable';


export class EntityType implements Serializable {

    public uid: number | null;
    public name: string;
    public description: string;
    public icon: string;
    public color: string;
    public sameAs: string[];

    public deserialize(data: any) : EntityType {
        this.uid = data.uid;
        this.name = data.name;
        this.description = data.description;
        this.icon = data.icon;
        this.color = data.color;
        this.sameAs = data.sameAs;
        return this;
    }

    public serialize() : any {
        return this;
    }
}