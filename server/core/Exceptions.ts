/**
 * @fileOverview Various tool functions.
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

export class KeyNotFoundException {
    public readonly message: string;
    constructor(message: string = 'Could not find the given key') {
        this.message = message;
    }
}

export const exceptions = {
    KeyNotFoundException
};