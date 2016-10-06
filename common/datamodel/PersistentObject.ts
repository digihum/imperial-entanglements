/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

export interface PersistentObject {
    readonly tableName : string;
    uid: number | null;
    fromJson(data: any) : PersistentObject;
    fromDatabase(data: any) : PersistentObject;
}