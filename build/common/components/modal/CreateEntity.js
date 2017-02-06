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
var lodash_1 = require("lodash");
var mobx_react_1 = require("mobx-react");
var CreateEntity = (function (_super) {
    __extends(CreateEntity, _super);
    function CreateEntity() {
        var _this = _super.call(this) || this;
        _this.state = {
            label: '',
            entityType: { key: '', value: null },
            allEntityTypes: []
        };
        return _this;
    }
    CreateEntity.prototype.componentWillMount = function () {
        var _this = this;
        this.props.dataStore.getCollection(falcon_core_1.EntityType, ApiService_1.AppUrls.entity_type, {})
            .then(function (allEntityTypes) {
            if (_this.props.initialType !== undefined) {
                var initialType = allEntityTypes.find(function (et) { return et.uid === _this.props.initialType; });
                if (initialType === undefined) {
                    throw new Error('Invalid initial type');
                }
                if (initialType.uid === null) {
                    throw new Error('found entity type with null uid');
                }
                _this.setState({
                    entityType: { key: initialType.label, value: initialType.uid }
                });
            }
            _this.setState({ allEntityTypes: allEntityTypes });
        });
    };
    CreateEntity.prototype.createEntity = function () {
        var _this = this;
        if (this.state.entityType === null) {
            throw new Error('Cannot create entity with null type');
        }
        this.props.dataStore.postItem(falcon_core_1.Entity, ApiService_1.AppUrls.entity, falcon_core_1.Serializer.fromJson(falcon_core_1.Entity, {
            label: this.state.label,
            entityType: this.state.entityType.value
        }), {})
            .then(function (a) { return _this.props.complete(a[0].toString()); });
    };
    CreateEntity.prototype.render = function () {
        var _this = this;
        return (React.createElement(Overlay_1.Overlay, null,
            React.createElement("h2", null, "Create Entity"),
            React.createElement("label", { className: 'small' }, "Label"),
            React.createElement("input", { type: 'text', value: this.state.label, ref: function (a) { if (a !== null)
                    a.focus(); }, name: 'new-entity-name', className: 'gap', onChange: function (e) { return _this.setState({ label: e.target.value }); } }),
            React.createElement("label", { className: 'small' }, "Type"),
            React.createElement(ComboDropdown_1.NumberComboDropdown, { options: this.state.allEntityTypes.map(function (t) { return ({ key: t.label, value: t.uid }); }), typeName: 'entity type', value: this.state.entityType, setValue: function (entityType) { return _this.setState({ entityType: entityType }); }, createNewValue: lodash_1.noop, allowNew: false }),
            React.createElement("button", { name: 'cancel-modal', onClick: function () { return _this.props.cancel(); }, className: 'pull-left' }, "Cancel"),
            React.createElement("button", { name: 'create-entity', onClick: this.createEntity.bind(this), className: 'pull-right' }, "Create Entity")));
    };
    return CreateEntity;
}(React.Component));
CreateEntity = __decorate([
    mobx_react_1.inject('dataStore'),
    mobx_react_1.observer,
    __metadata("design:paramtypes", [])
], CreateEntity);
exports.CreateEntity = CreateEntity;
;
//# sourceMappingURL=CreateEntity.js.map