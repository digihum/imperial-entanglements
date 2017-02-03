/**
 * @fileOverview Dummy test to see if tests work
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
const falcon_core_1 = require("@digihum/falcon-core");
const ApiService_1 = require("../../common/ApiService");
const testHelper_1 = require("./testHelper");
exports.sourceTests = (chai) => {
    describe('Sources', () => {
        it('checking that 1 sourcehave been seeded', () => __awaiter(this, void 0, void 0, function* () {
            const result = yield testHelper_1.api.getCollection(falcon_core_1.Source, ApiService_1.AppUrls.source, {});
            chai.expect(result.length).to.equal(1);
        }));
        it('adding a new source', () => __awaiter(this, void 0, void 0, function* () {
            const newSource = falcon_core_1.Serializer.fromJson(falcon_core_1.Source, {
                label: 'Test Source 1'
            });
            const result = yield testHelper_1.api.postItem(falcon_core_1.Source, ApiService_1.AppUrls.source, newSource, {});
            chai.expect(result.length).to.equal(1);
            chai.expect(result[0]).to.equal(2);
        }));
        it('checking that there are now 2 sources', () => __awaiter(this, void 0, void 0, function* () {
            const result = yield testHelper_1.api.getCollection(falcon_core_1.Source, ApiService_1.AppUrls.source, {});
            chai.expect(result.length).to.equal(2);
        }));
        it('updating the name of new source using patch', () => __awaiter(this, void 0, void 0, function* () {
            yield testHelper_1.api.patchItem(falcon_core_1.Source, ApiService_1.AppUrls.source, 2, { label: 'Test 1 Source Updated' });
        }));
        it('check name was updated', () => __awaiter(this, void 0, void 0, function* () {
            const result = yield testHelper_1.api.getItem(falcon_core_1.Source, ApiService_1.AppUrls.source, 2);
            chai.expect(result.label).to.equal('Test 1 Source Updated');
        }));
        it('attempt to update uid (should fail)', () => __awaiter(this, void 0, void 0, function* () {
            try {
                yield testHelper_1.api.patchItem(falcon_core_1.Source, ApiService_1.AppUrls.source, 2, { uid: 23 });
                chai.assert(false, 'an error should have been thrown');
            }
            catch (err) {
                chai.expect(err.code).to.equal(400);
            }
        }));
        it('attempt to update non-existent field (should fail)', () => __awaiter(this, void 0, void 0, function* () {
            try {
                yield testHelper_1.api.patchItem(falcon_core_1.Source, ApiService_1.AppUrls.source, 2, { banana: 23 });
                chai.assert(false, 'an error should have been thrown');
            }
            catch (err) {
                chai.expect(err.code).to.equal(400);
            }
        }));
        xit('attempt to modify locked item (should fail)', () => __awaiter(this, void 0, void 0, function* () {
            yield testHelper_1.knex('sources').update({ readonly: 1 }).where({ uid: 2 }).then(() => { });
            try {
                yield testHelper_1.api.patchItem(falcon_core_1.Source, ApiService_1.AppUrls.source, 2, { label: 'Should not work' });
                chai.assert(false, 'an error should have been thrown');
            }
            catch (err) {
                console.log(err);
                chai.expect(err.code).to.equal(400);
            }
        }));
        xit('attempt to delete locked item (should fail)', () => __awaiter(this, void 0, void 0, function* () {
            yield testHelper_1.knex('sources').update({ readonly: 1 }).where({ uid: 2 }).then(() => { });
            try {
                yield testHelper_1.api.delItem(falcon_core_1.Source, ApiService_1.AppUrls.source, 2);
                chai.assert(false, 'an error should have been thrown');
            }
            catch (err) {
                console.log(err);
                chai.expect(err.code).to.equal(400);
            }
        }));
        it('attempt to delete unlocked item', () => __awaiter(this, void 0, void 0, function* () {
            yield testHelper_1.knex('sources').update({ readonly: 0 }).where({ uid: 2 }).then(() => { });
            yield testHelper_1.api.delItem(falcon_core_1.Source, ApiService_1.AppUrls.source, 2);
        }));
        it('checking that there is now 1 source', () => __awaiter(this, void 0, void 0, function* () {
            const result = yield testHelper_1.api.getCollection(falcon_core_1.Source, ApiService_1.AppUrls.source, {});
            chai.expect(result.length).to.equal(1);
        }));
    });
};
//# sourceMappingURL=sourceTests.js.map