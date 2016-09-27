/**
 * @fileOverview Abstract interface for entities
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */
import { PersistentObject } from './PersistentObject';

export class Record implements PersistentObject {

    public readonly tableName: string;

    public uid: number | null;
    public source: number;
    public predicate: number;
    public entity: number;
    public score: number;
}