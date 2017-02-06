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
var Overlay_1 = require("../Overlay");
var falcon_core_1 = require("@digihum/falcon-core");
var ApiService_1 = require("../../ApiService");
var ComboDropdown_1 = require("../ComboDropdown");
var mobx_react_1 = require("mobx-react");
var PredicateComboDropdown = (function (_super) {
    __extends(PredicateComboDropdown, _super);
    function PredicateComboDropdown() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PredicateComboDropdown;
}(ComboDropdown_1.ComboDropdown));
var CreateRecord = (function (_super) {
    __extends(CreateRecord, _super);
    function CreateRecord() {
        var _this = _super.call(this) || this;
        _this.state = {
            comboValue: { key: '', value: null },
            searchValue: ''
        };
        return _this;
    }
    CreateRecord.prototype.componentDidMount = function () {
        this.refs['comboDropDown'].refs['comboDropDownInputBox'].focus();
    };
    CreateRecord.prototype.createNewPredicate = function () {
        var _this = this;
        var modalDef = {
            name: 'predicate',
            complete: function (data) {
                console.log('Predicate editor called complete');
                _this.setComboValue({ key: data.label, value: data === null ? null : data });
            },
            cancel: function () {
                console.log('Predicate editor called cancel');
            },
            settings: {
                initialName: this.state.searchValue,
                initialDomain: this.props.entityType
            }
        };
        this.props.modalStore.addModal(modalDef);
    };
    CreateRecord.prototype.setComboValue = function (opt) {
        var _this = this;
        if (opt.value === null) {
            throw new Error('Value cannot be null');
        }
        this.props.dataStore.postItem(falcon_core_1.Record, ApiService_1.AppUrls.record, falcon_core_1.Serializer.fromJson(falcon_core_1.Record, {
            predicate: opt.value.uid,
            entity: this.props.entityUid,
            valueType: opt.value.rangeIsReference ? 'entity' : opt.value.range,
            score: 3,
            source: this.props.dataStore.defaultSource
        }), {})
            .then(function (result) { return _this.props.complete(result); })
            .catch(this.props.cancel);
    };
    CreateRecord.prototype.render = function () {
        var _this = this;
        return (React.createElement(Overlay_1.Overlay, null,
            React.createElement("h2", null, "Create Record"),
            React.createElement(PredicateComboDropdown, { ref: 'comboDropDown', options: this.props.options, typeName: 'predicate', value: this.state.comboValue, setValue: this.setComboValue.bind(this), createNewValue: this.createNewPredicate.bind(this), updateSearchString: function (s) { return _this.setState({ searchValue: s }); } })));
    };
    return CreateRecord;
}(React.Component));
CreateRecord = __decorate([
    mobx_react_1.inject('modalStore', 'dataStore'),
    mobx_react_1.observer,
    __metadata("design:paramtypes", [])
], CreateRecord);
exports.CreateRecord = CreateRecord;
;
//# sourceMappingURL=CreateRecord.js.map