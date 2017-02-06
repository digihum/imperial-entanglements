/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var UnprocessableEntity = (function (_super) {
    __extends(UnprocessableEntity, _super);
    function UnprocessableEntity(message, data) {
        var _this = _super.call(this, message) || this;
        _this.code = 422;
        _this.data = data;
        return _this;
    }
    return UnprocessableEntity;
}(Error));
exports.UnprocessableEntity = UnprocessableEntity;
var KeyNotFoundException = (function (_super) {
    __extends(KeyNotFoundException, _super);
    function KeyNotFoundException(message) {
        if (message === void 0) { message = 'Could not find the given key'; }
        var _this = _super.call(this, message) || this;
        _this.code = 404;
        return _this;
    }
    return KeyNotFoundException;
}(Error));
exports.KeyNotFoundException = KeyNotFoundException;
var ReadOnlyResourceException = (function (_super) {
    __extends(ReadOnlyResourceException, _super);
    function ReadOnlyResourceException(message) {
        if (message === void 0) { message = 'Attempt to update a readonly resource'; }
        var _this = _super.call(this, message) || this;
        _this.code = 400;
        return _this;
    }
    return ReadOnlyResourceException;
}(Error));
exports.ReadOnlyResourceException = ReadOnlyResourceException;
var CollectionNotFoundException = (function (_super) {
    __extends(CollectionNotFoundException, _super);
    function CollectionNotFoundException(message) {
        if (message === void 0) { message = 'Could not find the given collection'; }
        var _this = _super.call(this, message) || this;
        _this.data = message;
        return _this;
    }
    return CollectionNotFoundException;
}(Error));
exports.CollectionNotFoundException = CollectionNotFoundException;
var OperationNotPermittedException = (function (_super) {
    __extends(OperationNotPermittedException, _super);
    function OperationNotPermittedException(data) {
        var _this = _super.call(this, data.message) || this;
        _this.code = 422;
        _this.data = data;
        return _this;
    }
    return OperationNotPermittedException;
}(Error));
exports.OperationNotPermittedException = OperationNotPermittedException;
var InvalidUpdateException = (function (_super) {
    __extends(InvalidUpdateException, _super);
    function InvalidUpdateException(message) {
        var _this = _super.call(this, message) || this;
        _this.code = 400;
        return _this;
    }
    return InvalidUpdateException;
}(Error));
exports.InvalidUpdateException = InvalidUpdateException;
var DatabaseIntegrityError = (function (_super) {
    __extends(DatabaseIntegrityError, _super);
    function DatabaseIntegrityError(message) {
        if (message === void 0) { message = "A database integrity constraint has been broken - your change has not been\n submitted. This is likely due to a change which violates the property types model; please check the types of\n what you are trying to do. Please also contact the Digital Humanities team, this error should not occur."; }
        var _this = _super.call(this, message) || this;
        _this.code = 500;
        return _this;
    }
    return DatabaseIntegrityError;
}(Error));
exports.DatabaseIntegrityError = DatabaseIntegrityError;
exports.Exceptions = {
    UnprocessableEntity: UnprocessableEntity,
    KeyNotFoundException: KeyNotFoundException,
    CollectionNotFoundException: CollectionNotFoundException,
    OperationNotPermittedException: OperationNotPermittedException,
    DatabaseIntegrityError: DatabaseIntegrityError,
    InvalidUpdateException: InvalidUpdateException,
    ReadOnlyResourceException: ReadOnlyResourceException
};
//# sourceMappingURL=Exceptions.js.map