/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const React = require("react");
const Overlay_1 = require("../Overlay");
const falcon_core_1 = require("@digihum/falcon-core");
const ApiService_1 = require("../../ApiService");
const mobx_react_1 = require("mobx-react");
const mousetrap = require("mousetrap");
let CreateEntityType = class CreateEntityType extends React.Component {
    constructor() {
        super();
        this.state = {
            internalValue: ''
        };
    }
    createEntityType() {
        this.props.dataStore.postItem(falcon_core_1.EntityType, ApiService_1.AppUrls.entity_type, falcon_core_1.Serializer.fromJson(falcon_core_1.EntityType, {
            label: this.state.internalValue
        }), {})
            .then(this.props.complete);
    }
    inputRef(val) {
        if (val !== null) {
            val.focus();
            this.keyboardShortcuts = new mousetrap(val);
            this.keyboardShortcuts.bind('return', this.createEntityType.bind(this));
            this.keyboardShortcuts.bind('escape', this.props.cancel);
        }
        else {
            this.keyboardShortcuts.unbind('return');
        }
    }
    render() {
        return (React.createElement(Overlay_1.Overlay, null,
            React.createElement("h2", null, "Create Entity Type"),
            React.createElement("label", { className: 'small' }, "Name"),
            React.createElement("input", { type: 'text', value: this.state.internalValue, ref: this.inputRef.bind(this), onChange: (e) => this.setState({ internalValue: e.target.value }) }),
            React.createElement("button", { onClick: () => this.props.cancel(), className: 'pull-left' }, "Cancel"),
            React.createElement("button", { onClick: this.createEntityType.bind(this), className: 'pull-right' }, "Create Entity Type")));
    }
};
CreateEntityType = __decorate([
    mobx_react_1.inject('dataStore'),
    mobx_react_1.observer,
    __metadata("design:paramtypes", [])
], CreateEntityType);
exports.CreateEntityType = CreateEntityType;
;
//# sourceMappingURL=CreateEntityType.js.map