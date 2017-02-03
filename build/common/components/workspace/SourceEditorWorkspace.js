/**
 * @fileOverview Predicate editor workspace
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
const SameAsEditor_1 = require("../fields/SameAsEditor");
const ApiService_1 = require("../../ApiService");
const falcon_core_1 = require("@digihum/falcon-core");
const EditableHeader_1 = require("../fields/EditableHeader");
const EditableFieldComponent_1 = require("../fields/EditableFieldComponent");
const EditableParagraph_1 = require("../fields/EditableParagraph");
const EditableComboDropdown_1 = require("../fields/EditableComboDropdown");
const lodash_1 = require("lodash");
const mobx_react_1 = require("mobx-react");
const AddTabButton_1 = require("../AddTabButton");
const HeaderEditableFieldComponent = EditableFieldComponent_1.EditableFieldHOC(EditableHeader_1.EditableHeader);
const ParagraphEditableFieldComponent = EditableFieldComponent_1.EditableFieldHOC(EditableParagraph_1.EditableParagraph);
const SameAsEditableFieldComponent = EditableFieldComponent_1.EditableFieldHOC(SameAsEditor_1.SameAsEditor);
const ComboEditableFieldComponent = EditableFieldComponent_1.EditableFieldHOC(EditableComboDropdown_1.EditableComboDropdown);
// - Should state the number of times this predicate is used
// - Widening the domain or range always okay
// - Narrowing should check for conflicts and return them
// - Asks 'Delete conflicting records?'
// - Strong check (double button press or type) to confirm
// - Changing name/description/sameAs - absolutly fine
// - Cannot change 'readonly'
let SourceEditorWorkspace = class SourceEditorWorkspace extends React.Component {
    constructor() {
        super();
        this.state = {
            metaData: {}
        };
    }
    componentDidMount() {
        this.loadData(this.props);
    }
    componentWillReceiveProps(newProps) {
        this.loadData(newProps);
    }
    loadData(props) {
        const source = props.dataStore.dataStore.tabs.source[this.props.id].value.source;
        this.setState({
            metaData: lodash_1.keyBy(source.metaData, 'name')
        });
    }
    updateSource(field, value) {
        const source = this.props.dataStore.dataStore.tabs.source[this.props.id].value.source;
        if (source.uid === null) {
            throw new Error('source uid should not be null');
        }
        this.props.dataStore.patchItem(falcon_core_1.Source, ApiService_1.AppUrls.source, source.uid, { [field]: value });
    }
    updateSourceElement(element, value) {
        const source = this.props.dataStore.dataStore.tabs.source[this.props.id].value.source;
        if (element.uid === null) {
            throw new Error('source element uid should not be null');
        }
        const compositeKey = {
            order: ['source', 'element'],
            values: {
                source: this.props.id,
                element: element.uid
            }
        };
        if (source.metaData[element.label] !== undefined
            && source.metaData[element.label].values.find((a) => a.source === this.props.id) !== undefined) {
            this.props.dataStore.patchItem(falcon_core_1.SourceElement, ApiService_1.AppUrls.source_element, compositeKey, falcon_core_1.Serializer.fromJson(falcon_core_1.SourceElement, {
                uid: compositeKey,
                element: source.metaData[element.label].element_uid,
                source: this.props.id,
                value
            }));
        }
        else {
            this.props.dataStore.postItem(falcon_core_1.SourceElement, ApiService_1.AppUrls.source_element, falcon_core_1.Serializer.fromJson(falcon_core_1.SourceElement, {
                uid: compositeKey,
                value: value
            }), {});
        }
    }
    del() {
        this.props.dataStore.delItem(falcon_core_1.Source, ApiService_1.AppUrls.source, this.props.id)
            .then(() => this.context.router.transitionTo('/edit/notfound'))
            .catch((e) => {
            if (e.code === 404) {
                this.context.router.transitionTo('/edit/notfound');
            }
            if (e.code === 422) {
                e.data.then((data) => {
                    const conflictResolutionModal = {
                        name: 'conflict_resolution',
                        cancel: () => { },
                        complete: (result) => {
                            if (result === 'addToWorkspace') {
                                data.source.forEach((datum) => {
                                    this.props.dataStore.createTab('source', datum.uid, 'item');
                                });
                            }
                            if (result === 'deleteAll') {
                                Promise.all(data.source.map((datum) => this.props.dataStore.delItem(falcon_core_1.Source, ApiService_1.AppUrls.source, datum.uid)))
                                    .then(() => {
                                    this.del();
                                });
                            }
                        },
                        settings: {
                            conflictingItems: data,
                            message: 'Deleting Source'
                        }
                    };
                    this.props.modalStore.addModal(conflictResolutionModal);
                });
            }
        });
    }
    createChild() {
        const source = this.props.dataStore.dataStore.tabs.source[this.props.id].value.source;
        const newSource = falcon_core_1.Serializer.fromJson(falcon_core_1.Source, lodash_1.omit(Object.assign({}, falcon_core_1.Serializer.toJson(source), { label: 'Child of ' + source.label, parent: this.props.id }), 'metaData', 'children', 'parents'));
        this.props.dataStore.postItem(falcon_core_1.Source, ApiService_1.AppUrls.source, newSource, {})
            .then(([id]) => {
            this.props.dataStore.createTab('source', id, 'item');
        });
    }
    // create entity with 'mentioned in' already set to this source
    createEntity() {
        const a = {
            name: 'preset_record',
            complete: ([id]) => {
                this.props.dataStore.createTab('entity', id, 'item');
            },
            cancel: () => { },
            settings: {
                source: this.props.dataStore.dataStore.tabs.source[this.props.id].value.source
            }
        };
        this.props.modalStore.addModal(a);
    }
    render() {
        const source = this.props.dataStore.dataStore.tabs.source[this.props.id].value.source;
        const potentialParents = this.props.dataStore.dataStore.all.source.value;
        let parentName = '';
        if (potentialParents !== null && source.parent !== undefined) {
            const found = potentialParents.find((par) => par.uid === source.parent);
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
                            .map((child) => this.props.dataStore.dataStore.all.source.value.find((et) => et.uid === child))
                            .map((parent, i) => {
                            if (parent === undefined) {
                                throw new Error('Encountered undefined parent');
                            }
                            if (parent.uid === null) {
                                throw new Error('Encountered parent with null uid');
                            }
                            return (React.createElement("span", { key: `breadcrumb-${parent.uid}` },
                                React.createElement("span", null,
                                    "  ",
                                    parent.label,
                                    " ",
                                    React.createElement(AddTabButton_1.AddTabButton, { tabType: 'source', uid: parent.uid }),
                                    " "),
                                React.createElement("i", { className: 'fa fa-angle-right' })));
                        })),
                        React.createElement("i", { className: 'fa fa-sun-o item-icon' }),
                        React.createElement(EditableHeader_1.EditableHeader, { value: source.label, onChange: (value) => this.updateSource('label', value) })),
                    React.createElement("div", { className: 'sub-toolbar' },
                        React.createElement("i", { className: 'fa fa-plus add button', "aria-hidden": 'true', onClick: this.createEntity.bind(this) }),
                        React.createElement("i", { className: 'fa fa-trash delete button', "aria-hidden": 'true', onClick: () => this.del() }),
                        React.createElement("i", { className: 'fa fa-arrow-circle-o-down button', "aria-hidden": 'true', onClick: this.createChild.bind(this) }))),
                React.createElement("div", { className: 'secondary-toolbar' },
                    React.createElement("div", { className: 'tab-bar' },
                        React.createElement("div", { className: 'source selected' }, "DUBLIN CORE"),
                        React.createElement("div", { className: 'source', style: { display: 'none' } }, "DETAILS"),
                        React.createElement("div", { className: 'source', style: { display: 'none' } }, "MEDIA")))),
            React.createElement("section", { className: 'editor-body' },
                React.createElement("div", { className: 'edit-group' },
                    React.createElement("label", { className: 'small' }, "Parent"),
                    React.createElement(ComboEditableFieldComponent, { value: { key: parentName, value: source.parent }, onChange: (value) => this.updateSource('parent', value === null ? null : value.value), comboSettings: {
                            options: potentialParents.map((par) => ({ key: par.label, value: par.uid })),
                            typeName: 'Source'
                        } }),
                    source.parent !== null ? (React.createElement(AddTabButton_1.AddTabButton, { tabType: 'source', uid: source.parent })) : null),
                React.createElement("div", { className: 'edit-group' },
                    React.createElement(SameAsEditableFieldComponent, { value: source.sameAs, onChange: (value) => this.updateSource('sameAs', value) })),
                this.props.dataStore.dataStore.all.dublinCore.value.elements.map((element) => {
                    const values = source.metaData.hasOwnProperty(element.label) ?
                        source.metaData[element.label].values : [{ source: this.props.id, value: '' }];
                    const editableValue = values[0].source == this.props.id ? values[0].value : '';
                    return (React.createElement("div", { key: `${element.label}-edit` },
                        React.createElement("h5", { className: 'section-header' },
                            element.label,
                            " ",
                            React.createElement("small", null,
                                React.createElement("a", { href: element.uri }, element.uri))),
                        React.createElement("p", { className: 'element-description' }, element.description),
                        React.createElement("ul", null, values.map((value) => value.source != this.props.id ? (React.createElement("li", { key: `${element.uid}-${value.source}` },
                            this.props.dataStore.dataStore.all.source.value.find((s) => s.uid === value.source).label,
                            ": ",
                            value.value)) : null)),
                        React.createElement(ParagraphEditableFieldComponent, { value: editableValue, onChange: (value) => this.updateSourceElement(element, value) })));
                }),
                React.createElement("div", null,
                    React.createElement("h4", null, "Direct Children"),
                    React.createElement("ul", null, source.children
                        .map((child) => this.props.dataStore.dataStore.all.source.value.find((et) => et.uid === child))
                        .map((childEt) => (React.createElement("li", { key: `dc-${childEt.uid}` },
                        childEt.label,
                        " ",
                        React.createElement(AddTabButton_1.AddTabButton, { tabType: 'source', uid: childEt.uid })))))))));
    }
};
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