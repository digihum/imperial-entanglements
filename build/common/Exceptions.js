/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
class UnprocessableEntity extends Error {
    constructor(message, data) {
        super(message);
        this.code = 422;
        this.data = data;
    }
}
exports.UnprocessableEntity = UnprocessableEntity;
class KeyNotFoundException extends Error {
    constructor(message = 'Could not find the given key') {
        super(message);
        this.code = 404;
    }
}
exports.KeyNotFoundException = KeyNotFoundException;
class ReadOnlyResourceException extends Error {
    constructor(message = 'Attempt to update a readonly resource') {
        super(message);
        this.code = 400;
    }
}
exports.ReadOnlyResourceException = ReadOnlyResourceException;
class CollectionNotFoundException extends Error {
    constructor(message = 'Could not find the given collection') {
        super(message);
        this.data = message;
    }
}
exports.CollectionNotFoundException = CollectionNotFoundException;
class OperationNotPermittedException extends Error {
    constructor(data) {
        super(data.message);
        this.code = 422;
        this.data = data;
    }
}
exports.OperationNotPermittedException = OperationNotPermittedException;
class InvalidUpdateException extends Error {
    constructor(message) {
        super(message);
        this.code = 400;
    }
}
exports.InvalidUpdateException = InvalidUpdateException;
class DatabaseIntegrityError extends Error {
    constructor(message = `A database integrity constraint has been broken - your change has not been
 submitted. This is likely due to a change which violates the property types model; please check the types of
 what you are trying to do. Please also contact the Digital Humanities team, this error should not occur.`) {
        super(message);
        this.code = 500;
    }
}
exports.DatabaseIntegrityError = DatabaseIntegrityError;
exports.Exceptions = {
    UnprocessableEntity,
    KeyNotFoundException,
    CollectionNotFoundException,
    OperationNotPermittedException,
    DatabaseIntegrityError,
    InvalidUpdateException,
    ReadOnlyResourceException
};
//# sourceMappingURL=Exceptions.js.map