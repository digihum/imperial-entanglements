/**
 * @fileOverview Various tool functions.
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
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