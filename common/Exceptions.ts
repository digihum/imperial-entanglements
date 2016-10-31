/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

export class UnprocessableEntity extends Error {

    public data: Promise<any>;

    constructor(message: string, data?: Promise<any>) {
        super(message);
        this.data = data;
    }
}

export const Exceptions = {
    UnprocessableEntity
};