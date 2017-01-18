/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

export class UnprocessableEntity extends Error {

    public data: Promise<any> | undefined;
    public readonly code: number = 422;

    constructor(message: string, data?: Promise<any>) {
        super(message);
        this.data = data;
    }
}

export class KeyNotFoundException extends Error {
  public readonly code: number = 404;

    constructor(message: string = 'Could not find the given key') {
        super(message);
    }
}

export class ReadOnlyResourceException extends Error {
  public readonly code: number = 400;

    constructor(message: string = 'Attempt to update a readonly resource') {
        super(message);
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

  public readonly code: number = 422;

    public data: { message: string, data: any};
    constructor(data: { message: string, data: any}) {
        super(data.message);
        this.data = data;
    }
}

export class InvalidUpdateException extends Error {

  public readonly code: number = 400;

  constructor(message: string) {
      super(message);
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


export const Exceptions = {
    UnprocessableEntity,
    KeyNotFoundException,
    CollectionNotFoundException,
    OperationNotPermittedException,
    DatabaseIntegrityError,
    InvalidUpdateException,
    ReadOnlyResourceException
};
