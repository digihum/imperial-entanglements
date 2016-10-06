/**
 * @fileOverview Abstract interface for entity type
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import { PersistentObject } from './PersistentObject';

export class EntityType implements PersistentObject {

    public readonly tableName: string;

    public uid: number | null;
    public name: string;
    public description: string;
    public icon: string;
    public color: string;
    public sameAs: string[];

    public fromJson(data: any) : EntityType {
        this.uid = data.uid;
        this.name = data.name;
        this.description = data.description;
        this.icon = data.icon;
        this.color = data.color;
        this.sameAs = data.sameAs;
        return this;
    }
}