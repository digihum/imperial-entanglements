/**
 * @fileOverview Abstract interface for entities
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

export class Entity {
    public readonly id: number | null;
    public readonly entityType: string;
    public parent: number | Entity | null;
    public readonly readonly: boolean;
}