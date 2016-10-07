/**
 * @fileOverview Abstract interface for locations
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import { PersistentObject } from './PersistentObject';

export class Predicate implements PersistentObject {

    public readonly tableName: string;

    public uid: number | null;
    public domain : 'Any';
    public range: 'Any';
    public name: string;
    public description: string;
    public sameAs: string[];

    public fromJson(data: any) : Predicate {
       this.uid = data.uid;
       this.domain = data.domain;
       this.name = data.name;
       this.description = data.description;
       return this;
    }

    public fromDatabase(data: any) : Predicate {
       this.uid = data.uid;
       this.domain = data.domain;
       this.name = data.name;
       this.description = data.description;
       return this;
    }
}