/**
 * @fileOverview Abstract interface for entities
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import { Serializable } from './Serializable';

export class Entity implements Serializable {
    public uid: number | null;
    public entityType: number; // TODO: ideally this should be readonly
    public parent: number | null;
    public readonly readonly: boolean;
    public label: string;
    public creator: number;

    public creationTimestamp: string;
    public lastmodifiedTimestamp: string;

    public deserialize(data: any) : Entity {
       this.uid = data.uid;
       this.entityType = data.entityType;
       this.label = data.label;
       this.parent = data.parent;
       this.creator = data.creator;

       this.creationTimestamp = data.creationTimestamp;
       this.lastmodifiedTimestamp = data.lastmodifiedTimestamp;

       return this;
    }

    public serialize() : any {
        return this;
    }
}