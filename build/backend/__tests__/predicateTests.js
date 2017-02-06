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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
var falcon_core_1 = require("@digihum/falcon-core");
var ApiService_1 = require("../../common/ApiService");
var testHelper_1 = require("./testHelper");
exports.predicateTests = function (chai) {
    describe('Predicate', function () {
        it('checking that 4 predicates have been seeded', function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testHelper_1.api.getCollection(falcon_core_1.Predicate, ApiService_1.AppUrls.predicate, {})];
                    case 1:
                        result = _a.sent();
                        chai.expect(result.length).to.equal(4);
                        return [2 /*return*/];
                }
            });
        }); });
        it('adding a new predicate', function () { return __awaiter(_this, void 0, void 0, function () {
            var newPredicate, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newPredicate = falcon_core_1.Serializer.fromJson(falcon_core_1.Predicate, {
                            label: 'Test Predicate 1',
                            domain: 0,
                            range: 0
                        });
                        return [4 /*yield*/, testHelper_1.api.postItem(falcon_core_1.Predicate, ApiService_1.AppUrls.predicate, newPredicate, {})];
                    case 1:
                        result = _a.sent();
                        chai.expect(result.length).to.equal(1);
                        chai.expect(result[0]).to.equal(5);
                        return [2 /*return*/];
                }
            });
        }); });
        it('checking that there are now 5 predicates', function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testHelper_1.api.getCollection(falcon_core_1.Predicate, ApiService_1.AppUrls.predicate, {})];
                    case 1:
                        result = _a.sent();
                        chai.expect(result.length).to.equal(5);
                        return [2 /*return*/];
                }
            });
        }); });
        it('updating the name of new predicate using patch', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testHelper_1.api.patchItem(falcon_core_1.Predicate, ApiService_1.AppUrls.predicate, 5, { label: 'Test 1 Predicate Updated' })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('check name was updated', function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testHelper_1.api.getItem(falcon_core_1.Predicate, ApiService_1.AppUrls.predicate, 5)];
                    case 1:
                        result = _a.sent();
                        chai.expect(result.label).to.equal('Test 1 Predicate Updated');
                        return [2 /*return*/];
                }
            });
        }); });
        it('attempt to update uid (should fail)', function () { return __awaiter(_this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, testHelper_1.api.patchItem(falcon_core_1.Predicate, ApiService_1.AppUrls.predicate, 5, { uid: 23 })];
                    case 1:
                        _a.sent();
                        chai.assert(false, 'an error should have been thrown');
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        chai.expect(err_1.code).to.equal(400);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        it('attempt to update non-existent field (should fail)', function () { return __awaiter(_this, void 0, void 0, function () {
            var err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, testHelper_1.api.patchItem(falcon_core_1.Predicate, ApiService_1.AppUrls.predicate, 5, { banana: 23 })];
                    case 1:
                        _a.sent();
                        chai.assert(false, 'an error should have been thrown');
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _a.sent();
                        chai.expect(err_2.code).to.equal(400);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        xit('attempt to modify locked item (should fail)', function () { return __awaiter(_this, void 0, void 0, function () {
            var err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testHelper_1.knex('predicates').update({ readonly: 1 }).where({ uid: 5 }).then(function () { })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, testHelper_1.api.patchItem(falcon_core_1.Predicate, ApiService_1.AppUrls.predicate, 5, { label: 'Should not work' })];
                    case 3:
                        _a.sent();
                        chai.assert(false, 'an error should have been thrown');
                        return [3 /*break*/, 5];
                    case 4:
                        err_3 = _a.sent();
                        console.log(err_3);
                        chai.expect(err_3.code).to.equal(400);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
        xit('attempt to delete locked item (should fail)', function () { return __awaiter(_this, void 0, void 0, function () {
            var err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testHelper_1.knex('predicates').update({ readonly: 1 }).where({ uid: 5 }).then(function () { })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, testHelper_1.api.delItem(falcon_core_1.Predicate, ApiService_1.AppUrls.predicate, 5)];
                    case 3:
                        _a.sent();
                        chai.assert(false, 'an error should have been thrown');
                        return [3 /*break*/, 5];
                    case 4:
                        err_4 = _a.sent();
                        console.log(err_4);
                        chai.expect(err_4.code).to.equal(400);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
        it('attempt to delete unlocked item', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testHelper_1.knex('predicates').update({ readonly: 0 }).where({ uid: 5 }).then(function () { })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testHelper_1.api.delItem(falcon_core_1.Predicate, ApiService_1.AppUrls.predicate, 5)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('checking that there are now 4 predicates', function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testHelper_1.api.getCollection(falcon_core_1.Predicate, ApiService_1.AppUrls.predicate, {})];
                    case 1:
                        result = _a.sent();
                        chai.expect(result.length).to.equal(4);
                        return [2 /*return*/];
                }
            });
        }); });
        it('add relationship record', function () { return __awaiter(_this, void 0, void 0, function () {
            var newRecord, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newRecord = falcon_core_1.Serializer.fromJson(falcon_core_1.Record, {
                            entity: 1,
                            predicate: 3,
                            value: 1,
                            valueType: 'source'
                        });
                        return [4 /*yield*/, testHelper_1.api.postItem(falcon_core_1.Record, ApiService_1.AppUrls.record, newRecord, {})];
                    case 1:
                        result = _a.sent();
                        chai.expect(result.length).to.equal(1);
                        chai.expect(result[0]).to.equal(2);
                        return [2 /*return*/];
                }
            });
        }); });
        it('attempt to delete related item (should fail)', function () { return __awaiter(_this, void 0, void 0, function () {
            var err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, testHelper_1.api.delItem(falcon_core_1.Predicate, ApiService_1.AppUrls.predicate, 3)];
                    case 1:
                        _a.sent();
                        chai.assert(false, 'an error should have been thrown');
                        return [3 /*break*/, 3];
                    case 2:
                        err_5 = _a.sent();
                        chai.expect(err_5.code).to.equal(422);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        it('delete the relationship record', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testHelper_1.api.delItem(falcon_core_1.Record, ApiService_1.AppUrls.record, 2)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('attempt to delete unlocked item', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testHelper_1.api.delItem(falcon_core_1.Predicate, ApiService_1.AppUrls.predicate, 3)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('checking that there is now 3 predicates', function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testHelper_1.api.getCollection(falcon_core_1.Predicate, ApiService_1.AppUrls.predicate, {})];
                    case 1:
                        result = _a.sent();
                        chai.expect(result.length).to.equal(3);
                        return [2 /*return*/];
                }
            });
        }); });
    });
};
//# sourceMappingURL=predicateTests.js.map