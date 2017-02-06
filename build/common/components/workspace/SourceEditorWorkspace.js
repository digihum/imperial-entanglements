/**
 * @fileOverview Predicate editor workspace
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
var SameAsEditor_1 = require("../fields/SameAsEditor");
var ApiService_1 = require("../../ApiService");
var falcon_core_1 = require("@digihum/falcon-core");
var EditableHeader_1 = require("../fields/EditableHeader");
var EditableFieldComponent_1 = require("../fields/EditableFieldComponent");
var EditableParagraph_1 = require("../fields/EditableParagraph");
var EditableComboDropdown_1 = require("../fields/EditableComboDropdown");
var lodash_1 = require("lodash");
var mobx_react_1 = require("mobx-react");
var AddTabButton_1 = require("../AddTabButton");
var HeaderEditableFieldComponent = EditableFieldComponent_1.EditableFieldHOC(EditableHeader_1.EditableHeader);
var ParagraphEditableFieldComponent = EditableFieldComponent_1.EditableFieldHOC(EditableParagraph_1.EditableParagraph);
var SameAsEditableFieldComponent = EditableFieldComponent_1.EditableFieldHOC(SameAsEditor_1.SameAsEditor);
var ComboEditableFieldComponent = EditableFieldComponent_1.EditableFieldHOC(EditableComboDropdown_1.EditableComboDropdown);
// - Should state the number of times this predicate is used
// - Widening the domain or range always okay
// - Narrowing should check for conflicts and return them
// - Asks 'Delete conflicting records?'
// - Strong check (double button press or type) to confirm
// - Changing name/description/sameAs - absolutly fine
// - Cannot change 'readonly'
var SourceEditorWorkspace = (function (_super) {
    __extends(SourceEditorWorkspace, _super);
    function SourceEditorWorkspace() {
        var _this = _super.call(this) || this;
        _this.state = {
            metaData: {}
        };
        return _this;
    }
    SourceEditorWorkspace.prototype.componentDidMount = function () {
        this.loadData(this.props);
    };
    SourceEditorWorkspace.prototype.componentWillReceiveProps = function (newProps) {
        this.loadData(newProps);
    };
    SourceEditorWorkspace.prototype.loadData = function (props) {
        var source = props.dataStore.dataStore.tabs.source[this.props.id].value.source;
        this.setState({
            metaData: lodash_1.keyBy(source.metaData, 'name')
        });
    };
    SourceEditorWorkspace.prototype.updateSource = function (field, value) {
        var source = this.props.dataStore.dataStore.tabs.source[this.props.id].value.source;
        if (source.uid === null) {
            throw new Error('source uid should not be null');
        }
        this.props.dataStore.patchItem(falcon_core_1.Source, ApiService_1.AppUrls.source, source.uid, (_a = {}, _a[field] = value, _a));
        var _a;
    };
    SourceEditorWorkspace.prototype.updateSourceElement = function (element, value) {
        var _this = this;
        var source = this.props.dataStore.dataStore.tabs.source[this.props.id].value.source;
        if (element.uid === null) {
            throw new Error('source element uid should not be null');
        }
        var compositeKey = {
            order: ['source', 'element'],
            values: {
                source: this.props.id,
                element: element.uid
            }
        };
        if (source.metaData[element.label] !== undefined
            && source.metaData[element.label].values.find(function (a) { return a.source === _this.props.id; }) !== undefined) {
            this.props.dataStore.patchItem(falcon_core_1.SourceElement, ApiService_1.AppUrls.source_element, compositeKey, falcon_core_1.Serializer.fromJson(falcon_core_1.SourceElement, {
                uid: compositeKey,
                element: source.metaData[element.label].element_uid,
                source: this.props.id,
                value: value
            }));
        }
        else {
            this.props.dataStore.postItem(falcon_core_1.SourceElement, ApiService_1.AppUrls.source_element, falcon_core_1.Serializer.fromJson(falcon_core_1.SourceElement, {
                uid: compositeKey,
                value: value
            }), {});
        }
    };
    SourceEditorWorkspace.prototype.del = function () {
        var _this = this;
        this.props.dataStore.delItem(falcon_core_1.Source, ApiService_1.AppUrls.source, this.props.id)
            .then(function () { return _this.context.router.transitionTo('/edit/notfound'); })
            .catch(function (e) {
            if (e.code === 404) {
                _this.context.router.transitionTo('/edit/notfound');
            }
            if (e.code === 422) {
                e.data.then(function (data) {
                    var conflictResolutionModal = {
                        name: 'conflict_resolution',
                        cancel: function () { },
                        complete: function (result) {
                            if (result === 'addToWorkspace') {
                                data.source.forEach(function (datum) {
                                    _this.props.dataStore.createTab('source', datum.uid, 'item');
                                });
                            }
                            if (result === 'deleteAll') {
                                Promise.all(data.source.map(function (datum) { return _this.props.dataStore.delItem(falcon_core_1.Source, ApiService_1.AppUrls.source, datum.uid); }))
                                    .then(function () {
                                    _this.del();
                                });
                            }
                        },
                        settings: {
                            conflictingItems: data,
                            message: 'Deleting Source'
                        }
                    };
                    _this.props.modalStore.addModal(conflictResolutionModal);
                });
            }
        });
    };
    SourceEditorWorkspace.prototype.createChild = function () {
        var _this = this;
        var source = this.props.dataStore.dataStore.tabs.source[this.props.id].value.source;
        var newSource = falcon_core_1.Serializer.fromJson(falcon_core_1.Source, lodash_1.omit(Object.assign({}, falcon_core_1.Serializer.toJson(source), { label: 'Child of ' + source.label, parent: this.props.id }), 'metaData', 'children', 'parents'));
        this.props.dataStore.postItem(falcon_core_1.Source, ApiService_1.AppUrls.source, newSource, {})
            .then(function (_a) {
            var id = _a[0];
            _this.props.dataStore.createTab('source', id, 'item');
        });
    };
    // create entity with 'mentioned in' already set to this source
    SourceEditorWorkspace.prototype.createEntity = function () {
        var _this = this;
        var a = {
            name: 'preset_record',
            complete: function (_a) {
                var id = _a[0];
                _this.props.dataStore.createTab('entity', id, 'item');
            },
            cancel: function () { },
            settings: {
                source: this.props.dataStore.dataStore.tabs.source[this.props.id].value.source
            }
        };
        this.props.modalStore.addModal(a);
    };
    SourceEditorWorkspace.prototype.render = function () {
        var _this = this;
        var source = this.props.dataStore.dataStore.tabs.source[this.props.id].value.source;
        var potentialParents = this.props.dataStore.dataStore.all.source.value;
        var parentName = '';
        if (potentialParents !== null && source.parent !== undefined) {
            var found = potentialParents.find(function (par) { return par.uid === source.parent; });
            if (found !== undefined) {
                parentName = found.label;
            }
        }
        return (React.createElement("div", { className: 'workspace-editor' },
            React.createElement("header", { className: 'editor-header source' },
                React.createElement("div", { className: 'primary-toolbar' },
                    React.createElement("div", { className: 'main-toolbar' },
                        React.createElement("div", { className: 'bread-crumbs' }, source.parents
                            .slice()
                            .reverse()
                            .map(function (child) { return _this.props.dataStore.dataStore.all.source.value.find(function (et) { return et.uid === child; }); })
                            .map(function (parent, i) {
                            if (parent === undefined) {
                                throw new Error('Encountered undefined parent');
                            }
                            if (parent.uid === null) {
                                throw new Error('Encountered parent with null uid');
                            }
                            return (React.createElement("span", { key: "breadcrumb-" + parent.uid },
                                React.createElement("span", null,
                                    "  ",
                                    parent.label,
                                    " ",
                                    React.createElement(AddTabButton_1.AddTabButton, { tabType: 'source', uid: parent.uid }),
                                    " "),
                                React.createElement("i", { className: 'fa fa-angle-right' })));
                        })),
                        React.createElement("i", { className: 'fa fa-sun-o item-icon' }),
                        React.createElement(EditableHeader_1.EditableHeader, { value: source.label, onChange: function (value) { return _this.updateSource('label', value); } })),
                    React.createElement("div", { className: 'sub-toolbar' },
                        React.createElement("i", { className: 'fa fa-plus add button', "aria-hidden": 'true', onClick: this.createEntity.bind(this) }),
                        React.createElement("i", { className: 'fa fa-trash delete button', "aria-hidden": 'true', onClick: function () { return _this.del(); } }),
                        React.createElement("i", { className: 'fa fa-arrow-circle-o-down button', "aria-hidden": 'true', onClick: this.createChild.bind(this) }))),
                React.createElement("div", { className: 'secondary-toolbar' },
                    React.createElement("div", { className: 'tab-bar' },
                        React.createElement("div", { className: 'source selected' }, "DUBLIN CORE"),
                        React.createElement("div", { className: 'source', style: { display: 'none' } }, "DETAILS"),
                        React.createElement("div", { className: 'source', style: { display: 'none' } }, "MEDIA")))),
            React.createElement("section", { className: 'editor-body' },
                React.createElement("div", { className: 'edit-group' },
                    React.createElement("label", { className: 'small' }, "Parent"),
                    React.createElement(ComboEditableFieldComponent, { value: { key: parentName, value: source.parent }, onChange: function (value) { return _this.updateSource('parent', value === null ? null : value.value); }, comboSettings: {
                            options: potentialParents.map(function (par) { return ({ key: par.label, value: par.uid }); }),
                            typeName: 'Source'
                        } }),
                    source.parent !== null ? (React.createElement(AddTabButton_1.AddTabButton, { tabType: 'source', uid: source.parent })) : null),
                React.createElement("div", { className: 'edit-group' },
                    React.createElement(SameAsEditableFieldComponent, { value: source.sameAs, onChange: function (value) { return _this.updateSource('sameAs', value); } })),
                this.props.dataStore.dataStore.all.dublinCore.value.elements.map(function (element) {
                    var values = source.metaData.hasOwnProperty(element.label) ?
                        source.metaData[element.label].values : [{ source: _this.props.id, value: '' }];
                    var editableValue = values[0].source == _this.props.id ? values[0].value : '';
                    return (React.createElement("div", { key: element.label + "-edit" },
                        React.createElement("h5", { className: 'section-header' },
                            element.label,
                            " ",
                            React.createElement("small", null,
                                React.createElement("a", { href: element.uri }, element.uri))),
                        React.createElement("p", { className: 'element-description' }, element.description),
                        React.createElement("ul", null, values.map(function (value) { return value.source != _this.props.id ? (React.createElement("li", { key: element.uid + "-" + value.source },
                            _this.props.dataStore.dataStore.all.source.value.find(function (s) { return s.uid === value.source; }).label,
                            ": ",
                            value.value)) : null; })),
                        React.createElement(ParagraphEditableFieldComponent, { value: editableValue, onChange: function (value) { return _this.updateSourceElement(element, value); } })));
                }),
                React.createElement("div", null,
                    React.createElement("h4", null, "Direct Children"),
                    React.createElement("ul", null, source.children
                        .map(function (child) { return _this.props.dataStore.dataStore.all.source.value.find(function (et) { return et.uid === child; }); })
                        .map(function (childEt) {
                        return (React.createElement("li", { key: "dc-" + childEt.uid },
                            childEt.label,
                            " ",
                            React.createElement(AddTabButton_1.AddTabButton, { tabType: 'source', uid: childEt.uid })));
                    }))))));
    };
    return SourceEditorWorkspace;
}(React.Component));
SourceEditorWorkspace.contextTypes = {
    router: React.PropTypes.object.isRequired
};
SourceEditorWorkspace = __decorate([
    mobx_react_1.inject('dataStore', 'modalStore'),
    mobx_react_1.observer,
    __metadata("design:paramtypes", [])
], SourceEditorWorkspace);
exports.SourceEditorWorkspace = SourceEditorWorkspace;
//# sourceMappingURL=SourceEditorWorkspace.js.map