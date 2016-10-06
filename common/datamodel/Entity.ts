/**
 * @fileOverview Abstract interface for entities
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import { PersistentObject } from './PersistentObject';

export class Entity implements PersistentObject {
    public readonly uid: number | null;
    public readonly entityType: string;
    public parent: number | Entity | null;
    public readonly readonly: boolean;

    public tableName: string = 'entities';

    public fromJson(data: any) : Entity {
       // this.parent = this.uid;
       return this;
    }
}