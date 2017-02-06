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
var mobx_react_1 = require("mobx-react");
var ConflictResolution = (function (_super) {
    __extends(ConflictResolution, _super);
    function ConflictResolution() {
        var _this = _super.call(this) || this;
        _this.state = {
            label: '',
            entityType: { key: '', value: null },
            allEntityTypes: []
        };
        return _this;
    }
    ConflictResolution.prototype.render = function () {
        var _this = this;
        return (React.createElement(Overlay_1.Overlay, null,
            React.createElement("h2", null,
                React.createElement("i", { className: 'fa fa-exclamation-triangle warning' }),
                " Conflict: ",
                this.props.message),
            this.props.conflictingItems.record !== undefined && this.props.conflictingItems.record.length > 0 ? (React.createElement("span", null,
                React.createElement("p", null, "The following records conflict with your request change:"),
                React.createElement("table", { className: 'table' },
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", null, "Entity"),
                            React.createElement("th", null, "Predicate"),
                            React.createElement("th", null, "Value"))),
                    React.createElement("tbody", null, this.props.conflictingItems.record.map(function (record) {
                        var entityName = _this.props.dataStore.dataStore.all.entity.value
                            .find(function (entity) { return entity.uid == record.entity; }).label;
                        var predicateName = _this.props.dataStore.dataStore.all.predicate.value
                            .find(function (predicate) { return predicate.uid == record.predicate; }).label;
                        return (React.createElement("tr", { key: "row-" + record.uid },
                            React.createElement("td", null, entityName),
                            React.createElement("td", null, predicateName),
                            React.createElement("td", null, record.value)));
                    }))))) : null,
            this.props.conflictingItems.entity !== undefined && this.props.conflictingItems.entity.length > 0 ? (React.createElement("span", null,
                React.createElement("p", null, "The following entities conflict with your request change:"),
                React.createElement("table", { className: 'table' },
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", null, "Entity"))),
                    React.createElement("tbody", null, this.props.conflictingItems.entity.map(function (entity) {
                        return (React.createElement("tr", { key: "row-" + entity.uid },
                            React.createElement("td", null, entity.label)));
                    }))))) : null,
            this.props.conflictingItems.entityType !== undefined && this.props.conflictingItems.entityType.length > 0 ? (React.createElement("span", null,
                React.createElement("p", null, "The following entity types conflict with your request change:"),
                React.createElement("table", { className: 'table' },
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", null, "Entity Type"))),
                    React.createElement("tbody", null, this.props.conflictingItems.entityType.map(function (entityType) {
                        return (React.createElement("tr", { key: "row-" + entityType.uid },
                            React.createElement("td", null, entityType.label)));
                    }))))) : null,
            this.props.conflictingItems.source !== undefined && this.props.conflictingItems.source.length > 0 ? (React.createElement("span", null,
                React.createElement("p", null, "The following sources conflict with your request change:"),
                React.createElement("table", { className: 'table' },
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", null, "Sources"))),
                    React.createElement("tbody", null, this.props.conflictingItems.source.map(function (source) {
                        return (React.createElement("tr", { key: "row-" + source.uid },
                            React.createElement("td", null, source.label)));
                    }))))) : null,
            React.createElement("div", { className: 'block-buttons' },
                React.createElement("button", { onClick: function () { return _this.props.cancel(); } }, "Cancel"),
                React.createElement("button", { onClick: function () { return _this.props.complete('addToWorkspace'); } },
                    React.createElement("i", { className: 'icon-list-add' }),
                    "Cancel and add conflicting records to workspace"),
                React.createElement("button", { onClick: function () { return _this.props.complete('deleteAll'); } },
                    React.createElement("i", { className: 'fa fa-trash' }),
                    " Continue and delete all conflicting records"))));
    };
    return ConflictResolution;
}(React.Component));
ConflictResolution = __decorate([
    mobx_react_1.inject('dataStore'),
    mobx_react_1.observer,
    __metadata("design:paramtypes", [])
], ConflictResolution);
exports.ConflictResolution = ConflictResolution;
;
//# sourceMappingURL=ConflictResolution.js.map