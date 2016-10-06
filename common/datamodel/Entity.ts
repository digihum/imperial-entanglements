/**
 * @fileOverview Abstract interface for entities
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import { PersistentObject } from './PersistentObject';

export class Entity implements PersistentObject {
    public uid: number | null;
    public entityType: string; // TODO: ideally this should be readonly
    public parent: number | Entity | null;
    public readonly readonly: boolean;

    public tableName: string = 'entities';

    public fromJson(data: any) : Entity {
       this.uid = data.uid;
       this.entityType = data.entityType;
       return this;
    }

    public fromDatabase(data: any) : Entity {
       this.uid = data.uid;
       this.entityType = data.type;
       return this;
    }
}