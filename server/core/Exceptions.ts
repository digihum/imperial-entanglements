/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

export class KeyNotFoundException extends Error {
    public data: string;
    constructor(message: string = 'Could not find the given key') {
        super(message);
        this.data = message;
    }
}

export class CollectionNotFoundException extends Error {
    public data: string;
    constructor(message: string = 'Could not find the given collection') {
        super(message);
        this.data = message;
    }
}

export class OperationNotPermittedException extends Error {
    public data: { message: string, data: any};
    constructor(data: { message: string, data: any}) {
        super(data.message);
        this.data = data;
    }
}

export class DatabaseIntegrityError extends Error {
    public data: string;
    constructor(message: string = `A database integrity constraint has been broken - your change has not been
 submitted. This is likely due to a change which violates the property types model; please check the types of 
 what you are trying to do. Please also contact the Digital Humanities team, this error should not occur.`) {
        super(message);
        this.data = message;
    }
}


export const exceptions = {
    KeyNotFoundException,
    CollectionNotFoundException,
    OperationNotPermittedException,
    DatabaseIntegrityError
};