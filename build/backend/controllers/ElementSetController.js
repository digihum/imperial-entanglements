/**
 * @fileOverview Controller for element sets
 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
const falcon_core_1 = require("@digihum/falcon-core");
const GenericController_1 = require("./GenericController");
const lodash_1 = require("lodash");
class ElementSetController extends GenericController_1.GenericController {
    constructor(db) {
        super(db, 'element_sets');
    }
    static toSchema(data) {
        return lodash_1.omit(falcon_core_1.Serializer.toJson(data), 'elements');
    }
    static fromSchema(data) {
        return __assign({}, Object.create(falcon_core_1.ElementSet.prototype), data);
        // return Object.assign(Object.create(ElementSet.prototype), data);
    }
    toSchema(data) {
        return ElementSetController.toSchema(data);
    }
    fromSchema(data) {
        return ElementSetController.fromSchema(data);
    }
    getItemJson(obj, uid) {
        return super.getItemJson(obj, uid)
            .then((elementSet) => {
            if (elementSet.uid === null) {
                throw new Error('could not find source');
            }
            return this.db.select('elements')
                .where({ 'element_set': elementSet.uid })
                .then((elements) => {
                elementSet.elements = elements;
                return elementSet;
            });
        });
    }
}
exports.ElementSetController = ElementSetController;
//# sourceMappingURL=ElementSetController.js.map