"use strict";
process.env.NODE_ENV = 'test';
var chai = require("chai");
var chaiPromise = require("chai-as-promised");
require("./testHelper");
chai.use(chaiPromise);
var entityTests_1 = require("./entityTests");
var predicateTests_1 = require("./predicateTests");
var sourceTests_1 = require("./sourceTests");
describe('Falcon API', function () {
    entityTests_1.entityTests(chai);
    predicateTests_1.predicateTests(chai);
    sourceTests_1.sourceTests(chai);
});
//# sourceMappingURL=index.js.map