/**
 * @fileOverview Abstract interface for entities
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

export interface Serializable {
    uid: number | null;
    serialize() : any;
    deserialize(data: any);
}