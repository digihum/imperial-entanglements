/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var React = require("react");
var falcon_core_1 = require("@digihum/falcon-core");
var ApiService_1 = require("../../ApiService");
var mobx_react_1 = require("mobx-react");
var CreatePresetRecord = CreatePresetRecord_1 = (function (_super) {
    __extends(CreatePresetRecord, _super);
    function CreatePresetRecord() {
        var _this = _super.call(this) || this;
        _this.state = {};
        return _this;
    }
    CreatePresetRecord.prototype.componentDidMount = function () {
        if (CreatePresetRecord_1.openEntityDialog) {
            CreatePresetRecord_1.openEntityDialog = false;
            this.createNewEntity();
        }
        else {
            CreatePresetRecord_1.openEntityDialog = true;
        }
    };
    CreatePresetRecord.prototype.createNewEntity = function () {
        var _this = this;
        var modalDef = {
            name: 'entity',
            complete: function (data) {
                var isMentioned = _this.props.dataStore.dataStore.all.predicate.value.find(function (pred) { return pred.label === 'is mentioned'; });
                if (isMentioned === undefined) {
                    throw new Error('Is mentioned predicate is missing, it should be loaded by default');
                }
                _this.props.dataStore.postItem(falcon_core_1.Record, ApiService_1.AppUrls.record, falcon_core_1.Serializer.fromJson(falcon_core_1.Record, {
                    predicate: isMentioned.uid,
                    entity: data[0],
                    valueType: 'source',
                    source: _this.props.source.uid,
                    score: 3
                }), {})
                    .then(function (result) {
                    _this.props.complete(result);
                })
                    .catch(_this.props.cancel);
            },
            cancel: function () {
            },
            settings: {}
        };
        this.props.modalStore.addModal(modalDef);
    };
    CreatePresetRecord.prototype.render = function () {
        return null;
    };
    return CreatePresetRecord;
}(React.Component));
CreatePresetRecord.openEntityDialog = true;
CreatePresetRecord = CreatePresetRecord_1 = __decorate([
    mobx_react_1.inject('dataStore', 'modalStore'),
    mobx_react_1.observer,
    __metadata("design:paramtypes", [])
], CreatePresetRecord);
exports.CreatePresetRecord = CreatePresetRecord;
;
var CreatePresetRecord_1;
//# sourceMappingURL=CreatePresetRecord.js.map