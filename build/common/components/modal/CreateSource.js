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
var mobx_react_1 = require("mobx-react");
var mousetrap = require("mousetrap");
var CreateSource = (function (_super) {
    __extends(CreateSource, _super);
    function CreateSource() {
        var _this = _super.call(this) || this;
        _this.state = {
            internalValue: ''
        };
        return _this;
    }
    CreateSource.prototype.componentWillMount = function () {
        this.setState({ internalValue: this.props.initialValue });
    };
    CreateSource.prototype.createSource = function () {
        this.props.dataStore.postItem(falcon_core_1.Source, ApiService_1.AppUrls.source, falcon_core_1.Serializer.fromJson(falcon_core_1.Source, {
            label: this.state.internalValue
        }), {})
            .then(this.props.complete);
    };
    CreateSource.prototype.inputRef = function (val) {
        if (val !== null) {
            val.focus();
            this.keyboardShortcuts = new mousetrap(val);
            this.keyboardShortcuts.bind('return', this.createSource.bind(this));
            this.keyboardShortcuts.bind('escape', this.props.cancel);
        }
        else {
            this.keyboardShortcuts.unbind('return');
            this.keyboardShortcuts.unbind('escape');
        }
    };
    CreateSource.prototype.render = function () {
        var _this = this;
        return (React.createElement(Overlay_1.Overlay, null,
            React.createElement("h2", null, "Create Source"),
            React.createElement("label", { className: 'small' }, "Name"),
            React.createElement("input", { type: 'text', value: this.state.internalValue, ref: this.inputRef.bind(this), onChange: function (e) { return _this.setState({ internalValue: e.target.value }); } }),
            React.createElement("button", { onClick: function () { return _this.props.cancel(); }, className: 'pull-left' }, "Cancel"),
            React.createElement("button", { onClick: this.createSource.bind(this), className: 'pull-right' }, "Create Source")));
    };
    return CreateSource;
}(React.Component));
CreateSource.defaultProps = {
    initialValue: ''
};
CreateSource = __decorate([
    mobx_react_1.inject('dataStore'),
    mobx_react_1.observer,
    __metadata("design:paramtypes", [])
], CreateSource);
exports.CreateSource = CreateSource;
//# sourceMappingURL=CreateSource.js.map