"use strict";
process.env.NODE_ENV = 'test';
const chai = require("chai");
const chaiPromise = require("chai-as-promised");
require("./testHelper");
chai.use(chaiPromise);
const entityTests_1 = require("./entityTests");
const predicateTests_1 = require("./predicateTests");
const sourceTests_1 = require("./sourceTests");
describe('Falcon API', () => {
    entityTests_1.entityTests(chai);
    predicateTests_1.predicateTests(chai);
    sourceTests_1.sourceTests(chai);
});
//# sourceMappingURL=index.js.map