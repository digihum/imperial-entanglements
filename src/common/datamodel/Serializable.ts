/**
 * @fileOverview Abstract interface for entities
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

export type CompositeKey = { order: string[], values: { [s: string] : number }};

export interface Serializable {
    uid: number | null | CompositeKey;
    serialize() : any;
    deserialize(data: any);
}