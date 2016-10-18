/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

export class KeyNotFoundException extends Error {
    public readonly message: string;
    constructor(message: string = 'Could not find the given key') {
        super(message);
    }
}

export class CollectionNotFoundException extends Error {
    public readonly message: string;
    constructor(message: string = 'Could not find the given collection') {
        super(message);
    }
}


export const exceptions = {
    KeyNotFoundException
};