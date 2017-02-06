/**
 * @fileOverview Controller for elements
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var falcon_core_1 = require("@digihum/falcon-core");
var GenericController_1 = require("./GenericController");
var ElementController = (function (_super) {
    __extends(ElementController, _super);
    function ElementController(db) {
        return _super.call(this, db, 'elements') || this;
    }
    ElementController.prototype.toSchema = function (data) {
        return falcon_core_1.Serializer.toJson(data);
    };
    ElementController.prototype.fromSchema = function (data) {
        return Object.assign(Object.create(falcon_core_1.Element.prototype), data);
    };
    return ElementController;
}(GenericController_1.GenericController));
exports.ElementController = ElementController;
//# sourceMappingURL=ElementController.js.map