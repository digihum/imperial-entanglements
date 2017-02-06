/**
 * @fileOverview Controller for element sets
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var falcon_core_1 = require("@digihum/falcon-core");
var GenericController_1 = require("./GenericController");
var lodash_1 = require("lodash");
var ElementSetController = (function (_super) {
    __extends(ElementSetController, _super);
    function ElementSetController(db) {
        return _super.call(this, db, 'element_sets') || this;
    }
    ElementSetController.toSchema = function (data) {
        return lodash_1.omit(falcon_core_1.Serializer.toJson(data), 'elements');
    };
    ElementSetController.fromSchema = function (data) {
        return __assign({}, Object.create(falcon_core_1.ElementSet.prototype), data);
        // return Object.assign(Object.create(ElementSet.prototype), data);
    };
    ElementSetController.prototype.toSchema = function (data) {
        return ElementSetController.toSchema(data);
    };
    ElementSetController.prototype.fromSchema = function (data) {
        return ElementSetController.fromSchema(data);
    };
    ElementSetController.prototype.getItemJson = function (obj, uid) {
        var _this = this;
        return _super.prototype.getItemJson.call(this, obj, uid)
            .then(function (elementSet) {
            if (elementSet.uid === null) {
                throw new Error('could not find source');
            }
            return _this.db.select('elements')
                .where({ 'element_set': elementSet.uid })
                .then(function (elements) {
                elementSet.elements = elements;
                return elementSet;
            });
        });
    };
    return ElementSetController;
}(GenericController_1.GenericController));
exports.ElementSetController = ElementSetController;
//# sourceMappingURL=ElementSetController.js.map