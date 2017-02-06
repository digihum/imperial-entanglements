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
var PredicateDescription_1 = require("../fields/PredicateDescription");
var falcon_core_1 = require("@digihum/falcon-core");
var literalTypes_1 = require("../../literalTypes");
var ApiService_1 = require("../../ApiService");
var mobx_react_1 = require("mobx-react");
var CreatePredicate = (function (_super) {
    __extends(CreatePredicate, _super);
    function CreatePredicate() {
        var _this = _super.call(this) || this;
        _this.state = {
            label: '',
            domain: { key: '', value: null },
            range: { key: '', value: null },
            domainOptions: [],
            rangeOptions: []
        };
        return _this;
    }
    CreatePredicate.prototype.componentWillMount = function () {
        this.setState({ label: this.props.initialName });
    };
    CreatePredicate.prototype.componentDidMount = function () {
        var _this = this;
        if (this.props.initialDomain !== undefined) {
            this.props.dataStore.getItem(falcon_core_1.EntityType, ApiService_1.AppUrls.entity_type, this.props.initialDomain)
                .then(function (result) {
                if (result.uid === null) {
                    throw new Error('Unexpected null uid');
                }
                _this.setState({
                    domain: { key: result.label, value: result.uid },
                    domainOptions: [
                        { key: result.label, value: result.uid }
                    ].concat(result.parents.map(function (entityTypeId) {
                        var parentEntityType = _this.props.dataStore.dataStore.all.entity_type.value.find(function (e) { return e.uid === entityTypeId; });
                        return { key: parentEntityType.label, value: entityTypeId };
                    }))
                });
            });
        }
        var results = this.props.dataStore.dataStore.all.entity_type.value;
        var entityTypeMap = results.map(function (entityType) {
            if (entityType.uid === null) {
                throw new Error('Unexpected null uid');
            }
            return { key: entityType.label, value: entityType.uid };
        });
        var entityTypeMap2 = entityTypeMap.map(function (e) { return ({ key: e.key, value: { isReference: true, value: e.value.toString() } }); });
        var literalTypesMap = literalTypes_1.literalTypes.map(function (lit) { return ({ key: lit.label, value: { isReference: false, value: lit.value } }); });
        if (this.props.initialDomain === undefined) {
            this.setState({ domainOptions: entityTypeMap });
        }
        this.setState({
            rangeOptions: literalTypesMap.concat(entityTypeMap2)
        });
    };
    CreatePredicate.prototype.create = function () {
        var _this = this;
        if (this.state.range.value === null || this.state.domain.value === null) {
            throw new Error('Domain and range must be set');
        }
        var newPredicate = falcon_core_1.Serializer.fromJson(falcon_core_1.Predicate, {
            label: this.state.label,
            domain: this.state.domain.value,
            range: this.state.range.value.value,
            rangeIsReference: this.state.range.value.isReference
        });
        this.props.dataStore.postItem(falcon_core_1.Predicate, ApiService_1.AppUrls.predicate, newPredicate, {})
            .then(function (result) {
            newPredicate.uid = result[0];
            _this.props.complete(newPredicate);
        });
    };
    CreatePredicate.prototype.render = function () {
        var _this = this;
        return (React.createElement(Overlay_1.Overlay, null,
            React.createElement("h2", null,
                React.createElement("i", { className: 'fa fa-plus', "aria-hidden": 'true' }),
                " Create Property"),
            React.createElement("label", { className: 'small' }, "Name"),
            React.createElement("input", { type: 'text', className: 'gap', ref: function (a) {
                    if (a !== null) {
                        a.focus();
                    }
                }, value: this.state.label, onChange: function (e) { return _this.setState({ label: e.target.value }); } }),
            React.createElement(PredicateDescription_1.PredicateDescription, { domain: this.state.domain, range: this.state.range, domainChanged: function (s) { return _this.setState({ domain: s }); }, rangeChanged: function (s) { return _this.setState({ range: s }); }, domainOptions: this.state.domainOptions, rangeOptions: this.state.rangeOptions, mode: 'editAll' }),
            React.createElement("div", { className: 'modal-toolbar' },
                React.createElement("button", { onClick: this.props.cancel, className: 'pull-left' }, "Cancel"),
                React.createElement("button", { onClick: this.create.bind(this), className: 'pull-right' }, "Create Property"))));
    };
    return CreatePredicate;
}(React.Component));
CreatePredicate = __decorate([
    mobx_react_1.inject('dataStore'),
    mobx_react_1.observer,
    __metadata("design:paramtypes", [])
], CreatePredicate);
exports.CreatePredicate = CreatePredicate;
;
//# sourceMappingURL=CreatePredicate.js.map