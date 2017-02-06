/**
 * @fileOverview Controller for elements
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
const falcon_core_1 = require("@digihum/falcon-core");
const GenericController_1 = require("./GenericController");
class ElementController extends GenericController_1.GenericController {
    constructor(db) {
        super(db, 'elements');
    }
    toSchema(data) {
        return falcon_core_1.Serializer.toJson(data);
    }
    fromSchema(data) {
        return Object.assign(Object.create(falcon_core_1.Element.prototype), data);
    }
}
exports.ElementController = ElementController;
//# sourceMappingURL=ElementController.js.map