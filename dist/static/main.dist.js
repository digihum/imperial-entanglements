webpackJsonp([0],[
/* 0 */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),
/* 1 */,
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

var itemTypes_1 = __webpack_require__(23);
exports.AppUrls = {
    element_set: itemTypes_1.itemTypes.element_set.machineName,
    record: itemTypes_1.itemTypes.record.machineName,
    entity: itemTypes_1.itemTypes.entity.machineName,
    entity_type: itemTypes_1.itemTypes.entity_type.machineName,
    predicate: itemTypes_1.itemTypes.predicate.machineName,
    source: itemTypes_1.itemTypes.source.machineName,
    source_element: itemTypes_1.itemTypes.source_element.machineName,
    element: 'element'
};
//# sourceMappingURL=ApiService.js.map

/***/ }),
/* 3 */,
/* 4 */
/***/ (function(module, exports) {

module.exports = _;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

var React = __webpack_require__(0);
var mobx_react_1 = __webpack_require__(1);
exports.AddTabButton = mobx_react_1.inject('dataStore')(mobx_react_1.observer(function (props, context) {
    if (props.dataStore.dataStore.tabs[props.tabType] !== undefined
        && props.uid in props.dataStore.dataStore.tabs[props.tabType]) {
        return (React.createElement("i", { className: 'fa fa-folder-open-o add button', title: 'Open item', onClick: function () { return context.router.transitionTo("/edit/" + props.tabType + "/" + props.uid); } }, " "));
    }
    return (React.createElement("i", { className: 'icon-list-add add button', title: 'Add to list', onClick: function () { return props.dataStore.createTab(props.tabType, props.uid, 'item', props.data); } }));
}));
exports.AddTabButton.wrappedComponent.contextTypes = {
    router: React.PropTypes.object.isRequired
};
//# sourceMappingURL=AddTabButton.js.map

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = __webpack_require__(0);
var lunr = __webpack_require__(94);
var lodash_1 = __webpack_require__(4);
var ComboDropdown = (function (_super) {
    __extends(ComboDropdown, _super);
    function ComboDropdown() {
        var _this = _super.call(this) || this;
        _this.state = {
            searchString: '',
            showingDropDown: false,
            filteredOptions: [],
            highlightedIndex: null,
            dropDownHeight: 0
        };
        return _this;
    }
    ComboDropdown.prototype.componentWillMount = function () {
        this.ignoreBlur = false;
        this.ignoreClick = false;
        this.recalculateHeight = true;
        this.dropDownBoxElement = null;
        this.setState({
            filteredOptions: this.props.options,
            searchString: this.props.value === null || this.props.value.key === null ? '' : this.props.value.key
        });
    };
    ComboDropdown.prototype.componentWillReceiveProps = function (newProps) {
        var filterString = '';
        if (this.props.value === null) {
            if (newProps.value === null) {
                // change nothing
                filterString = this.state.searchString;
            }
            else {
                // set to newProps value
                filterString = newProps.value.key;
            }
        }
        else {
            if (newProps.value === null) {
                // set to ''
                filterString = '';
            }
            else {
                if (newProps.value === this.props.value) {
                    // change nothing
                    filterString = this.state.searchString;
                }
                else {
                    // set to newProps value
                    filterString = newProps.value.key;
                }
            }
        }
        //const filterString = newProps.value.key !== this.props.value.key ? newProps.value.key : this.state.searchString;
        this.updateFilter(filterString, newProps);
        this.setState({
            searchString: filterString
        });
    };
    ComboDropdown.prototype.changeSearchString = function (event) {
        var _this = this;
        this.setState({
            searchString: event.target.value,
            showingDropDown: true
        }, function () {
            _this.updateFilter(_this.state.searchString, _this.props);
            if (_this.props.updateSearchString !== undefined) {
                _this.props.updateSearchString(_this.state.searchString);
            }
        });
    };
    ComboDropdown.prototype.updateSearchString = function (s) {
        if (this.props.updateSearchString !== undefined) {
            this.props.updateSearchString(s);
        }
    };
    ComboDropdown.prototype.updateFilter = function (filter, props) {
        var filtered = [];
        if (filter.length > 0) {
            var idx_1 = lunr(function () {
                this.field('key', { boost: 10 });
            });
            props.options.forEach(function (opt, i) { return idx_1.add(Object.assign({}, opt, { id: i })); });
            var result = idx_1.search(filter);
            for (var i = 0; i < result.length; i += 1) {
                filtered.push(props.options[result[i].ref]);
            }
        }
        else {
            filtered = props.options;
        }
        if (this.dropDownBoxElement !== null) {
            this.recalculateHeight = true;
            this.calculateDropdownHeight(this.dropDownBoxElement);
        }
        this.setState({
            filteredOptions: filtered
        });
    };
    ComboDropdown.prototype.addNewAction = function (option) {
        this.props.createNewValue(option);
    };
    ComboDropdown.prototype.selectOption = function (option) {
        this.props.setValue(option);
        this.ignoreBlur = false;
        this.recalculateHeight = true;
        this.setState({ showingDropDown: false, searchString: option.key });
        this.updateSearchString(option.key);
    };
    ComboDropdown.prototype.handleInputBlur = function () {
        var _this = this;
        if (!this.ignoreBlur) {
            if (this.state.searchString.length === 0) {
                this.setState({ searchString: '' });
            }
            else {
                if (lodash_1.findIndex(this.props.options, function (option) { return option.key === _this.state.searchString; }) === -1) {
                    this.setState({ searchString: this.props.value === null ? '' : this.props.value.key }, function () {
                        _this.updateFilter(_this.props.value === null ? '' : _this.props.value.key, _this.props);
                    });
                }
            }
            this.recalculateHeight = true;
            this.setState({
                showingDropDown: false
            });
        }
    };
    ComboDropdown.prototype.handleInputFocus = function () {
        if (this.ignoreBlur) {
            this.ignoreBlur = true;
            return;
        }
        // We don't want `selectItemFromMouse` to trigger when
        // the user clicks into the input to focus it, so set this
        // flag to cancel out the logic in `handleInputClick`.
        // The event order is:  MouseDown -> Focus -> MouseUp -> Click
        this.ignoreClick = true;
        this.setState({ showingDropDown: true });
    };
    ComboDropdown.prototype.handleInputClick = function () {
        // Input will not be focused if it's disabled
        if (this.isInputFocused() && this.state.showingDropDown === false) {
            this.setState({ showingDropDown: true });
        }
        else {
            if (this.state.highlightedIndex !== null && !this.ignoreClick) {
                this.selectItemFromMouse(this.state.filteredOptions[this.state.highlightedIndex]);
            }
            else {
                this.ignoreClick = false;
            }
        }
    };
    ComboDropdown.prototype.selectItemFromMouse = function (item) {
        var _this = this;
        this.recalculateHeight = true;
        this.setState({
            showingDropDown: false,
            highlightedIndex: null
        }, function () {
            _this.props.setValue(item);
            _this.refs[ComboDropdown.comboDropdownInputBoxRef].focus();
        });
    };
    ComboDropdown.prototype.isInputFocused = function () {
        var el = this.refs[ComboDropdown.comboDropdownInputBoxRef];
        return el.ownerDocument && (el === el.ownerDocument.activeElement);
    };
    ComboDropdown.prototype.clearSearchBox = function () {
        this.props.setValue(null);
        this.setState({ searchString: '' });
        this.refs[ComboDropdown.comboDropdownInputBoxRef].focus();
    };
    ComboDropdown.prototype.calculateDropdownHeight = function (val) {
        this.dropDownBoxElement = val;
        if (val === null || !this.recalculateHeight) {
            return;
        }
        else {
            this.setState({
                dropDownHeight: window.document.body.getBoundingClientRect().bottom - val.getBoundingClientRect().top - 32
            });
            this.recalculateHeight = false;
        }
    };
    ComboDropdown.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { className: 'combo-dropdown ' + this.props.additionalClasses.join(' ') },
            React.createElement("div", null,
                React.createElement("input", { type: 'text', ref: ComboDropdown.comboDropdownInputBoxRef, className: 'search-input', value: this.state.searchString, placeholder: 'Click here and start typing..', onBlur: this.handleInputBlur.bind(this), onFocus: this.handleInputFocus.bind(this), onChange: this.changeSearchString.bind(this), onClick: this.handleInputClick.bind(this) }),
                this.state.searchString.length > 0 ? (React.createElement("i", { className: 'fa fa-times clear-button', onClick: this.clearSearchBox.bind(this) })) : null),
            this.state.showingDropDown ? (React.createElement("div", { className: 'dropdown', style: { maxHeight: this.state.dropDownHeight, overflowY: 'auto' }, ref: this.calculateDropdownHeight.bind(this) },
                React.createElement("ul", null,
                    this.state.searchString.length === 0 && this.props.allowNew ? (React.createElement("li", { className: 'add', onMouseDown: function () { return _this.ignoreBlur = true; }, onClick: function () { return _this.addNewAction(''); } },
                        React.createElement("i", { className: 'fa fa-plus', "aria-hidden": 'true' }),
                        "Add new ",
                        this.props.typeName)) : null,
                    this.state.filteredOptions.map(function (opt, i) { return (React.createElement("li", { key: "opt-" + opt.key + "-" + i, onMouseDown: function () { return _this.ignoreBlur = true; }, onClick: function () { return _this.selectOption(opt); } }, opt.key)); }),
                    this.state.searchString.length > 0 && this.props.allowNew ? (React.createElement("li", { className: 'add', onMouseDown: function () { return _this.ignoreBlur = true; }, onClick: function () { return _this.addNewAction(_this.state.searchString); } },
                        React.createElement("i", { className: 'fa fa-plus', "aria-hidden": 'true' }),
                        "Add new ",
                        this.props.typeName,
                        ": '",
                        this.state.searchString,
                        "'")) : null))) : null));
    };
    return ComboDropdown;
}(React.Component));
ComboDropdown.defaultProps = {
    allowNew: true,
    additionalClasses: [],
    updateSearchString: lodash_1.noop
};
ComboDropdown.comboDropdownInputBoxRef = 'comboDropDownInputBox';
exports.ComboDropdown = ComboDropdown;
var NumberComboDropdown = (function (_super) {
    __extends(NumberComboDropdown, _super);
    function NumberComboDropdown() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return NumberComboDropdown;
}(ComboDropdown));
exports.NumberComboDropdown = NumberComboDropdown;
var StringComboDropdown = (function (_super) {
    __extends(StringComboDropdown, _super);
    function StringComboDropdown() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return StringComboDropdown;
}(ComboDropdown));
exports.StringComboDropdown = StringComboDropdown;
//# sourceMappingURL=ComboDropdown.js.map

/***/ }),
/* 7 */,
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = __webpack_require__(0);
var Overlay = (function (_super) {
    __extends(Overlay, _super);
    function Overlay() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Overlay.prototype.render = function () {
        return (React.createElement("div", { className: 'full-page-overlay' },
            React.createElement("div", { className: 'overlay-container' }, this.props.children)));
    };
    return Overlay;
}(React.Component));
exports.Overlay = Overlay;
;
//# sourceMappingURL=Overlay.js.map

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var React = __webpack_require__(0);
function EditableFieldHOC(WrappedComponent) {
    return (function (_super) {
        __extends(EditableFieldComponent, _super);
        function EditableFieldComponent() {
            var _this = _super.call(this) || this;
            _this.state = {
                edit: false,
                internalValue: null
            };
            return _this;
        }
        EditableFieldComponent.prototype.componentWillMount = function () {
            this.setState({ internalValue: this.props.value === undefined ? null : this.props.value });
        };
        EditableFieldComponent.prototype.componentWillReceiveProps = function (newProps) {
            this.setState({ internalValue: newProps.value });
        };
        EditableFieldComponent.prototype.switchToEditState = function () {
            this.setState({ edit: true, internalValue: this.props.value });
        };
        EditableFieldComponent.prototype.setInternalValue = function (internalValue) {
            this.setState({ internalValue: internalValue });
        };
        EditableFieldComponent.prototype.acceptChanges = function () {
            this.props.onChange(this.state.internalValue);
            this.setState({ edit: false });
        };
        EditableFieldComponent.prototype.cancelChanges = function () {
            this.setState({ edit: false, internalValue: this.props.value });
        };
        EditableFieldComponent.prototype.render = function () {
            var _this = this;
            return (React.createElement(WrappedComponent, __assign({}, this.props, { edit: this.state.edit, value: this.state.internalValue, onChange: this.setInternalValue.bind(this), setEdit: this.switchToEditState.bind(this), acceptChanges: this.acceptChanges.bind(this), cancelChanges: this.cancelChanges.bind(this), onDelete: function (e) { return _this.props.onDelete !== undefined ? _this.props.onDelete(_this.props.value) : null; } })));
        };
        return EditableFieldComponent;
    }(React.Component));
}
exports.EditableFieldHOC = EditableFieldHOC;
//# sourceMappingURL=EditableFieldComponent.js.map

/***/ }),
/* 10 */,
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

var React = __webpack_require__(0);
exports.SearchBar = function (props) {
    var filterFunc = function (s) {
        return function (a) {
            if (s.length === 0) {
                return true;
            }
            return props.getValue(a).toLowerCase().indexOf(s.toLowerCase()) !== -1;
        };
    };
    return (React.createElement("div", null,
        React.createElement("div", { className: 'input-addon-formgroup' },
            React.createElement("span", { className: 'input-addon-icon' },
                React.createElement("i", { className: 'fa fa-search fa-fw' })),
            React.createElement("input", { type: 'text', className: 'form-control with-addon', onChange: function (e) { return props.setFilterFunc(filterFunc(e.target.value)); } }))));
};
//# sourceMappingURL=SearchBar.js.map

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

var React = __webpack_require__(0);
exports.EditableHeader = function (props) {
    if (!props.edit || props.value == null) {
        return (React.createElement("h2", null,
            props.value,
            React.createElement("sup", null,
                React.createElement("i", { className: 'fa fa-pencil-square-o', title: 'Edit', "aria-hidden": 'true', onClick: props.setEdit }))));
    }
    else {
        return (React.createElement("span", null,
            React.createElement("input", { type: 'text', value: props.value, className: 'text-edit-header', onChange: function (e) { return props.onChange(e.target.value); } }),
            React.createElement("button", { onClick: props.acceptChanges },
                React.createElement("i", { className: 'fa fa-check', "aria-hidden": 'true' })),
            React.createElement("button", { onClick: props.cancelChanges },
                React.createElement("i", { className: 'fa fa-times', "aria-hidden": 'true' }))));
    }
};
//# sourceMappingURL=EditableHeader.js.map

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = mobx_lib;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var React = __webpack_require__(0);
var ComboDropdown_1 = __webpack_require__(6);
function EditableComboDropdown(props) {
    if (props.edit) {
        return (React.createElement("div", null,
            React.createElement(ComboDropdown_1.NumberComboDropdown, __assign({}, props.comboSettings, { value: props.value, setValue: props.onChange, allowNew: false, createNewValue: function () { } })),
            React.createElement("button", { onClick: props.acceptChanges },
                React.createElement("i", { className: 'fa fa-check', "aria-hidden": 'true' })),
            React.createElement("button", { onClick: props.cancelChanges },
                React.createElement("i", { className: 'fa fa-times', "aria-hidden": 'true' }))));
    }
    else {
        return (React.createElement("div", null,
            props.value !== null && props.value.key.length > 0 ? props.value.key
                : (React.createElement("em", null, "No value")),
            React.createElement("sup", null,
                React.createElement("i", { className: 'fa fa-pencil-square-o', title: 'Edit', "aria-hidden": 'true', onClick: props.setEdit }))));
    }
}
exports.EditableComboDropdown = EditableComboDropdown;
;
//# sourceMappingURL=EditableComboDropdown.js.map

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

var React = __webpack_require__(0);
var mousetrap = __webpack_require__(10);
exports.EditableParagraph = function (props) {
    var keyBoardShortcuts;
    var bindKeyboard = function (val) {
        if (val !== null) {
            val.focus();
            keyBoardShortcuts = new mousetrap(val);
            keyBoardShortcuts.bind('ctrl+return', props.acceptChanges);
            keyBoardShortcuts.bind('escape', props.cancelChanges);
        }
        else {
            keyBoardShortcuts.unbind('ctrl+return');
        }
    };
    if (!props.edit) {
        return (React.createElement("div", { onClick: props.setEdit, className: 'editable-paragraph-box' },
            React.createElement("p", null,
                props.value === null || props.value.length > 0 ? props.value
                    : (React.createElement("em", null, "No value")),
                React.createElement("sup", null,
                    React.createElement("i", { className: 'fa fa-pencil-square-o', title: 'Edit', "aria-hidden": 'true' })))));
    }
    else {
        return (React.createElement("div", null,
            React.createElement("textarea", { value: props.value === null ? '' : props.value, ref: bindKeyboard, onChange: function (e) { return props.onChange(e.target.value); }, style: { width: '100%', height: '6em' } }),
            React.createElement("button", { onClick: props.acceptChanges },
                React.createElement("i", { className: 'fa fa-check', "aria-hidden": 'true' })),
            React.createElement("button", { onClick: props.cancelChanges },
                React.createElement("i", { className: 'fa fa-times', "aria-hidden": 'true' }))));
    }
};
//# sourceMappingURL=EditableParagraph.js.map

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = __webpack_require__(0);
var mousetrap = __webpack_require__(10);
var SameAsEditor = (function (_super) {
    __extends(SameAsEditor, _super);
    function SameAsEditor(props) {
        var _this = _super.call(this) || this;
        _this.state = {
            temporaryValue: '',
            urls: props.value === null || props.value.length === 0 ? [] : props.value.split(',')
        };
        return _this;
    }
    SameAsEditor.prototype.componentWillReceiveProps = function (props) {
        this.setState({
            temporaryValue: '',
            urls: props.value === null || props.value.length === 0 ? [] : props.value.split(',')
        });
    };
    SameAsEditor.prototype.addItemToList = function () {
        var _this = this;
        if (this.state.temporaryValue.length === 0) {
            return;
        }
        this.setState({ urls: this.state.urls.concat([this.state.temporaryValue]), temporaryValue: '' }, function () { return _this.props.onChange(_this.state.urls.join(',')); });
    };
    SameAsEditor.prototype.removeItemFromList = function (itemId) {
        var _this = this;
        this.setState({
            urls: this.state.urls.filter(function (val, i) { return i !== itemId; })
        }, function () { return _this.props.onChange(_this.state.urls.join(',')); });
    };
    SameAsEditor.prototype.setupKeyboardShortcuts = function (val) {
        var _this = this;
        if (val !== null) {
            val.focus();
            this.keyboardShortcuts = new mousetrap(val);
            this.keyboardShortcuts.bind('return', this.addItemToList.bind(this));
            this.keyboardShortcuts.bind('escape', this.props.cancelChanges);
            this.keyboardShortcuts.bind('ctrl+s', function (e) {
                if (e.preventDefault) {
                    e.preventDefault();
                }
                else {
                    // internet explorer
                    e.returnValue = false;
                }
                _this.props.acceptChanges();
            });
        }
        else {
            this.keyboardShortcuts.unbind('return');
            this.keyboardShortcuts.unbind('escape');
            this.keyboardShortcuts.unbind('ctrl+s');
        }
    };
    SameAsEditor.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { className: 'same-as-box' },
            React.createElement("label", { className: 'small' },
                "Same As ",
                !this.props.edit ? (React.createElement("sup", null,
                    React.createElement("i", { className: 'fa fa-pencil-square-o', title: 'Edit', "aria-hidden": 'true', onClick: this.props.setEdit }))) : null),
            this.props.edit ? (React.createElement("div", { className: 'edit-group' },
                React.createElement("button", { onClick: this.props.acceptChanges },
                    React.createElement("i", { className: 'fa fa-check', "aria-hidden": 'true' })),
                React.createElement("button", { onClick: this.props.cancelChanges },
                    React.createElement("i", { className: 'fa fa-times', "aria-hidden": 'true' })),
                React.createElement("div", { className: 'input-addon-formgroup' },
                    React.createElement("input", { type: 'text', value: this.state.temporaryValue, ref: this.setupKeyboardShortcuts.bind(this), onChange: function (e) { return _this.setState({ temporaryValue: e.target.value }); }, className: 'form-control with-addon' }),
                    React.createElement("span", { className: 'input-addon-icon right button', onClick: this.addItemToList.bind(this) },
                        React.createElement("i", { className: 'fa fa-plus' }))))) : null,
            React.createElement("ul", { className: 'same-as-list' }, this.state.urls.map(function (url, i) { return (React.createElement("li", { key: "li-" + url },
                React.createElement("a", { target: '_blank', href: url }, url),
                " ",
                _this.props.edit ? (React.createElement("i", { className: 'fa fa-times close-button', onClick: _this.removeItemFromList.bind(_this, i) })) : null)); }))));
    };
    return SameAsEditor;
}(React.Component));
exports.SameAsEditor = SameAsEditor;
//# sourceMappingURL=SameAsEditor.js.map

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

exports.findParentTree = function (uid, data, ancestors) {
    if (ancestors === void 0) { ancestors = []; }
    var current = data.find(function (datum) { return datum.uid === uid; });
    if (current === undefined) {
        console.warn('Couldn\'t find parent');
        return ancestors;
    }
    else {
        if (current.parent === null || current.uid === null) {
            if (current.uid === null) {
                console.warn('Found entity will null uid');
                return ancestors;
            }
            else {
                return ancestors.concat([current.uid]);
            }
        }
        else {
            return exports.findParentTree(current.parent, data, ancestors.concat([current.uid]));
        }
    }
};
//# sourceMappingURL=findParentTree.js.map

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

var moment = __webpack_require__(19);
exports.formatDate = function (str) {
    if (str === null || str.length === 0) {
        return '';
    }
    var modifier = {
        '=': '',
        '>': 'After ',
        '<': 'Before '
    }[str[0]];
    var year = str.substr(1, 4);
    var rawMonth = parseInt(str.substr(5, 2)) - 1;
    var month = rawMonth === -1 || isNaN(rawMonth) ? 'Unknown' : moment.months()[rawMonth];
    var rawDay = parseInt(str.substr(7, 2));
    var day = rawDay > 0 ? rawDay : '';
    return modifier + " " + day + " " + month + " " + year;
};
//# sourceMappingURL=formatDate.js.map

/***/ }),
/* 19 */,
/* 20 */,
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = __webpack_require__(0);
var AddTabButton_1 = __webpack_require__(5);
var RecursiveTree = (function (_super) {
    __extends(RecursiveTree, _super);
    function RecursiveTree() {
        var _this = _super.call(this) || this;
        _this.state = { collapsed: false };
        return _this;
    }
    RecursiveTree.prototype.render = function () {
        var _this = this;
        var filtered = this.props.data.filter(function (datum) { return datum.parent === _this.props.parentId; });
        if (filtered.length === 0) {
            return null;
        }
        return (React.createElement("div", null, filtered.map(function (item) { return (React.createElement("div", { key: item.label },
            React.createElement("div", { className: 'tree-label', onClick: function () { return _this.setState({ collapsed: !_this.state.collapsed }); } },
                "- ",
                item.label,
                " ",
                React.createElement(AddTabButton_1.AddTabButton, { uid: item.uid, tabType: _this.props.tabType })),
            !_this.state.collapsed ? (React.createElement("div", { className: 'tree-children' },
                React.createElement(RecursiveTree, { dataStore: _this.props.dataStore, data: _this.props.data, tabType: _this.props.tabType, parentId: item.uid }))) : null)); })));
    };
    return RecursiveTree;
}(React.Component));
exports.RecursiveTree = RecursiveTree;
//# sourceMappingURL=RecursiveTree.js.map

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = __webpack_require__(0);
var ComboDropdown_1 = __webpack_require__(6);
var lodash_1 = __webpack_require__(4);
var PredicateRangeComboDropdown = (function (_super) {
    __extends(PredicateRangeComboDropdown, _super);
    function PredicateRangeComboDropdown() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PredicateRangeComboDropdown;
}(ComboDropdown_1.ComboDropdown));
exports.PredicateRangeComboDropdown = PredicateRangeComboDropdown;
var PredicateDescription = (function (_super) {
    __extends(PredicateDescription, _super);
    function PredicateDescription() {
        var _this = _super.call(this) || this;
        _this.state = {
            editingDomain: false,
            editingRange: false,
            rangeValue: { key: '', value: null },
            domainValue: { key: '', value: null }
        };
        return _this;
    }
    PredicateDescription.prototype.componentWillMount = function () {
        this.setState({
            rangeValue: this.props.range,
            domainValue: this.props.domain
        });
    };
    PredicateDescription.prototype.componentWillReceiveProps = function (newProps) {
        this.setState({
            rangeValue: newProps.range,
            domainValue: newProps.domain
        });
    };
    PredicateDescription.prototype.acceptDomainChanges = function () {
        this.props.domainChanged(this.state.domainValue);
        this.setState({ editingDomain: false });
    };
    PredicateDescription.prototype.cancelDomainChanges = function () {
        this.setState({ editingDomain: false, domainValue: this.props.domain });
    };
    PredicateDescription.prototype.acceptRangeChanges = function () {
        this.props.rangeChanged(this.state.rangeValue);
        this.setState({ editingRange: false });
    };
    PredicateDescription.prototype.cancelRangeChanges = function () {
        this.setState({ editingDomain: false, rangeValue: this.props.range });
    };
    //  <label className='small'>Property Class</label>
    //   <section className='class'>
    //     <input type='radio' name='property-class' value='ObjectProperty' /> Object Property <small>Links to another entity</small><br/>
    //     <input type='radio' name='property-class' value='DataTypeProperty' /> Data Type Property <small>Links to some data, like text or a date</small><br/>
    //     <input type='radio' name='property-class' value='SourceProperty' /> Source Property <small>Links to a source</small><br/>
    //   </section>
    //   <label className='small'>Typing</label>
    PredicateDescription.prototype.render = function () {
        var _this = this;
        var domainChanged = this.props.mode === 'editAll' ?
            this.props.domainChanged : function (c) { return _this.setState({ domainValue: c }); };
        var rangeChanged = this.props.mode === 'editAll' ?
            this.props.rangeChanged : function (c) { return _this.setState({ rangeValue: c }); };
        return (React.createElement("div", { className: 'predicate-function-description' },
            React.createElement("div", { className: 'typing' },
                React.createElement("div", { className: 'domain' }, this.props.mode === 'editAll' || this.state.editingDomain ? (React.createElement("div", null,
                    React.createElement("label", { className: 'small' }, "Domain"),
                    React.createElement(ComboDropdown_1.NumberComboDropdown, { options: this.props.domainOptions, typeName: 'entity type', allowNew: false, value: this.state.domainValue, setValue: domainChanged, createNewValue: lodash_1.noop }),
                    this.props.mode === 'editSingle' ? (React.createElement("div", null,
                        React.createElement("button", { onClick: this.acceptDomainChanges.bind(this) },
                            React.createElement("i", { className: 'fa fa-check', "aria-hidden": 'true' })),
                        React.createElement("button", { onClick: this.cancelDomainChanges.bind(this) },
                            React.createElement("i", { className: 'fa fa-times', "aria-hidden": 'true' })))) : null)) : (React.createElement("div", null,
                    this.props.domain.key,
                    " ",
                    React.createElement("i", { className: 'fa fa-pencil-square-o', title: 'Edit', "aria-hidden": 'true', onClick: function () { return _this.setState({ editingDomain: true }); } })))),
                React.createElement("div", { className: 'arrow' },
                    React.createElement("i", { className: 'fa fa-long-arrow-right', "aria-hidden": 'true' })),
                React.createElement("div", { className: 'range' }, this.props.mode === 'editAll' || this.state.editingRange ? (React.createElement("div", null,
                    React.createElement("label", { className: 'small' }, "Range"),
                    React.createElement(PredicateRangeComboDropdown, { options: this.props.rangeOptions, typeName: 'entity type', allowNew: false, value: this.state.rangeValue, setValue: rangeChanged, createNewValue: lodash_1.noop }),
                    this.props.mode === 'editSingle' ? (React.createElement("div", null,
                        React.createElement("button", { onClick: this.acceptRangeChanges.bind(this) },
                            React.createElement("i", { className: 'fa fa-check', "aria-hidden": 'true' })),
                        React.createElement("button", { onClick: this.cancelRangeChanges.bind(this) },
                            React.createElement("i", { className: 'fa fa-times', "aria-hidden": 'true' })))) : null)) : (React.createElement("div", null,
                    this.props.range.key,
                    " ",
                    React.createElement("i", { className: 'fa fa-pencil-square-o', title: 'Edit', "aria-hidden": 'true', onClick: function () { return _this.setState({ editingRange: true }); } })))))));
    };
    return PredicateDescription;
}(React.Component));
exports.PredicateDescription = PredicateDescription;
//# sourceMappingURL=PredicateDescription.js.map

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

var falcon_core_1 = __webpack_require__(3);
var simpleKey = function (raw) {
    return parseInt(raw[0]);
};
exports.itemTypes = {
    element_set: {
        machineName: 'element_set',
        name: 'Element Set',
        plural: 'Element Sets',
        workspace: '',
        buildKey: simpleKey,
        item: falcon_core_1.ElementSet
    },
    element: {
        machineName: 'element',
        name: 'Element',
        plural: 'Elements',
        workspace: '',
        buildKey: simpleKey,
        item: falcon_core_1.Element
    },
    record: {
        machineName: 'record',
        name: 'Record',
        plural: 'Records',
        workspace: '',
        buildKey: simpleKey,
        item: falcon_core_1.Record
    },
    entity: {
        machineName: 'entity',
        name: 'Entity',
        plural: 'Entities',
        workspace: 'entity',
        buildKey: simpleKey,
        item: falcon_core_1.Entity
    },
    entity_type: {
        machineName: 'entity_type',
        name: 'Entity Type',
        plural: 'Entity Types',
        workspace: 'entity_type',
        buildKey: simpleKey,
        item: falcon_core_1.EntityType
    },
    predicate: {
        machineName: 'predicate',
        name: 'Property',
        plural: 'Properties',
        workspace: 'predicate',
        buildKey: simpleKey,
        item: falcon_core_1.Predicate
    },
    source: {
        machineName: 'source',
        name: 'Source',
        plural: 'Sources',
        workspace: 'source',
        buildKey: simpleKey,
        item: falcon_core_1.Source
    },
    source_element: {
        machineName: 'source_element',
        name: 'Source Element',
        plural: 'Source Elements',
        workspace: '',
        buildKey: function (raw) { return ({
            order: ['source', 'element'],
            values: {
                source: parseInt(raw[0]),
                element: parseInt(raw[1])
            }
        }); },
        item: falcon_core_1.SourceElement
    }
};
//# sourceMappingURL=itemTypes.js.map

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

exports.literalTypes = [
    { label: 'text', value: 'string', url: '', description: 'some text' },
    { label: 'number', value: 'integer', url: '', description: 'a number' },
    { label: 'date', value: 'date', url: '', description: 'a date' },
    // { name: 'point', value: 'point', url: '', description: 'a point on a map '},
    // { name: 'region', value: 'region', url: '', description: 'a region on a map'},
    { label: 'source', value: 'source', url: '', description: 'a source in the database' }
];
//# sourceMappingURL=literalTypes.js.map

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

var React = __webpack_require__(0);
var react_router_1 = __webpack_require__(7);
exports.StatsGrid = function (props) {
    return (React.createElement("section", { className: 'stats-grid' },
        React.createElement(react_router_1.Link, { to: '/edit/entity' },
            React.createElement("div", { className: 'entity' },
                React.createElement("span", { className: 'item-name' }, "Entities"),
                React.createElement("span", { className: 'item-count' }, props.stats.entity))),
        React.createElement(react_router_1.Link, { to: '/edit/entity_type' },
            React.createElement("div", { className: 'entity_type' },
                React.createElement("span", { className: 'item-name' }, "Entity Types"),
                React.createElement("span", { className: 'item-count' }, props.stats.entityType))),
        React.createElement(react_router_1.Link, { to: '/edit/source' },
            React.createElement("div", { className: 'source' },
                React.createElement("span", { className: 'item-name' }, "Sources"),
                React.createElement("span", { className: 'item-count' }, props.stats.source))),
        React.createElement(react_router_1.Link, { to: '/edit/predicate' },
            React.createElement("div", { className: 'predicate' },
                React.createElement("span", { className: 'item-name' }, "Properties"),
                React.createElement("span", { className: 'item-count' }, props.stats.predicate))),
        React.createElement("div", { className: 'record' },
            React.createElement("span", { className: 'item-name' }, "Records"),
            React.createElement("span", { className: 'item-count' }, props.stats.record))));
};
//# sourceMappingURL=StatsGrid.js.map

/***/ }),
/* 26 */,
/* 27 */
/***/ (function(module, exports) {

module.exports = react_lib;

/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = utility_lib;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

var falcon_core_1 = __webpack_require__(3);
var queryString = __webpack_require__(92);
var lodash_1 = __webpack_require__(4);
var Exceptions_1 = __webpack_require__(33);
var ApiService_1 = __webpack_require__(2);
exports.AppUrls = ApiService_1.AppUrls;
function handleErrors(response) {
    if (!response.ok) {
        if (response.status === 422) {
            throw new Exceptions_1.UnprocessableEntity(response.statusText, response.json().then(function (result) { return result.data; }));
        }
        // showToast.dispatch('Something went wrong ;(', response.statusText);
        if (response.status === 404) {
            throw new Exceptions_1.KeyNotFoundException(JSON.stringify({
                statusText: response.statusText,
                status: response.status
            }));
        }
    }
    return response;
}
var ClientApiService = (function () {
    function ClientApiService() {
    }
    ClientApiService.prototype.getItem = function (obj, baseUrl, uid) {
        var endURL = lodash_1.isObject(uid) ?
            uid.order.map(function (key) { return uid.values[key]; }).join('/')
            : uid.toString();
        return fetch("/api/v1/" + baseUrl + "/" + endURL)
            .then(handleErrors)
            .then(function (response) { return response.json(); })
            .then(function (data) { return falcon_core_1.Serializer.fromJson(obj, data); });
    };
    ClientApiService.prototype.getCollection = function (obj, baseUrl, params) {
        return fetch("/api/v1/" + baseUrl + "?" + queryString.stringify(params))
            .then(handleErrors)
            .then(function (response) { return response.json(); })
            .then(function (data) { return data.map(function (datum) { return falcon_core_1.Serializer.fromJson(obj, datum); }); });
    };
    ClientApiService.prototype.postItem = function (obj, baseUrl, data, params) {
        return fetch("/api/v1/" + baseUrl + "?" + queryString.stringify(params), {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin'
        })
            .then(handleErrors)
            .then(function (response) {
            return response.json();
        }).then(function (data) {
            return Promise.resolve(data);
        });
    };
    ClientApiService.prototype.putItem = function (obj, baseUrl, uid, data) {
        var endURL = lodash_1.isObject(uid) ?
            uid.order.map(function (key) { return uid.values[key]; }).join('/')
            : uid.toString();
        return fetch("/api/v1/" + baseUrl + "/" + endURL, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin'
        })
            .then(handleErrors);
    };
    ClientApiService.prototype.patchItem = function (obj, baseUrl, uid, data) {
        var endURL = lodash_1.isObject(uid) ?
            uid.order.map(function (key) { return uid.values[key]; }).join('/')
            : uid.toString();
        return fetch("/api/v1/" + baseUrl + "/" + endURL, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin'
        })
            .then(handleErrors);
    };
    ClientApiService.prototype.delItem = function (obj, baseUrl, uid) {
        var endURL = lodash_1.isObject(uid) ?
            uid.order.map(function (key) { return uid.values[key]; }).join('/')
            : uid.toString();
        return fetch("/api/v1/" + baseUrl + "/" + endURL, {
            method: 'DELETE',
            credentials: 'same-origin'
        })
            .then(handleErrors);
    };
    ClientApiService.prototype.query = function (graphQLQueryString) {
        return fetch('/api/v1/query?query=' + graphQLQueryString)
            .then(handleErrors)
            .then(function (response) { return response.json(); });
    };
    ClientApiService.prototype.getStats = function () {
        return fetch('/stats', { credentials: 'same-origin' })
            .then(handleErrors)
            .then(function (response) { return response.json(); });
    };
    return ClientApiService;
}());
exports.ClientApiService = ClientApiService;
//# sourceMappingURL=ClientApiService.js.map

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
//https://react-router.now.sh/Match
var React = __webpack_require__(0);
var react_router_1 = __webpack_require__(7);
var RouteNotFound_1 = __webpack_require__(77);
var ApiService_1 = __webpack_require__(2);
var itemTypes_1 = __webpack_require__(23);
var Admin_1 = __webpack_require__(73);
var AdminApp_1 = __webpack_require__(32);
var User_1 = __webpack_require__(78);
var UserManagement_1 = __webpack_require__(79);
var AppDownload_1 = __webpack_require__(74);
var DatabaseUpload_1 = __webpack_require__(75);
var react_router_2 = __webpack_require__(7);
var ObjectEditor_1 = __webpack_require__(76);
var FalconApp = (function (_super) {
    __extends(FalconApp, _super);
    function FalconApp(props) {
        var _this = _super.call(this) || this;
        _this.state = {
            user: '',
            stats: null,
            tabsets: []
        };
        return _this;
    }
    FalconApp.prototype.componentDidMount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var userData, tabsets;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.props.environment === 'website' && window !== undefined)) return [3 /*break*/, 3];
                        return [4 /*yield*/, fetch('/currentuser', { credentials: 'same-origin' })
                                .then(function (response) { return response.json(); })];
                    case 1:
                        userData = _a.sent();
                        return [4 /*yield*/, fetch('/tabset', { credentials: 'same-origin' })
                                .then(function (response) { return response.json(); })];
                    case 2:
                        tabsets = _a.sent();
                        this.setState({ user: userData.username, tabsets: tabsets });
                        _a.label = 3;
                    case 3:
                        this.props.api.getStats()
                            .then(function (stats) {
                            _this.setState({ stats: stats });
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    FalconApp.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { id: 'main', className: 'flex-fill' },
            React.createElement(this.props.router, __assign({}, this.props.routerSettings, { className: 'flex-fill', basename: 'http://localhost:8080' }),
                React.createElement("div", { className: 'flex-fill', style: { flexDirection: 'column' } },
                    React.createElement("div", { className: 'header' },
                        React.createElement(react_router_2.Link, { to: '/', className: 'logo-link' },
                            React.createElement("div", { className: 'logo' }, "VRE")),
                        React.createElement(react_router_2.Link, { to: '/', className: 'header-link' }, "Home"),
                        React.createElement(react_router_2.Link, { accessKey: 's', to: '/edit/' + ApiService_1.AppUrls.source, className: 'header-link source' }, itemTypes_1.itemTypes.source.plural),
                        React.createElement(react_router_2.Link, { accessKey: 'e', to: '/edit/' + ApiService_1.AppUrls.entity, className: 'header-link entity' }, itemTypes_1.itemTypes.entity.plural),
                        React.createElement(react_router_2.Link, { accessKey: 'p', to: '/edit/' + ApiService_1.AppUrls.predicate, className: 'header-link predicate' }, itemTypes_1.itemTypes.predicate.plural),
                        React.createElement(react_router_2.Link, { accessKey: 't', to: '/edit/' + ApiService_1.AppUrls.entity_type, className: 'header-link entity_type' }, itemTypes_1.itemTypes.entity_type.plural),
                        this.props.environment === 'website' ? (React.createElement("div", { className: 'right-header' },
                            React.createElement(react_router_2.Link, { to: '/user', className: 'header-link' },
                                React.createElement("span", { className: 'current-user' }, this.state.user)),
                            React.createElement("a", { href: '/logout', className: 'header-link' }, "Logout"),
                            React.createElement("a", { href: '/', className: 'header-link' },
                                React.createElement("i", { className: 'fa fa-external-link' })))) : null),
                    this.props.environment === 'website' ? (React.createElement(react_router_1.Match, { exactly: true, pattern: '/', render: function (matchprops) { return (React.createElement(Admin_1.Admin, __assign({}, matchprops, { stats: _this.state.stats, tabsets: _this.state.tabsets }))); } })) : (React.createElement(react_router_1.Match, { exactly: true, pattern: '/', render: function (matchprops) { return (React.createElement(AdminApp_1.AdminApp, __assign({}, matchprops, { stats: _this.state.stats }))); } })),
                    React.createElement(react_router_1.Match, { exactly: true, pattern: '/user', component: User_1.User }),
                    React.createElement(react_router_1.Match, { exactly: true, pattern: '/users', component: UserManagement_1.UserManagement }),
                    React.createElement(react_router_1.Match, { exactly: true, pattern: '/app', component: AppDownload_1.AppDownload }),
                    React.createElement(react_router_1.Match, { exactly: true, pattern: '/upload', component: DatabaseUpload_1.DatabaseUpload }),
                    React.createElement(react_router_1.Match, { exactly: true, pattern: '/search', render: function (matchprops) { return (React.createElement(ObjectEditor_1.ObjectEditor, __assign({ api: _this.props.api }, matchprops, { workspace: 'search' }))); } }),
                    React.createElement(react_router_1.Match, { pattern: '/edit/:workspace', render: function (matchprops) { return (React.createElement(ObjectEditor_1.ObjectEditor, __assign({ api: _this.props.api }, matchprops, { workspace: matchprops.params.workspace === 'property' ? 'predicate' : matchprops.params.workspace }))); } }),
                    React.createElement(react_router_1.Miss, { component: RouteNotFound_1.RouteNotFound })))));
    };
    return FalconApp;
}(React.Component));
exports.FalconApp = FalconApp;
//# sourceMappingURL=FalconApp.js.map

/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = ReactDOM;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

var React = __webpack_require__(0);
var StatsGrid_1 = __webpack_require__(25);
exports.AdminApp = function (props) { return (React.createElement("div", { className: 'page' },
    React.createElement("section", null,
        React.createElement("h1", null, "VRE App"),
        props.stats !== null ? (React.createElement(StatsGrid_1.StatsGrid, { stats: props.stats })) : null))); };
//# sourceMappingURL=AdminApp.js.map

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var UnprocessableEntity = (function (_super) {
    __extends(UnprocessableEntity, _super);
    function UnprocessableEntity(message, data) {
        var _this = _super.call(this, message) || this;
        _this.code = 422;
        _this.data = data;
        return _this;
    }
    return UnprocessableEntity;
}(Error));
exports.UnprocessableEntity = UnprocessableEntity;
var KeyNotFoundException = (function (_super) {
    __extends(KeyNotFoundException, _super);
    function KeyNotFoundException(message) {
        if (message === void 0) { message = 'Could not find the given key'; }
        var _this = _super.call(this, message) || this;
        _this.code = 404;
        return _this;
    }
    return KeyNotFoundException;
}(Error));
exports.KeyNotFoundException = KeyNotFoundException;
var ReadOnlyResourceException = (function (_super) {
    __extends(ReadOnlyResourceException, _super);
    function ReadOnlyResourceException(message) {
        if (message === void 0) { message = 'Attempt to update a readonly resource'; }
        var _this = _super.call(this, message) || this;
        _this.code = 400;
        return _this;
    }
    return ReadOnlyResourceException;
}(Error));
exports.ReadOnlyResourceException = ReadOnlyResourceException;
var CollectionNotFoundException = (function (_super) {
    __extends(CollectionNotFoundException, _super);
    function CollectionNotFoundException(message) {
        if (message === void 0) { message = 'Could not find the given collection'; }
        var _this = _super.call(this, message) || this;
        _this.data = message;
        return _this;
    }
    return CollectionNotFoundException;
}(Error));
exports.CollectionNotFoundException = CollectionNotFoundException;
var OperationNotPermittedException = (function (_super) {
    __extends(OperationNotPermittedException, _super);
    function OperationNotPermittedException(data) {
        var _this = _super.call(this, data.message) || this;
        _this.code = 422;
        _this.data = data;
        return _this;
    }
    return OperationNotPermittedException;
}(Error));
exports.OperationNotPermittedException = OperationNotPermittedException;
var InvalidUpdateException = (function (_super) {
    __extends(InvalidUpdateException, _super);
    function InvalidUpdateException(message) {
        var _this = _super.call(this, message) || this;
        _this.code = 400;
        return _this;
    }
    return InvalidUpdateException;
}(Error));
exports.InvalidUpdateException = InvalidUpdateException;
var DatabaseIntegrityError = (function (_super) {
    __extends(DatabaseIntegrityError, _super);
    function DatabaseIntegrityError(message) {
        if (message === void 0) { message = "A database integrity constraint has been broken - your change has not been\n submitted. This is likely due to a change which violates the property types model; please check the types of\n what you are trying to do. Please also contact the Digital Humanities team, this error should not occur."; }
        var _this = _super.call(this, message) || this;
        _this.code = 500;
        return _this;
    }
    return DatabaseIntegrityError;
}(Error));
exports.DatabaseIntegrityError = DatabaseIntegrityError;
exports.Exceptions = {
    UnprocessableEntity: UnprocessableEntity,
    KeyNotFoundException: KeyNotFoundException,
    CollectionNotFoundException: CollectionNotFoundException,
    OperationNotPermittedException: OperationNotPermittedException,
    DatabaseIntegrityError: DatabaseIntegrityError,
    InvalidUpdateException: InvalidUpdateException,
    ReadOnlyResourceException: ReadOnlyResourceException
};
//# sourceMappingURL=Exceptions.js.map

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

var React = __webpack_require__(0);
exports.Loading = function (props) {
    return (React.createElement("div", { className: 'loader-wrapper' },
        React.createElement("div", { className: 'loader' })));
};
//# sourceMappingURL=Loading.js.map

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

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
var React = __webpack_require__(0);
var SearchBox_1 = __webpack_require__(59);
var ApiService_1 = __webpack_require__(2);
var react_router_1 = __webpack_require__(7);
var lodash_1 = __webpack_require__(4);
var react_sortable_hoc_1 = __webpack_require__(20);
var mobx_react_1 = __webpack_require__(1);
var Handle = react_sortable_hoc_1.SortableHandle(function (props) { return (React.createElement("div", { className: 'badge-container' },
    React.createElement("div", { className: 'badge ' + props.tabType },
        React.createElement("span", null, props.tabType[0].toUpperCase())))); });
var onCloseTab = function (e, tabType, uid, dataStore) {
    dataStore.closeTab(tabType, uid);
    e.stopPropagation();
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();
};
var Card = react_sortable_hoc_1.SortableElement(mobx_react_1.observer(function (props) { return (React.createElement("li", { key: "" + props.url },
    React.createElement("div", { className: (function (currentTab) {
            var classes = ['sidebar-card', props.tab.tabClass];
            if (currentTab) {
                classes.push('current');
            }
            if (props.compact) {
                classes.push('compact');
            }
            return classes.join(' ');
        })(props.currentTab) },
        React.createElement(Handle, { tabType: props.tab.tabType, index: props.index }),
        React.createElement("div", { className: 'description' },
            React.createElement(react_router_1.Link, { to: props.url },
                React.createElement("span", { className: 'entity-name' }, props.title),
                props.compact ? null : lodash_1.isObject(props.subtitle) ? (React.createElement("ul", null, Object.keys(props.subtitle).map(function (sub, i) { return (React.createElement("li", { key: "tab-" + props.index + "-" + i },
                    sub,
                    ":",
                    lodash_1.isObject(props.subtitle[sub]) ? (React.createElement("span", null,
                        React.createElement("ul", null, Object.keys(props.subtitle[sub]).map(function (subSub, j) {
                            return (React.createElement("li", { key: "tab-" + props.index + "-" + i + "-" + j },
                                subSub,
                                ": ",
                                props.subtitle[sub][subSub]));
                        })))) : null)); }))) : (React.createElement("span", { className: 'entity-type' }, props.subtitle)))),
        React.createElement("span", { className: 'lock-button' }, props.tab.tabType === 'source' ? (props.dataStore.defaultSource === props.tab.uid ?
            (React.createElement("i", { onClick: function () { return props.dataStore.defaultSource = null; }, className: 'fa fa-lock' })) :
            (React.createElement("i", { onClick: function () { return props.dataStore.defaultSource = props.tab.uid; }, className: 'fa fa-unlock' }))) : null),
        !props.currentTab ? (React.createElement("span", { className: 'close-button' },
            React.createElement("i", { className: 'fa fa-times', onClick: function (e) { return onCloseTab(e, props.tab.tabType, props.tab.uid, props.dataStore); } }))) : null))); }));
var CardList = mobx_react_1.observer(function (props) {
    return (React.createElement("ul", { className: 'card-list' }, props.dataStore.tabs.map(function (tab, index) {
        // TODO: shouldn't be ==
        var item = props.dataStore.dataStore.all[tab.tabType].value
            .find(function (item) { return item.uid == tab.uid; });
        var url = null;
        if (tab.tabClass === 'item') {
            url = "/edit/" + ApiService_1.AppUrls[tab.tabType] + "/" + tab.uid;
        }
        else {
            if (tab.tabClass === 'view') {
                url = {
                    pathname: "/edit/" + ApiService_1.AppUrls[tab.tabType],
                    query: tab.query
                };
            }
        }
        var subtitle = tab.tabClass === 'item' ?
            lodash_1.capitalize(ApiService_1.AppUrls[tab.tabType]).replace('_', ' ') + ' ' + tab.uid
            : tab.data;
        var title = item === undefined ? tab.tabType + " list" : item.label;
        var currentTab = !props.list && tab.tabType === props.workspace && tab.uid == props.id;
        return (React.createElement(Card, { key: "tab-" + tab.tabType + "-" + tab.tabClass + "-" + tab.uid + "-" + tab.query, currentTab: currentTab, url: url, tab: tab, title: title, subtitle: subtitle, index: index, dataStore: props.dataStore, compact: props.compact }));
    })));
});
var Sidebar = (function (_super) {
    __extends(Sidebar, _super);
    function Sidebar() {
        var _this = _super.call(this) || this;
        _this.state = {
            searchString: '',
            compactMode: false
        };
        return _this;
    }
    Sidebar.prototype.render = function () {
        var _this = this;
        return (React.createElement("section", { id: 'sidebar' },
            React.createElement(SearchBox_1.SearchBox, { searchString: this.state.searchString, dataStore: this.props.dataStore }),
            React.createElement("div", { className: 'sidebar-toolbar' },
                React.createElement("button", { onClick: function () { return _this.props.dataStore.clearAllTabs(); } },
                    React.createElement("i", { className: 'fa fa-trash' }),
                    " Clear All"),
                React.createElement("button", { onClick: function () { return _this.props.modalStore.addModal({ name: 'createTabSet', cancel: lodash_1.noop, complete: lodash_1.noop, settings: {} }); } },
                    React.createElement("i", { className: 'fa fa-floppy-o' }),
                    " Save"),
                React.createElement("button", { onClick: function () { return _this.setState({ compactMode: !_this.state.compactMode }); } },
                    React.createElement("i", { className: 'fa fa-compress' }),
                    " Compact")),
            React.createElement("div", { className: 'card-list-container' },
                React.createElement(CardList, { dataStore: this.props.dataStore, list: this.props.list, workspace: this.props.workspace, id: this.props.id, compact: this.state.compactMode }))));
    };
    return Sidebar;
}(React.Component));
Sidebar = __decorate([
    mobx_react_1.inject('dataStore', 'modalStore'),
    mobx_react_1.observer,
    __metadata("design:paramtypes", [])
], Sidebar);
exports.Sidebar = Sidebar;
//# sourceMappingURL=Sidebar.js.map

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview Toast controller
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = __webpack_require__(0);
var Toast = (function (_super) {
    __extends(Toast, _super);
    function Toast() {
        var _this = _super.call(this) || this;
        _this.state = {
            toasts: [],
            nextId: 0
        };
        return _this;
    }
    Toast.prototype.addToast = function (title, message, level, lifeTime) {
        var _this = this;
        if (level === void 0) { level = 'warning'; }
        if (lifeTime === void 0) { lifeTime = 3000; }
        var id = this.state.nextId;
        this.setState({
            toasts: this.state.toasts.concat([{ title: title, message: message, level: level, lifeTime: lifeTime, id: id }]),
            nextId: id + 1
        });
        setTimeout(function () {
            _this.setState({
                toasts: _this.state.toasts.filter(function (toast) { return toast.id !== id; })
            });
        }, lifeTime);
    };
    Toast.prototype.render = function () {
        return (React.createElement("span", null, this.state.toasts.map(function (toast, i) { return (React.createElement("div", { key: "toast-" + toast.id, style: { bottom: (1 + 7 * i) + 'em' }, className: "toast " + toast.level },
            React.createElement("div", { className: 'title' }, toast.title),
            React.createElement("div", { className: 'message' }, toast.message))); })));
    };
    return Toast;
}(React.Component));
exports.Toast = Toast;
//# sourceMappingURL=Toast.js.map

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

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
var React = __webpack_require__(0);
var Loading_1 = __webpack_require__(34);
var mobx_react_1 = __webpack_require__(1);
var workspace_1 = __webpack_require__(69);
var Workspace = (function (_super) {
    __extends(Workspace, _super);
    function Workspace() {
        var _this = _super.call(this) || this;
        _this.state = {
            searchString: ''
        };
        return _this;
    }
    Workspace.prototype.render = function () {
        if (this.props.loading) {
            return (React.createElement(Loading_1.Loading, null));
        }
        if (this.props.list) {
            return (React.createElement(workspace_1.ObjectListWorkspace, { query: this.props.location.query, listType: this.props.workspace }));
        }
        var workspaceComponent = workspace_1.EmptyWorkspace;
        switch (this.props.workspace) {
            case 'entity':
                workspaceComponent = workspace_1.EntityEditorWorkspace;
                break;
            case 'predicate':
                workspaceComponent = workspace_1.PredicateEditorWorkspace;
                break;
            case 'source':
                workspaceComponent = workspace_1.SourceEditorWorkspace;
                break;
            case 'entity_type':
                workspaceComponent = workspace_1.EntityTypeWorkspace;
                break;
            case 'search':
                workspaceComponent = workspace_1.AdvancedSearchWorkspace;
                break;
        }
        return (React.createElement("div", { className: 'flex-fill workspace-outer-wrapper' },
            React.createElement("div", { className: 'workspace-inner-wrapper flex-fill' }, React.createElement(workspaceComponent, { id: this.props.id }))));
    };
    return Workspace;
}(React.Component));
Workspace = __decorate([
    mobx_react_1.inject('dataStore'),
    mobx_react_1.observer,
    __metadata("design:paramtypes", [])
], Workspace);
exports.Workspace = Workspace;
//# sourceMappingURL=Workspace.js.map

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

var React = __webpack_require__(0);
var DatePickerDropdown_1 = __webpack_require__(45);
exports.DateFieldEditor = function (props) {
    return (React.createElement("div", { className: 'date-selector' },
        React.createElement(DatePickerDropdown_1.DatePickerDropdown, { value: props.value, setValue: props.onChange })));
};
//# sourceMappingURL=DateFieldEditor.js.map

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview Entity Field Editor - select box for entities
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

var React = __webpack_require__(0);
var ComboDropdown_1 = __webpack_require__(6);
var lodash_1 = __webpack_require__(4);
exports.EntityFieldEditor = function (props) {
    // build the options list
    var options = props.entities.map(function (entity) {
        return ({ key: entity.label, value: entity.uid !== null ? entity.uid : null });
    });
    // find the default option to display
    var selectedOption = options.find(function (opt) {
        return opt.value !== null && opt.value === props.value;
    });
    if (selectedOption === undefined) {
        selectedOption = { key: '', value: null };
    }
    return (React.createElement(ComboDropdown_1.NumberComboDropdown, { options: options, typeName: 'entity type', allowNew: false, value: selectedOption, setValue: function (val) { return val !== null && val.value !== null ? props.onChange(val.value) : props.onChange(null); }, createNewValue: lodash_1.noop }));
};
//# sourceMappingURL=EntityFieldEditor.js.map

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

var React = __webpack_require__(0);
exports.IntegerFieldEditor = function (props) {
    var integerFieldChangeHandler = function (e) { return props.onChange(e.target.value); };
    return (React.createElement("input", { type: 'number', value: props.value, onChange: integerFieldChangeHandler }));
};
//# sourceMappingURL=IntegerFieldEditor.js.map

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = __webpack_require__(0);
var ApiService_1 = __webpack_require__(2);
var falcon_core_1 = __webpack_require__(3);
var EditableFieldComponent_1 = __webpack_require__(9);
var RecordRow_1 = __webpack_require__(42);
var AddTabButton_1 = __webpack_require__(5);
var RecordEditableFieldComponent = EditableFieldComponent_1.EditableFieldHOC(RecordRow_1.RecordRow);
var RecordPredicate = (function (_super) {
    __extends(RecordPredicate, _super);
    function RecordPredicate() {
        var _this = _super.call(this) || this;
        _this.state = {
            potentialValues: []
        };
        return _this;
    }
    RecordPredicate.prototype.componentDidMount = function () {
        var _this = this;
        if (this.props.predicate.rangeIsReference) {
            this.props.dataStore.getCollection(falcon_core_1.Entity, ApiService_1.AppUrls.entity, { type: this.props.predicate.range })
                .then(function (potentialValues) { return _this.setState({ potentialValues: potentialValues }); });
        }
    };
    RecordPredicate.prototype.createNewRecord = function () {
        this.props.dataStore.postItem(falcon_core_1.Record, ApiService_1.AppUrls.record, falcon_core_1.Serializer.fromJson(falcon_core_1.Record, {
            predicate: this.props.predicate.uid,
            entity: this.props.entity_id,
            valueType: this.props.predicate.rangeIsReference ? 'entity' : this.props.predicate.range,
            score: 3,
            source: this.props.dataStore.defaultSource
        }), {});
    };
    RecordPredicate.prototype.deleteRecord = function (record) {
        var _this = this;
        if (record.uid === null) {
            throw new Error('Trying to delete a record with null id');
        }
        this.props.dataStore.delItem(falcon_core_1.Record, ApiService_1.AppUrls.record, record.uid)
            .then(function () {
            _this.props.onChange();
        });
    };
    RecordPredicate.prototype.recordChanged = function (record) {
        this.props.dataStore.putItem(falcon_core_1.Record, ApiService_1.AppUrls.record, this.props.entity_id, falcon_core_1.Serializer.toJson(record));
    };
    RecordPredicate.prototype.render = function () {
        var _this = this;
        if (this.props.predicate.uid === null) {
            throw new Error('Expected uid to be a number, it was null');
        }
        return (React.createElement("section", null,
            React.createElement("h5", { className: 'section-header' },
                this.props.predicate.label,
                " ",
                React.createElement("i", { className: 'fa fa-plus-circle add button', "aria-hidden": 'true', onClick: this.createNewRecord.bind(this), title: "Add new " + this.props.predicate.label + " record" }),
                React.createElement(AddTabButton_1.AddTabButton, { uid: this.props.predicate.uid, tabType: 'predicate' })),
            React.createElement("table", { className: 'record-editing-table' },
                React.createElement("thead", null,
                    React.createElement("tr", { className: 'record-row title' },
                        React.createElement("th", { className: 'record-row-item uid' }, "ID"),
                        this.props.predicate.range !== 'source' ? (React.createElement("th", { className: 'record-row-item' }, "Value")) : null,
                        React.createElement("th", { className: 'record-row-item' }, "Source"),
                        React.createElement("th", { className: 'record-row-item score' }, "Score"),
                        React.createElement("th", { className: 'record-row-item score' }, "Period"),
                        React.createElement("th", { className: 'record-row-item buttons' }, "Actions"))),
                React.createElement("tbody", null, this.props.records.map(function (record) { return (React.createElement(RecordEditableFieldComponent, { key: "row-" + record.uid, value: record, onChange: _this.recordChanged.bind(_this), onDelete: _this.deleteRecord.bind(_this), sources: _this.props.sources, entities: _this.state.potentialValues })); })))));
    };
    return RecordPredicate;
}(React.Component));
exports.RecordPredicate = RecordPredicate;
//# sourceMappingURL=RecordPredicate.js.map

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

var React = __webpack_require__(0);
var ScorePicker_1 = __webpack_require__(46);
var ComboDropdown_1 = __webpack_require__(6);
var StringFieldEditor_1 = __webpack_require__(44);
var EntityFieldEditor_1 = __webpack_require__(39);
var DateFieldEditor_1 = __webpack_require__(38);
var IntegerFieldEditor_1 = __webpack_require__(40);
var AddTabButton_1 = __webpack_require__(5);
var formatDate_1 = __webpack_require__(18);
var mobx_react_1 = __webpack_require__(1);
var recordEditor = function (props, record) {
    switch (record.valueType) {
        case 'string':
            return (React.createElement(StringFieldEditor_1.StringFieldEditor, { value: record.value || '', onChange: function (value) { return props.onChange(Object.assign(record, { value: value })); } }));
        case 'date':
            return (React.createElement(DateFieldEditor_1.DateFieldEditor, { value: record.value || '', onChange: function (value) { return props.onChange(Object.assign(record, { value: value })); } }));
        case 'integer':
            return (React.createElement(IntegerFieldEditor_1.IntegerFieldEditor, { value: record.value || '', onChange: function (value) { return props.onChange(Object.assign(record, { value: value })); } }));
        case 'entity':
            return (React.createElement(EntityFieldEditor_1.EntityFieldEditor, { value: record.value === null ? 0 : parseInt(record.value), onChange: function (value) { return props.onChange(Object.assign(record, { value: value })); }, entities: props.entities }));
        default:
            return (React.createElement("div", null, "Missing editor"));
    }
};
var formatValue = function (props, record) {
    if (record.valueType === 'entity') {
        var entity = props.entities.find(function (entity) { return entity.uid == record.value; });
        if (entity !== undefined) {
            if (entity.uid === null) {
                throw Error('Unexpected null ID on entity');
            }
            return (React.createElement("span", null,
                entity.label,
                " ",
                React.createElement(AddTabButton_1.AddTabButton, { uid: entity.uid, tabType: 'entity' })));
        }
        else {
            return (React.createElement("em", null, "Missing Entity"));
        }
    }
    if (record.valueType === 'date') {
        return (React.createElement("span", null, formatDate_1.formatDate(record.value)));
    }
    return (React.createElement("span", null, record.value));
};
exports.RecordRow = mobx_react_1.inject('dataStore', 'modalStore')(mobx_react_1.observer(function (props) {
    var createNewSource = function (initialValue) {
        var a = {
            name: 'source',
            complete: function () {
                // TODO : Automatically reload sources
            },
            cancel: function () { console.log('cancel'); },
            settings: {
                initialValue: initialValue
            }
        };
        props.modalStore.addModal(a);
    };
    var recordValue = props.value;
    if (recordValue === null) {
        throw new Error('Should not be null!!');
    }
    var currentSource = recordValue.source === null ? undefined :
        props.sources.find(function (source) { return source.uid === recordValue.source; });
    var dropDownValue = {
        key: '', value: recordValue.source === null ? null : recordValue.source
    };
    if (currentSource !== undefined) {
        dropDownValue.key = currentSource.label;
    }
    if (props.edit) {
        return (React.createElement("tr", { className: 'record-row' },
            React.createElement("td", { className: 'record-row-item uid' }, recordValue.uid),
            recordValue.valueType !== 'source' ? (React.createElement("td", { className: 'record-row-item' }, recordEditor(props, recordValue))) : null,
            React.createElement("td", { className: 'record-row-item' },
                React.createElement(ComboDropdown_1.NumberComboDropdown, { options: props.sources.map(function (source) {
                        return ({ key: source.label, value: source.uid !== null ? source.uid : null });
                    }), typeName: 'source', value: dropDownValue, setValue: function (combo) { return props.onChange(Object.assign(recordValue, { source: combo === null ? combo : combo.value })); }, createNewValue: function () { return createNewSource(''); } })),
            React.createElement("td", { className: 'record-row-item score' },
                React.createElement(ScorePicker_1.ScorePicker, { value: recordValue.score, readOnly: false, onChange: function (score) { return props.onChange(Object.assign(recordValue, { score: score })); } })),
            React.createElement("td", { className: 'record-row-item period' },
                React.createElement(DateFieldEditor_1.DateFieldEditor, { value: recordValue.period || '', onChange: function (period) { return props.onChange(Object.assign(recordValue, { period: period })); } })),
            React.createElement("td", { className: 'record-row-item buttons' },
                React.createElement("button", { onClick: props.acceptChanges },
                    React.createElement("i", { className: 'fa fa-check', "aria-hidden": 'true' })),
                React.createElement("button", { onClick: props.cancelChanges },
                    React.createElement("i", { className: 'fa fa-times', "aria-hidden": 'true' })))));
    }
    else {
        return (React.createElement("tr", { className: 'record-row' },
            React.createElement("td", { className: 'record-row-item uid' },
                "#",
                recordValue.uid),
            recordValue.valueType !== 'source' ? (React.createElement("td", { className: 'record-row-item' }, formatValue(props, recordValue))) : null,
            React.createElement("td", { className: 'record-row-item' },
                dropDownValue.key,
                dropDownValue.key.length > 0 && dropDownValue.value !== null ? (React.createElement(AddTabButton_1.AddTabButton, { uid: dropDownValue.value, tabType: 'source' })) : null),
            React.createElement("td", { className: 'record-row-item score' },
                React.createElement(ScorePicker_1.ScorePicker, { value: recordValue.score, readOnly: true })),
            React.createElement("td", { className: 'record-row-item period' }, formatDate_1.formatDate(recordValue.period)),
            React.createElement("td", { className: 'record-row-item buttons' },
                React.createElement("button", { onClick: props.setEdit },
                    React.createElement("i", { className: 'fa fa-pencil-square-o', title: 'Edit', "aria-hidden": 'true' })),
                React.createElement("button", { onClick: function () { return props.onDelete(props.value); } },
                    React.createElement("i", { className: 'fa fa-trash', "aria-hidden": 'true' })))));
    }
}));
//# sourceMappingURL=RecordRow.js.map

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

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
var React = __webpack_require__(0);
var ApiService_1 = __webpack_require__(2);
var falcon_core_1 = __webpack_require__(3);
var SearchBar_1 = __webpack_require__(11);
var RecordPredicate_1 = __webpack_require__(41);
var findParentTree_1 = __webpack_require__(17);
var mobx_react_1 = __webpack_require__(1);
var RecordsEditor = (function (_super) {
    __extends(RecordsEditor, _super);
    function RecordsEditor() {
        var _this = _super.call(this) || this;
        _this.state = {
            filterFunc: function () { return true; }
        };
        return _this;
    }
    RecordsEditor.prototype.deleteRecord = function (record) {
        var _this = this;
        if (record.uid === null) {
            throw new Error('Trying to delete a record with null id');
        }
        this.props.dataStore.delItem(falcon_core_1.Record, ApiService_1.AppUrls.record, record.uid)
            .then(function () {
            _this.props.onChange();
        });
    };
    RecordsEditor.prototype.createNewRecord = function () {
        var entity = this.props.dataStore.dataStore.tabs.entity[this.props.id].value.entity;
        var entityType = this.props.dataStore.dataStore.all.entity_type.value.find(function (t) { return t.uid === entity.entityType; });
        var entityTypeParents = findParentTree_1.findParentTree(entity.entityType, this.props.dataStore.dataStore.all.entity_type.value);
        var predicates = this.props.dataStore.dataStore.all.predicate
            .value.filter(function (pred) { return entityTypeParents.indexOf(pred.domain) !== -1; });
        var modalDef = {
            name: 'record',
            complete: function (data) {
                console.log('Records editor called complete');
                //this.loadData(this.props);
            },
            cancel: function () {
                console.log('Records editor called cancel');
            },
            settings: {
                options: predicates.map(function (pred) { return ({ key: pred.label, value: pred }); }),
                entityUid: this.props.id,
                entityType: this.props.entityTypeId
            }
        };
        this.props.modalStore.addModal(modalDef);
    };
    RecordsEditor.prototype.render = function () {
        var _this = this;
        var predicates = this.props.predicates;
        return (React.createElement("div", null,
            React.createElement("div", null,
                React.createElement("div", null,
                    React.createElement("label", { className: 'small' }, "Records"),
                    React.createElement("div", { style: { display: 'flex' } },
                        React.createElement("div", { style: { flex: '1' } },
                            React.createElement(SearchBar_1.SearchBar, { getValue: function (p) { return p.label; }, setFilterFunc: function (filterFunc) { return _this.setState({ filterFunc: filterFunc }); } })),
                        React.createElement("div", { style: { padding: '0.1em 0.4em', fontSize: '2em' } },
                            React.createElement("i", { className: 'fa fa-plus-circle add button', "aria-hidden": 'true', onClick: this.createNewRecord.bind(this), title: 'Add new record' }))),
                    React.createElement("div", null, Object.keys(this.props.records).map(function (section) {
                        var currentPredicate = predicates.find(function (pred) {
                            if (pred.uid === null) {
                                throw new Error('encountered predicate with null id');
                            }
                            return pred.uid.toString() === section;
                        });
                        if (currentPredicate === undefined) {
                            throw new Error('Could not find predicate');
                        }
                        if (!_this.state.filterFunc(currentPredicate)) {
                            return null;
                        }
                        return (React.createElement(RecordPredicate_1.RecordPredicate, { key: "section-" + section, entity_id: _this.props.id, dataStore: _this.props.dataStore, dimension: 'predicate', records: _this.props.records[section], predicate: currentPredicate, sources: _this.props.sources, onChange: _this.props.onChange }));
                    }))))));
    };
    return RecordsEditor;
}(React.Component));
RecordsEditor = __decorate([
    mobx_react_1.inject('dataStore', 'modalStore'),
    mobx_react_1.observer,
    __metadata("design:paramtypes", [])
], RecordsEditor);
exports.RecordsEditor = RecordsEditor;
//# sourceMappingURL=RecordsEditor.js.map

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

var React = __webpack_require__(0);
exports.StringFieldEditor = function (props) {
    return (React.createElement("input", { type: 'text', value: props.value, onChange: function (e) { return props.onChange(e.target.value); } }));
};
//# sourceMappingURL=StringFieldEditor.js.map

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = __webpack_require__(0);
var moment = __webpack_require__(19);
var lodash_1 = __webpack_require__(4);
var formatDate_1 = __webpack_require__(18);
var DatePickerDropdown = (function (_super) {
    __extends(DatePickerDropdown, _super);
    function DatePickerDropdown() {
        var _this = _super.call(this) || this;
        //TODO: should be false
        _this.state = {
            showingDropDown: false
        };
        if (document !== undefined) {
            _this.boundWindowClick = function () {
                if (!_this.ignoreGlobalClick) {
                    _this.setState({
                        showingDropDown: false
                    });
                }
                else {
                    _this.ignoreGlobalClick = false;
                }
            };
            document.body.addEventListener('click', _this.boundWindowClick);
        }
        return _this;
    }
    DatePickerDropdown.prototype.componentWillMount = function () {
        this.ignoreBlur = false;
        this.ignoreClick = false;
        this.ignoreGlobalClick = false;
    };
    DatePickerDropdown.prototype.componentWillUnmount = function () {
        document.body.removeEventListener('click', this.boundWindowClick);
    };
    DatePickerDropdown.prototype.componentWillReceiveProps = function (newProps) {
        // this.updateFilter(newProps.value.key !== this.props.value.key ? newProps.value.key : this.state.searchString, newProps);
        // this.setState({
        //     searchString: newProps.value.key !== this.props.value.key ? newProps.value.key : this.state.searchString,
        //     selected: newProps.value,
        //     options: newProps.options
        // });
    };
    //should be false
    DatePickerDropdown.prototype.handleInputBlur = function () {
        if (!this.ignoreBlur) {
            this.setState({
                showingDropDown: false
            });
        }
        else {
            this.ignoreBlur = false;
        }
    };
    DatePickerDropdown.prototype.handleInputFocus = function () {
        if (this.ignoreBlur) {
            this.ignoreBlur = true;
            return;
        }
        // We don't want `selectItemFromMouse` to trigger when
        // the user clicks into the input to focus it, so set this
        // flag to cancel out the logic in `handleInputClick`.
        // The event order is:  MouseDown -> Focus -> MouseUp -> Click
        this.ignoreClick = true;
        this.setState({ showingDropDown: true });
    };
    DatePickerDropdown.prototype.handleInputClick = function () {
        // Input will not be focused if it's disabled
        if (this.isInputFocused() && this.state.showingDropDown === false) {
            this.setState({ showingDropDown: true });
        }
        else {
            //  if (this.state.highlightedIndex !== null && !this.ignoreClick) {
            //      this.selectItemFromMouse(this.state.filteredOptions[this.state.highlightedIndex]);
            //  } else {
            this.ignoreClick = false;
        }
    };
    DatePickerDropdown.prototype.selectItemFromMouse = function (item) {
        var _this = this;
        this.setState({
            showingDropDown: false
        }, function () {
            _this.props.setValue(item);
        });
    };
    DatePickerDropdown.prototype.isInputFocused = function () {
        var el = this.refs[DatePickerDropdown.datePickerDropDownInputBoxRef];
        return el.ownerDocument && (el === el.ownerDocument.activeElement);
    };
    DatePickerDropdown.prototype.onDropdownClick = function () {
        this.ignoreBlur = true;
        this.ignoreGlobalClick = true;
        console.log('clicked');
    };
    DatePickerDropdown.prototype.rangeTypeChanged = function (rangeType) {
        this.props.setValue(rangeType + this.props.value.substr(1));
    };
    DatePickerDropdown.prototype.yearChanged = function (e) {
        var base = this.props.value.length === 9 ? this.props.value : '=XXXX0000';
        var yearVal = e.currentTarget.value.substr(0, 4).replace(/[^0-9]/g, '');
        for (var i = yearVal.length; i < 4; i += 1) {
            yearVal += 'X';
        }
        this.props.setValue(base.substr(0, 1) + yearVal + base.substr(5));
    };
    DatePickerDropdown.prototype.monthChanged = function (e) {
        this.ignoreGlobalClick = true;
        var base = this.props.value.length === 9 ? this.props.value : '=XXXX0000';
        var monthVal = e.currentTarget.value.substr(0, 2);
        this.props.setValue(base.substr(0, 5) + monthVal + base.substr(7));
    };
    DatePickerDropdown.prototype.dayChanged = function (e) {
        var base = this.props.value.length === 9 ? this.props.value : '=XXXX0000';
        var dayVal = e.currentTarget.value.substr(0, 2).replace(/[^0-9]/g, '');
        dayVal = lodash_1.padStart(dayVal, 2, '0');
        this.props.setValue(base.substr(0, 7) + dayVal);
    };
    DatePickerDropdown.prototype.render = function () {
        var _this = this;
        var rangeOption = this.props.value.substr(0, 1);
        if (['<', '>', '='].indexOf(rangeOption) === -1) {
            rangeOption = '=';
        }
        var rangeOptionClassName = function (val) {
            if (val === rangeOption) {
                return 'range-option selected';
            }
            else {
                return 'range-option';
            }
        };
        var year = this.props.value.substr(1, 4).replace(/X/g, '');
        var month = this.props.value.substr(5, 2);
        var day = this.props.value[7] === '0' ? this.props.value[8] === '0' ?
            ''
            : this.props.value.substr(8, 1)
            : this.props.value.substr(7, 2);
        var displayValue = formatDate_1.formatDate(this.props.value);
        return (React.createElement("div", { className: 'combo-dropdown' },
            React.createElement("div", null,
                React.createElement("input", { type: 'text', readOnly: true, ref: DatePickerDropdown.datePickerDropDownInputBoxRef, className: 'search-input', value: displayValue, onBlur: this.handleInputBlur.bind(this), onFocus: this.handleInputFocus.bind(this), onClick: this.handleInputClick.bind(this) })),
            this.state.showingDropDown ? (React.createElement("div", { className: 'dropdown' },
                React.createElement("div", { className: 'date-picker-dropdown', onMouseDown: this.onDropdownClick.bind(this) },
                    React.createElement("section", { className: 'range-type' },
                        React.createElement("div", { className: rangeOptionClassName('<'), onClick: function () { return _this.rangeTypeChanged('<'); } }, "Before"),
                        React.createElement("div", { className: rangeOptionClassName('='), onClick: function () { return _this.rangeTypeChanged('='); } }, "Exactly"),
                        React.createElement("div", { className: rangeOptionClassName('>'), onClick: function () { return _this.rangeTypeChanged('>'); } }, "After")),
                    React.createElement("section", { className: 'date-select' },
                        React.createElement("div", { className: 'date-selector day' },
                            React.createElement("label", { className: 'small' }, "Day"),
                            React.createElement("input", { type: 'text', maxLength: 2, value: day, onChange: this.dayChanged.bind(this) })),
                        React.createElement("div", { className: 'date-selector month' },
                            React.createElement("label", { className: 'small' }, "Month"),
                            React.createElement("select", { onChange: this.monthChanged.bind(this), value: month },
                                React.createElement("option", { value: '00' }, "Unknown"),
                                moment.months().map(function (month, i) { return (React.createElement("option", { key: "option-" + month, value: lodash_1.padStart((i + 1).toString(), 2, '0') }, month)); }))),
                        React.createElement("div", { className: 'date-selector year' },
                            React.createElement("label", { className: 'small' }, "Year"),
                            React.createElement("input", { type: 'text', maxLength: 4, value: year, onChange: this.yearChanged.bind(this) })))))) : null));
    };
    return DatePickerDropdown;
}(React.Component));
DatePickerDropdown.datePickerDropDownInputBoxRef = 'datePickerDropDownInputBox';
exports.DatePickerDropdown = DatePickerDropdown;
//# sourceMappingURL=DatePickerDropdown.js.map

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

var React = __webpack_require__(0);
var lodash_1 = __webpack_require__(4);
exports.ScorePicker = function (props) {
    var values = [1, 2, 3, 4, 5];
    if (props.readOnly) {
        return (React.createElement("span", { className: 'score-picker' }, values.map(function (val) { return (React.createElement("i", { key: val, className: 'fa fa-star' + (val > props.value ? '-o' : ''), "aria-hidden": 'true' })); })));
    }
    else {
        return (React.createElement("span", { className: 'score-picker editing' }, lodash_1.reverse(values).map(function (val) { return (React.createElement("i", { key: val, className: 'fa fa-star' + (val > props.value ? '-o' : ''), onClick: function () {
                if (props.onChange === undefined) {
                    throw new Error('An onChange handler is required');
                }
                props.onChange(val);
            }, "aria-hidden": 'true' })); })));
    }
};
//# sourceMappingURL=ScorePicker.js.map

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

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
var React = __webpack_require__(0);
var Overlay_1 = __webpack_require__(8);
var mobx_react_1 = __webpack_require__(1);
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

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

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
var React = __webpack_require__(0);
var Overlay_1 = __webpack_require__(8);
var falcon_core_1 = __webpack_require__(3);
var ApiService_1 = __webpack_require__(2);
var ComboDropdown_1 = __webpack_require__(6);
var lodash_1 = __webpack_require__(4);
var mobx_react_1 = __webpack_require__(1);
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

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

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
var React = __webpack_require__(0);
var Overlay_1 = __webpack_require__(8);
var falcon_core_1 = __webpack_require__(3);
var ApiService_1 = __webpack_require__(2);
var mobx_react_1 = __webpack_require__(1);
var mousetrap = __webpack_require__(10);
var CreateEntityType = (function (_super) {
    __extends(CreateEntityType, _super);
    function CreateEntityType() {
        var _this = _super.call(this) || this;
        _this.state = {
            internalValue: ''
        };
        return _this;
    }
    CreateEntityType.prototype.createEntityType = function () {
        this.props.dataStore.postItem(falcon_core_1.EntityType, ApiService_1.AppUrls.entity_type, falcon_core_1.Serializer.fromJson(falcon_core_1.EntityType, {
            label: this.state.internalValue
        }), {})
            .then(this.props.complete);
    };
    CreateEntityType.prototype.inputRef = function (val) {
        if (val !== null) {
            val.focus();
            this.keyboardShortcuts = new mousetrap(val);
            this.keyboardShortcuts.bind('return', this.createEntityType.bind(this));
            this.keyboardShortcuts.bind('escape', this.props.cancel);
        }
        else {
            this.keyboardShortcuts.unbind('return');
        }
    };
    CreateEntityType.prototype.render = function () {
        var _this = this;
        return (React.createElement(Overlay_1.Overlay, null,
            React.createElement("h2", null, "Create Entity Type"),
            React.createElement("label", { className: 'small' }, "Name"),
            React.createElement("input", { type: 'text', value: this.state.internalValue, ref: this.inputRef.bind(this), onChange: function (e) { return _this.setState({ internalValue: e.target.value }); } }),
            React.createElement("button", { onClick: function () { return _this.props.cancel(); }, className: 'pull-left' }, "Cancel"),
            React.createElement("button", { onClick: this.createEntityType.bind(this), className: 'pull-right' }, "Create Entity Type")));
    };
    return CreateEntityType;
}(React.Component));
CreateEntityType = __decorate([
    mobx_react_1.inject('dataStore'),
    mobx_react_1.observer,
    __metadata("design:paramtypes", [])
], CreateEntityType);
exports.CreateEntityType = CreateEntityType;
;
//# sourceMappingURL=CreateEntityType.js.map

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

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
var React = __webpack_require__(0);
var Overlay_1 = __webpack_require__(8);
var PredicateDescription_1 = __webpack_require__(22);
var falcon_core_1 = __webpack_require__(3);
var literalTypes_1 = __webpack_require__(24);
var ApiService_1 = __webpack_require__(2);
var mobx_react_1 = __webpack_require__(1);
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

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

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
var React = __webpack_require__(0);
var falcon_core_1 = __webpack_require__(3);
var ApiService_1 = __webpack_require__(2);
var mobx_react_1 = __webpack_require__(1);
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

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

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
var React = __webpack_require__(0);
var Overlay_1 = __webpack_require__(8);
var falcon_core_1 = __webpack_require__(3);
var ApiService_1 = __webpack_require__(2);
var ComboDropdown_1 = __webpack_require__(6);
var mobx_react_1 = __webpack_require__(1);
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

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

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
var React = __webpack_require__(0);
var Overlay_1 = __webpack_require__(8);
var falcon_core_1 = __webpack_require__(3);
var ApiService_1 = __webpack_require__(2);
var mobx_react_1 = __webpack_require__(1);
var mousetrap = __webpack_require__(10);
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

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

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
var React = __webpack_require__(0);
var Overlay_1 = __webpack_require__(8);
var mobx_react_1 = __webpack_require__(1);
var mousetrap = __webpack_require__(10);
var CreateTabSet = (function (_super) {
    __extends(CreateTabSet, _super);
    function CreateTabSet() {
        var _this = _super.call(this) || this;
        _this.state = {
            internalValue: ''
        };
        return _this;
    }
    CreateTabSet.prototype.createTabSet = function () {
        var _this = this;
        return fetch('/tabset', {
            method: 'POST',
            body: JSON.stringify({
                name: this.state.internalValue,
                tabs: this.props.dataStore.tabs
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin'
        })
            .then(function (response) {
            return response.json();
        }).then(function () { return _this.props.complete(''); });
    };
    CreateTabSet.prototype.inputRef = function (val) {
        if (val !== null) {
            val.focus();
            this.keyboardShortcuts = new mousetrap(val);
            this.keyboardShortcuts.bind('return', this.createTabSet.bind(this));
            this.keyboardShortcuts.bind('escape', this.props.cancel);
        }
        else {
            this.keyboardShortcuts.unbind('return');
        }
    };
    CreateTabSet.prototype.render = function () {
        var _this = this;
        return (React.createElement(Overlay_1.Overlay, null,
            React.createElement("h2", null, "Save Tab Set"),
            React.createElement("label", { className: 'small' }, "Name"),
            React.createElement("input", { type: 'text', value: this.state.internalValue, ref: this.inputRef.bind(this), onChange: function (e) { return _this.setState({ internalValue: e.target.value }); } }),
            React.createElement("button", { onClick: function () { return _this.props.cancel(); }, className: 'pull-left' }, "Cancel"),
            React.createElement("button", { onClick: this.createTabSet.bind(this), className: 'pull-right' }, "Create Tab Set")));
    };
    return CreateTabSet;
}(React.Component));
CreateTabSet = __decorate([
    mobx_react_1.inject('dataStore'),
    mobx_react_1.observer,
    __metadata("design:paramtypes", [])
], CreateTabSet);
exports.CreateTabSet = CreateTabSet;
;
//# sourceMappingURL=CreateTabSet.js.map

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

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
var React = __webpack_require__(0);
var lev = __webpack_require__(89);
var ComboDropdown_1 = __webpack_require__(6);
var lodash_1 = __webpack_require__(4);
var AddTabButton_1 = __webpack_require__(5);
var formatDate_1 = __webpack_require__(18);
var mobx_react_1 = __webpack_require__(1);
var sortIcons = {
    'none': 'fa fa-sort',
    'asc': 'fa fa-sort-asc',
    'desc': 'fa fa-sort-desc'
};
var customColumns = function (predicates, columns, updateColumnParams, rotateSort) {
    return [0, 1, 2].map(function (id) {
        var comboValue = { key: '', value: null };
        if (columns[id].predicate !== -1) {
            var thisPred = predicates.find(function (pred) { return pred.uid == columns[id].predicate; });
            if (thisPred !== undefined) {
                comboValue.key = thisPred.label;
            }
            comboValue.value = columns[id].predicate;
        }
        return (React.createElement("td", { key: "col-" + id },
            React.createElement("div", { className: 'list-combo-header' },
                React.createElement("div", { className: 'combo-wrapper' },
                    React.createElement(ComboDropdown_1.NumberComboDropdown, { value: comboValue, typeName: 'predicate', allowNew: false, setValue: function (value) { return updateColumnParams(id, 'p', value === null ? null : value.value); }, options: predicates.map(function (pred) { return ({ key: pred.label, value: pred.uid.toString() }); }), createNewValue: lodash_1.noop, additionalClasses: ['compact'] })),
                React.createElement("div", { className: 'order-wrapper' },
                    React.createElement("i", { className: sortIcons[columns[id].sort], onClick: function () { return rotateSort(id); } })))));
    });
};
var EntityList = (function (_super) {
    __extends(EntityList, _super);
    function EntityList(props) {
        var _this = _super.call(this) || this;
        _this.state = {
            entities: [],
            entityTypes: [],
            predicates: [],
            columns: [
                { predicate: -1, sort: 'none', filterType: 'any', invertFilter: false, filterValue: '' },
                { predicate: -1, sort: 'none', filterType: 'any', invertFilter: false, filterValue: '' },
                { predicate: -1, sort: 'none', filterType: 'any', invertFilter: false, filterValue: '' }
            ],
            entityType: { key: 'Any', value: 0 },
            queryData: {}
        };
        return _this;
    }
    EntityList.prototype.componentDidMount = function () {
        this.update(this.props);
    };
    EntityList.prototype.componentWillReceiveProps = function (newProps) {
        this.update(newProps);
    };
    EntityList.prototype.update = function (props) {
        var queryStringOptions = props.query;
        var columns = lodash_1.cloneDeep(this.state.columns);
        if (queryStringOptions !== null) {
            for (var i = 1; i < 4; i += 1) {
                columns[i - 1].predicate = queryStringOptions["col" + i + "p"] || null;
                columns[i - 1].sort = queryStringOptions["col" + i + "s"] || null;
                columns[i - 1].filterType = queryStringOptions["col" + i + "f"] || '';
                columns[i - 1].filterValue = queryStringOptions["col" + i + "v"] || '';
                columns[i - 1].invertFilter = queryStringOptions["col" + i + "i"] || null;
            }
        }
        this.setState({
            columns: columns,
            queryData: queryStringOptions === null ? {} : queryStringOptions
        });
    };
    EntityList.prototype.addNew = function () {
        var a = {
            name: 'entity',
            complete: function () {
            },
            cancel: function () { console.log('cancel'); },
            settings: {
                initialName: ''
            }
        };
        this.props.modalStore.addModal(a);
    };
    EntityList.prototype.updateColumnParams = function (colId, key, value) {
        this.context.router.transitionTo({
            pathname: '/edit/entity',
            query: Object.assign(this.state.queryData, (_a = {}, _a["col" + (colId + 1) + key] = value, _a))
        });
        var _a;
    };
    EntityList.prototype.rotateSort = function (colId) {
        var columns = lodash_1.cloneDeep(this.state.columns);
        switch (columns[colId].sort) {
            case 'none':
                columns[colId].sort = 'asc';
                break;
            case 'asc':
                columns[colId].sort = 'desc';
                break;
            case 'desc':
                columns[colId].sort = 'none';
        }
        this.setState({
            columns: columns
        });
    };
    EntityList.prototype.addViewTab = function () {
        var _this = this;
        var tabData = {};
        var mapping = [
            { key: 'p', display: 'Predicate', mod: function (data) { return _this.props.dataStore.dataStore.all.predicate.value.find(function (pred) { return pred.uid == data; }).label; } },
            { key: 's', display: 'Sort', mod: function (data) { return data; } },
            { key: 'f', display: 'filterType', mod: function (data) { return data; } },
            { key: 'v', display: 'filterValue', mod: function (data) { return data; } },
            { key: 'i', display: 'invertFilter', mod: function (data) { return data; } }
        ];
        for (var i = 1; i < 4; i += 1) {
            for (var j = 0; j < mapping.length; j += 1) {
                if (this.state.queryData["col" + i + mapping[j].key] !== undefined) {
                    if (tabData["Column " + i] === undefined) {
                        tabData["Column " + i] = {};
                    }
                    tabData["Column " + i][mapping[j].display] = mapping[j].mod(this.state.queryData["col" + i + mapping[j].key]);
                }
            }
        }
        this.props.dataStore.createTab('entity', Date.now(), 'view', tabData, this.props.query);
    };
    EntityList.prototype.render = function () {
        var _this = this;
        var entities = this.props.dataStore.dataStore.all.entity.value;
        var predicates = this.props.dataStore.dataStore.all.predicate.value;
        var entityTypes = this.props.dataStore.dataStore.all.entity_type.value;
        var entityTypeOptions = entityTypes.map(function (entityType) { return ({ key: entityType.label, value: entityType.uid }); });
        var tableData = entities.map(function (entity) {
            var entityType = entityTypes.find(function (t) { return t.uid === entity.entityType; });
            var entityData = _this.props.dataStore.dataStore.records.filter(function (res) { return res.entity === entity.uid; });
            return {
                uid: entity.uid,
                label: entity.label,
                entityType: entityType,
                columns: _this.state.columns.map(function (col) {
                    var value = '';
                    if (entityData !== undefined && col.predicate !== -1) {
                        var predicateData = entityData
                            .filter(function (record) { return record.predicate == col.predicate; });
                        if (predicateData !== undefined) {
                            value = predicateData.map(function (pred) {
                                if (pred.valueType === 'date') {
                                    return formatDate_1.formatDate(pred.value);
                                }
                                if (pred.valueType === 'source') {
                                    if (pred.value === null) {
                                        return 'Not set';
                                    }
                                    return _this.props.dataStore.dataStore.all.source.value.find(function (source) { return source.uid === pred.value; }).label;
                                }
                                if (pred.valueType === 'entity') {
                                    if (pred.value === null) {
                                        return 'Not set';
                                    }
                                    return _this.props.dataStore.dataStore.all.entity.value.find(function (entity) { return entity.uid === pred.value; }).label;
                                }
                                return pred.value;
                            }).join(', ');
                        }
                        return value;
                    }
                })
            };
        })
            .filter(function (row) {
            var keepRow = true;
            _this.state.columns.forEach(function (col, i) {
                if (col.filterType === 'contains' && col.filterValue.length > 0 && col.predicate !== null) {
                    if (row.columns[i].toLowerCase().indexOf(col.filterValue.toLowerCase()) === -1) {
                        keepRow = false;
                    }
                }
                if (col.filterType === 'exists' && col.predicate !== null) {
                    if (row.columns[i].length === 0) {
                        keepRow = false;
                    }
                }
                if (col.filterType === 'similar' && col.predicate !== null && col.filterValue.length > 0) {
                    if (new lev(row.columns[i], col.filterValue).distance >= col.filterValue.length + 2) {
                        keepRow = false;
                    }
                }
            });
            return keepRow;
        })
            .sort(function (row1, row2) {
            var score = 0;
            _this.state.columns.forEach(function (col, i) {
                if (col.sort !== 'none' && row1.columns[i] !== row2.columns[i]) {
                    score += (row1.columns[i] > row2.columns[i] ? 1 : -1) * (Math.pow(10, 3 - i)) * (col.sort === 'asc' ? -1 : 1);
                }
            });
            return score;
        });
        return (React.createElement("div", { className: 'workspace-editor' },
            React.createElement("header", { className: 'editor-header entity' },
                React.createElement("div", { className: 'primary-toolbar' },
                    React.createElement("div", { className: 'main-toolbar' },
                        React.createElement("h2", null,
                            "All Entities ",
                            React.createElement("i", { className: 'fa fa-plus-circle add button', title: 'Add new entity', "aria-hidden": 'true', onClick: this.addNew.bind(this) }))),
                    React.createElement("div", { className: 'sub-toolbar' },
                        React.createElement("i", { className: 'fa fa-folder-open-o', "aria-hidden": 'true', onClick: this.addViewTab.bind(this) }))),
                React.createElement("div", { className: 'secondary-toolbar' },
                    React.createElement("div", { className: 'tab-bar' },
                        React.createElement("div", { className: 'entity selected' }, "LIST")))),
            React.createElement("section", { className: 'editor-body' },
                React.createElement("table", { className: 'table' },
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("td", null, "#"),
                            React.createElement("td", null, "Label"),
                            React.createElement("td", null, "Type"),
                            customColumns(predicates, this.state.columns, this.updateColumnParams.bind(this), this.rotateSort.bind(this))),
                        React.createElement("tr", null,
                            React.createElement("td", null),
                            React.createElement("td", null),
                            React.createElement("td", null,
                                React.createElement(ComboDropdown_1.NumberComboDropdown, { value: this.state.entityType, typeName: 'entity type', allowNew: false, setValue: function (entityType) { return _this.setState({ entityType: entityType }); }, options: entityTypeOptions, createNewValue: lodash_1.noop, additionalClasses: ['compact'] })),
                            this.state.columns.map(function (col, id) { return (React.createElement("td", { key: "col-" + id },
                                React.createElement("div", { className: 'flex-fill' },
                                    React.createElement("div", null,
                                        React.createElement("select", { value: col.filterType, className: 'padded', onChange: function (e) { return _this.updateColumnParams(id, 'f', e.target.value); } },
                                            React.createElement("option", { value: 'any' }, "Any"),
                                            React.createElement("option", { value: 'exists' }, "Exists"),
                                            React.createElement("option", { value: 'contains' }, "Contains"),
                                            React.createElement("option", { value: 'similar' }, "Similar"))),
                                    React.createElement("div", null,
                                        React.createElement("input", { type: 'text', disabled: col.filterType === 'any' || col.filterType === 'exists', onChange: function (e) { return _this.updateColumnParams(id, 'v', e.target.value); }, value: col.filterValue }))))); }))),
                    React.createElement("tbody", null, tableData.map(function (row) { return (React.createElement("tr", { key: "entity-" + row.uid },
                        React.createElement("td", null, row.uid),
                        React.createElement("td", null,
                            row.label,
                            " ",
                            React.createElement(AddTabButton_1.AddTabButton, { uid: row.uid, tabType: 'entity' })),
                        React.createElement("td", null, row.entityType ? row.entityType.label : ''),
                        [0, 1, 2].map(function (id) { return (React.createElement("td", { key: "col-val-" + id }, row.columns[id])); }))); }))))));
    };
    return EntityList;
}(React.Component));
EntityList.contextTypes = {
    router: React.PropTypes.object.isRequired
};
EntityList = __decorate([
    mobx_react_1.inject('dataStore', 'modalStore'),
    mobx_react_1.observer,
    __metadata("design:paramtypes", [Object])
], EntityList);
exports.EntityList = EntityList;
//# sourceMappingURL=EntityList.js.map

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

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
var React = __webpack_require__(0);
var AddTabButton_1 = __webpack_require__(5);
var SearchBar_1 = __webpack_require__(11);
var RecursiveTree_1 = __webpack_require__(21);
var mobx_react_1 = __webpack_require__(1);
var EntityRecursiveTree = (function (_super) {
    __extends(EntityRecursiveTree, _super);
    function EntityRecursiveTree() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return EntityRecursiveTree;
}(RecursiveTree_1.RecursiveTree));
var EntityTypeList = (function (_super) {
    __extends(EntityTypeList, _super);
    function EntityTypeList() {
        var _this = _super.call(this) || this;
        _this.state = {
            filterFunc: function () { return true; },
            mode: 'list'
        };
        return _this;
    }
    EntityTypeList.prototype.addNew = function () {
        var a = {
            name: 'entity_type',
            complete: function () {
            },
            cancel: function () { console.log('cancel'); },
            settings: {}
        };
        this.props.modalStore.addModal(a);
    };
    EntityTypeList.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { className: 'workspace-editor' },
            React.createElement("header", { className: 'editor-header entity_type' },
                React.createElement("div", { className: 'primary-toolbar' },
                    React.createElement("div", { className: 'main-toolbar' },
                        React.createElement("h2", null,
                            "All Entity Types ",
                            React.createElement("i", { className: 'fa fa-plus-circle add button', "aria-hidden": 'true', title: 'Add new entity type', onClick: this.addNew.bind(this) })))),
                React.createElement("div", { className: 'secondary-toolbar' },
                    React.createElement("div", { className: 'tab-bar' },
                        React.createElement("div", { className: 'entity_type ' + (this.state.mode === 'list' ? 'selected' : ''), onClick: function () { return _this.setState({ mode: 'list' }); } }, "LIST"),
                        React.createElement("div", { className: 'entity_type ' + (this.state.mode === 'tree' ? 'selected' : ''), onClick: function () { return _this.setState({ mode: 'tree' }); } }, "TREE")))),
            React.createElement("section", { className: 'editor-body' },
                React.createElement(SearchBar_1.SearchBar, { getValue: function (a) { return a.label; }, setFilterFunc: function (f) { return _this.setState({ filterFunc: f }); } }),
                this.state.mode === 'list' ? (React.createElement("table", { className: 'table gap' },
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("td", null, "#"),
                            React.createElement("td", null, "Name"),
                            React.createElement("td", null, "Parent"),
                            React.createElement("td", null, "Description"))),
                    React.createElement("tbody", null, this.props.dataStore.dataStore.all.entity_type.value.filter(this.state.filterFunc).map(function (entityType) {
                        if (entityType.uid === null) {
                            throw new Error('Found entity with no id');
                        }
                        return (React.createElement("tr", { key: "entityType-" + entityType.uid },
                            React.createElement("td", null,
                                entityType.uid,
                                " ",
                                React.createElement(AddTabButton_1.AddTabButton, { uid: entityType.uid, tabType: 'entity_type' })),
                            React.createElement("td", null, entityType.label),
                            React.createElement("td", null, entityType.parent),
                            React.createElement("td", null, entityType.description)));
                    })))) : (React.createElement("div", { className: 'tree-root' },
                    React.createElement(EntityRecursiveTree, { data: this.props.dataStore.dataStore.all.entity_type.value, tabType: 'entity_type', parentId: null, dataStore: this.props.dataStore }))))));
    };
    return EntityTypeList;
}(React.Component));
EntityTypeList = __decorate([
    mobx_react_1.inject('dataStore', 'modalStore'),
    mobx_react_1.observer,
    __metadata("design:paramtypes", [])
], EntityTypeList);
exports.EntityTypeList = EntityTypeList;
//# sourceMappingURL=EntityTypeList.js.map

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

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
var React = __webpack_require__(0);
var AddTabButton_1 = __webpack_require__(5);
var mobx_react_1 = __webpack_require__(1);
var SearchBar_1 = __webpack_require__(11);
var PredicateList = (function (_super) {
    __extends(PredicateList, _super);
    function PredicateList() {
        var _this = _super.call(this) || this;
        _this.state = {
            filterFunc: function () { return true; }
        };
        return _this;
    }
    PredicateList.prototype.addNew = function () {
        var a = {
            name: 'predicate',
            complete: function () {
            },
            cancel: function () { console.log('cancel'); },
            settings: {
                initialName: ''
            }
        };
        this.props.modalStore.addModal(a);
    };
    PredicateList.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { className: 'workspace-editor' },
            React.createElement("header", { className: 'editor-header predicate' },
                React.createElement("div", { className: 'primary-toolbar' },
                    React.createElement("div", { className: 'main-toolbar' },
                        React.createElement("h2", null,
                            "All Properties ",
                            React.createElement("i", { className: 'fa fa-plus-circle add button', title: 'Add new property', "aria-hidden": 'true', onClick: this.addNew.bind(this) })))),
                React.createElement("div", { className: 'secondary-toolbar' },
                    React.createElement("div", { className: 'tab-bar' },
                        React.createElement("div", { className: 'predicate selected' }, "LIST")))),
            React.createElement("section", { className: 'editor-body' },
                React.createElement(SearchBar_1.SearchBar, { getValue: function (a) { return a.label; }, setFilterFunc: function (f) { return _this.setState({ filterFunc: f }); } }),
                React.createElement("table", { className: 'table gap' },
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("td", null, "#"),
                            React.createElement("td", null, "Label"),
                            React.createElement("td", null, "Domain"),
                            React.createElement("td", null, "Range"),
                            React.createElement("td", null, "Uses"))),
                    React.createElement("tbody", null, this.props.dataStore.dataStore.all.predicate.value.filter(this.state.filterFunc).map(function (predicate) {
                        var entityType = _this.props.dataStore.dataStore.all.entity_type.value.find(function (t) { return t.uid === predicate.domain; });
                        var rangeType = predicate.rangeIsReference ?
                            _this.props.dataStore.dataStore.all.entity_type.value.find(function (t) { return t.uid === predicate.range; }) :
                            predicate.range;
                        if (predicate.uid === null) {
                            throw new Error('Found predicate with null uid');
                        }
                        return (React.createElement("tr", { key: "predicate-" + predicate.uid },
                            React.createElement("td", null,
                                predicate.uid,
                                " ",
                                React.createElement(AddTabButton_1.AddTabButton, { uid: predicate.uid, tabType: 'predicate' })),
                            React.createElement("td", null, predicate.label),
                            React.createElement("td", null, entityType ? entityType.label : ''),
                            React.createElement("td", null, predicate.rangeIsReference ? rangeType ? rangeType.label : '' : rangeType),
                            React.createElement("td", null, predicate.uses)));
                    }))))));
    };
    return PredicateList;
}(React.Component));
PredicateList = __decorate([
    mobx_react_1.inject('dataStore', 'modalStore'),
    mobx_react_1.observer,
    __metadata("design:paramtypes", [])
], PredicateList);
exports.PredicateList = PredicateList;
//# sourceMappingURL=PredicateList.js.map

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

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
var React = __webpack_require__(0);
var AddTabButton_1 = __webpack_require__(5);
var mobx_react_1 = __webpack_require__(1);
var SearchBar_1 = __webpack_require__(11);
var RecursiveTree_1 = __webpack_require__(21);
var SourceRecursiveTree = (function (_super) {
    __extends(SourceRecursiveTree, _super);
    function SourceRecursiveTree() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SourceRecursiveTree;
}(RecursiveTree_1.RecursiveTree));
var SourceList = (function (_super) {
    __extends(SourceList, _super);
    function SourceList() {
        var _this = _super.call(this) || this;
        _this.state = {
            filterFunc: function () { return true; },
            mode: 'list'
        };
        return _this;
    }
    SourceList.prototype.addNew = function () {
        var a = {
            name: 'source',
            complete: function () {
            },
            cancel: function () { console.log('cancel'); },
            settings: {}
        };
        this.props.modalStore.addModal(a);
    };
    SourceList.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { className: 'workspace-editor' },
            React.createElement("header", { className: 'editor-header source' },
                React.createElement("div", { className: 'primary-toolbar' },
                    React.createElement("div", { className: 'main-toolbar' },
                        React.createElement("h2", null,
                            "All Sources ",
                            React.createElement("i", { className: 'fa fa-plus-circle add button', "aria-hidden": 'true', title: 'Add new source', onClick: this.addNew.bind(this) })))),
                React.createElement("div", { className: 'secondary-toolbar' },
                    React.createElement("div", { className: 'tab-bar' },
                        React.createElement("div", { className: 'source ' + (this.state.mode === 'list' ? 'selected' : ''), onClick: function () { return _this.setState({ mode: 'list' }); } }, "LIST"),
                        React.createElement("div", { className: 'source ' + (this.state.mode === 'tree' ? 'selected' : ''), onClick: function () { return _this.setState({ mode: 'tree' }); } }, "TREE")))),
            React.createElement("section", { className: 'editor-body' },
                React.createElement(SearchBar_1.SearchBar, { getValue: function (a) { return a.label; }, setFilterFunc: function (f) { return _this.setState({ filterFunc: f }); } }),
                this.state.mode === 'list' ? (React.createElement("table", { className: 'table gap' },
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("td", null, "#"),
                            React.createElement("td", null, "Name"),
                            React.createElement("td", null, "Parent"))),
                    React.createElement("tbody", null, this.props.dataStore.dataStore.all.source.value.filter(this.state.filterFunc).map(function (source) {
                        if (source.uid === null) {
                            throw new Error('Encountered source with null uid');
                        }
                        return (React.createElement("tr", { key: "source-" + source.uid },
                            React.createElement("td", null,
                                source.uid,
                                " ",
                                React.createElement(AddTabButton_1.AddTabButton, { uid: source.uid, tabType: 'source' })),
                            React.createElement("td", null, source.label),
                            React.createElement("td", null, source.parent)));
                    })))) : (React.createElement("div", { className: 'tree-root' },
                    React.createElement(SourceRecursiveTree, { data: this.props.dataStore.dataStore.all.source.value, tabType: 'source', parentId: null, dataStore: this.props.dataStore }))))));
    };
    return SourceList;
}(React.Component));
SourceList = __decorate([
    mobx_react_1.inject('dataStore', 'modalStore'),
    mobx_react_1.observer,
    __metadata("design:paramtypes", [])
], SourceList);
exports.SourceList = SourceList;
//# sourceMappingURL=SourceList.js.map

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview Searchboc for sidebar
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

var React = __webpack_require__(0);
var ComboDropdown_1 = __webpack_require__(6);
var ApiService_1 = __webpack_require__(2);
exports.SearchBox = function (props, context) {
    var entities = props.dataStore.dataStore.all.entity.value.map(function (entity) {
        return ({ key: entity.label, value: ApiService_1.AppUrls.entity + "/" + entity.uid });
    });
    var entityTypes = props.dataStore.dataStore.all.entity_type.value.map(function (entityType) {
        return ({ key: entityType.label, value: ApiService_1.AppUrls.entity_type + "/" + entityType.uid });
    });
    var predicates = props.dataStore.dataStore.all.predicate.value.map(function (predicate) {
        return ({ key: predicate.label, value: ApiService_1.AppUrls.predicate + "/" + predicate.uid });
    });
    var sources = props.dataStore.dataStore.all.source.value.map(function (source) {
        return ({ key: source.label, value: ApiService_1.AppUrls.source + "/" + source.uid });
    });
    var all = entities.concat(entityTypes, predicates, sources);
    return (React.createElement("span", null,
        React.createElement("div", { className: 'input-addon-formgroup' },
            React.createElement("span", { className: 'input-addon-icon' },
                React.createElement("i", { className: 'fa fa-search fa-fw' })),
            React.createElement(ComboDropdown_1.StringComboDropdown, { value: { key: '', value: null }, setValue: function (val) {
                    if (val !== null) {
                        context.router.transitionTo("/edit/" + val.value);
                    }
                }, typeName: 'all', options: all, allowNew: false, createNewValue: function () { } }))));
};
exports.SearchBox.contextTypes = { router: React.PropTypes.object.isRequired };
//# sourceMappingURL=SearchBox.js.map

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview Empty workspace for when nothing is open!
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

var React = __webpack_require__(0);
exports.AdvancedSearchWorkspace = function (props) { return (React.createElement("div", { className: 'workspace-editor' },
    React.createElement("h2", null, "Advanced Search"))); };
//# sourceMappingURL=AdvancedSearchWorkspace.js.map

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview Empty workspace for when nothing is open!
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

var React = __webpack_require__(0);
exports.EmptyWorkspace = function () { return (React.createElement("div", { className: 'workspace-editor' },
    React.createElement("h2", null, "There is nothing here"))); };
//# sourceMappingURL=EmptyWorkspace.js.map

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview Empty workspace for when nothing is open!
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

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
var React = __webpack_require__(0);
var ApiService_1 = __webpack_require__(2);
var falcon_core_1 = __webpack_require__(3);
var findParentTree_1 = __webpack_require__(17);
var EditableHeader_1 = __webpack_require__(12);
var EditableFieldComponent_1 = __webpack_require__(9);
var EntityWorkspaceCoreView_1 = __webpack_require__(67);
var EntityWorkspaceReferenceView_1 = __webpack_require__(68);
var mobx_react_1 = __webpack_require__(1);
var HeaderEditableFieldComponent = EditableFieldComponent_1.EditableFieldHOC(EditableHeader_1.EditableHeader);
// What can I do?
// Entity Operations
// - Delete the entity
// - Merge the entity
// - Split the entity
// - Add 'same-as-ses' to the entity
// Records
// - Order records by type, source and date
// - Add new records
// - Adding a new predicate creates a new record with the
//   entity set, the predicate set, the score set to 3, the period set to null, source set to null
//   it also creates a blank entry in the records sub table based on the range of the predicate.
// - New predicates must have a name. The domain is set to the current entitytype but can be changed
//   to one of its parents. The range MUST be set.
// Visualisations:
// - Network graph of entity relationships
var EntityEditorWorkspace = (function (_super) {
    __extends(EntityEditorWorkspace, _super);
    function EntityEditorWorkspace(props, context) {
        var _this = _super.call(this) || this;
        _this.state = {
            tab: 0
        };
        return _this;
    }
    EntityEditorWorkspace.prototype.del = function () {
        var _this = this;
        this.props.dataStore.delItem(falcon_core_1.Entity, ApiService_1.AppUrls.entity, this.props.id)
            .then(function () {
            _this.props.dataStore.closeTab('entity', _this.props.id);
            _this.context.router.transitionTo('/edit/notfound');
        })
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
                                data.record.forEach(function (datum) {
                                    _this.props.dataStore.createTab('entity', datum.entity, 'item');
                                });
                                data.entity.forEach(function (datum) {
                                    _this.props.dataStore.createTab('entity', datum.uid, 'item');
                                });
                            }
                            if (result === 'deleteAll') {
                                Promise.all(data.record.map(function (datum) { return _this.props.dataStore.delItem(falcon_core_1.Record, ApiService_1.AppUrls.record, datum.uid); }))
                                    .then(function () {
                                    _this.del();
                                });
                            }
                        },
                        settings: {
                            conflictingItems: data,
                            message: 'Deleting Entity'
                        }
                    };
                    _this.props.modalStore.addModal(conflictResolutionModal);
                });
            }
        });
    };
    EntityEditorWorkspace.prototype.createNewRecord = function () {
        var entity = this.props.dataStore.dataStore.tabs.entity[this.props.id].value.entity;
        var entityType = this.props.dataStore.dataStore.all.entity_type.value.find(function (t) { return t.uid === entity.entityType; });
        var entityTypeParents = findParentTree_1.findParentTree(entity.entityType, this.props.dataStore.dataStore.all.entity_type.value);
        var predicates = this.props.dataStore.dataStore.all.predicate
            .value.filter(function (pred) { return entityTypeParents.indexOf(pred.domain) !== -1; });
        if (entityType === undefined) {
            throw new Error('Encountered undefined entity type!');
        }
        var modalDef = {
            name: 'record',
            complete: function (data) {
                console.log('Records editor called complete');
                //this.loadData(this.props);
            },
            cancel: function () {
                console.log('Records editor called cancel');
            },
            settings: {
                options: predicates.map(function (pred) { return ({ key: pred.label, value: pred }); }),
                entityUid: this.props.id,
                entityType: entityType.uid
            }
        };
        this.props.modalStore.addModal(modalDef);
    };
    EntityEditorWorkspace.prototype.update = function (data) {
        this.props.dataStore.patchItem(falcon_core_1.Entity, ApiService_1.AppUrls.entity, this.props.id, data);
    };
    EntityEditorWorkspace.prototype.clone = function () {
        var _this = this;
        var entity = this.props.dataStore.dataStore.tabs.entity[this.props.id].value.entity;
        this.props.dataStore.postItem(falcon_core_1.Entity, ApiService_1.AppUrls.entity, falcon_core_1.Serializer.fromJson(falcon_core_1.Entity, {
            label: 'Copy of ' + entity.label,
            entityType: entity.entityType
        }), { clone: this.props.id }).then(function (_a) {
            var id = _a[0];
            return _this.props.dataStore.createTab('entity', id, 'item');
        });
    };
    EntityEditorWorkspace.prototype.render = function () {
        var _this = this;
        var entity = this.props.dataStore.dataStore.tabs.entity[this.props.id].value.entity;
        var potentialParents = this.props.dataStore.dataStore.all.entity.value;
        var parentName = '';
        if (potentialParents !== null && entity.parent !== undefined) {
            var found = potentialParents.find(function (par) { return par.uid === entity.parent; });
            if (found !== undefined) {
                parentName = found.label;
            }
        }
        return (React.createElement("div", { className: 'workspace-editor' },
            React.createElement("header", { className: 'editor-header entity' },
                React.createElement("div", { className: 'primary-toolbar' },
                    React.createElement("div", { className: 'main-toolbar' },
                        React.createElement("i", { className: 'fa fa-cube item-icon' }),
                        React.createElement(HeaderEditableFieldComponent, { value: entity.label, onChange: function (value) { return _this.update({ 'label': value }); } })),
                    React.createElement("div", { className: 'sub-toolbar' },
                        React.createElement("i", { className: 'fa fa-trash delete button', "aria-hidden": 'true', onClick: this.del.bind(this) }),
                        React.createElement("i", { className: 'fa fa-clone button', "aria-hidden": 'true', onClick: this.clone.bind(this) }))),
                React.createElement("div", { className: 'secondary-toolbar' },
                    React.createElement("div", { className: 'tab-bar' },
                        React.createElement("div", { className: 'entity ' + (this.state.tab === 0 ? 'selected' : ''), onClick: function () { return _this.setState({ tab: 0 }); } }, "CORE"),
                        React.createElement("div", { className: 'entity ' + (this.state.tab === 1 ? 'selected' : ''), onClick: function () { return _this.setState({ tab: 1 }); } }, "REFERENCED BY")))),
            this.state.tab === 0 ? (React.createElement(EntityWorkspaceCoreView_1.EntityWorkspaceCoreView, { dataStore: this.props.dataStore, id: this.props.id })) : (React.createElement(EntityWorkspaceReferenceView_1.EntityWorkspaceReferenceView, { dataStore: this.props.dataStore, id: this.props.id }))));
    };
    return EntityEditorWorkspace;
}(React.Component));
EntityEditorWorkspace.contextTypes = {
    router: React.PropTypes.object.isRequired,
    manager: React.PropTypes.object.isRequired
};
EntityEditorWorkspace = __decorate([
    mobx_react_1.inject('dataStore', 'modalStore'),
    mobx_react_1.observer,
    __metadata("design:paramtypes", [Object, Object])
], EntityEditorWorkspace);
exports.EntityEditorWorkspace = EntityEditorWorkspace;
//# sourceMappingURL=EntityEditorWorkspace.js.map

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview Predicate editor workspace
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

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
var React = __webpack_require__(0);
var SameAsEditor_1 = __webpack_require__(16);
var ApiService_1 = __webpack_require__(2);
var falcon_core_1 = __webpack_require__(3);
var AddTabButton_1 = __webpack_require__(5);
var EditableHeader_1 = __webpack_require__(12);
var EditableFieldComponent_1 = __webpack_require__(9);
var EditableParagraph_1 = __webpack_require__(15);
var EditableComboDropdown_1 = __webpack_require__(14);
var mobx_react_1 = __webpack_require__(1);
var HeaderEditableFieldComponent = EditableFieldComponent_1.EditableFieldHOC(EditableHeader_1.EditableHeader);
var ParagraphEditableFieldComponent = EditableFieldComponent_1.EditableFieldHOC(EditableParagraph_1.EditableParagraph);
var SameAsEditableFieldComponent = EditableFieldComponent_1.EditableFieldHOC(SameAsEditor_1.SameAsEditor);
var ComboEditableFieldComponent = EditableFieldComponent_1.EditableFieldHOC(EditableComboDropdown_1.EditableComboDropdown);
var EntityTypeWorkspace = (function (_super) {
    __extends(EntityTypeWorkspace, _super);
    function EntityTypeWorkspace() {
        var _this = _super.call(this) || this;
        _this.state = {};
        return _this;
    }
    EntityTypeWorkspace.prototype.update = function (data) {
        var _this = this;
        var entityType = this.props.dataStore.dataStore.tabs.entity_type[this.props.id].value;
        this.props.dataStore.patchItem(falcon_core_1.EntityType, ApiService_1.AppUrls.entity_type, this.props.id, data)
            .then(function () { return _this.setState({ entityType: Object.assign({}, entityType, data) }); });
    };
    EntityTypeWorkspace.prototype.copy = function () {
        var _this = this;
        var entityType = this.props.dataStore.dataStore.tabs.entity_type[this.props.id].value;
        var newEntityType = falcon_core_1.Serializer.fromJson(falcon_core_1.EntityType, Object.assign({}, falcon_core_1.Serializer.toJson(entityType), { label: 'Copy of ' + entityType.label }));
        this.props.dataStore.postItem(falcon_core_1.EntityType, ApiService_1.AppUrls.entity_type, newEntityType, {})
            .then(function (_a) {
            var id = _a[0];
            _this.props.dataStore.createTab('entity_type', id, 'item');
        });
    };
    EntityTypeWorkspace.prototype.del = function () {
        var _this = this;
        this.props.dataStore.delItem(falcon_core_1.EntityType, ApiService_1.AppUrls.entity_type, this.props.id)
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
                                data.entityType.forEach(function (datum) {
                                    _this.props.dataStore.createTab('entity_type', datum.uid, 'item');
                                });
                                data.predicate.forEach(function (datum) {
                                    _this.props.dataStore.createTab('predicate', datum.uid, 'item');
                                });
                                data.entity.forEach(function (datum) {
                                    _this.props.dataStore.createTab('entity', datum.uid, 'item');
                                });
                            }
                        },
                        settings: {
                            conflictingItems: data,
                            message: 'Deleting Entity Type'
                        }
                    };
                    _this.props.modalStore.addModal(conflictResolutionModal);
                });
            }
        });
    };
    EntityTypeWorkspace.prototype.createEntity = function () {
        var _this = this;
        var a = {
            name: 'entity',
            complete: function (_a) {
                var id = _a[0];
                _this.props.dataStore.createTab('entity', id, 'item');
            },
            cancel: function () { console.log('cancel'); },
            settings: {
                initialName: '',
                initialType: this.props.id
            }
        };
        this.props.modalStore.addModal(a);
    };
    EntityTypeWorkspace.prototype.render = function () {
        var _this = this;
        var entityType = this.props.dataStore.dataStore.tabs.entity_type[this.props.id].value;
        var potentialParents = this.props.dataStore.dataStore.all.entity_type.value;
        var parentName = '';
        if (potentialParents !== null && entityType.parent !== undefined) {
            var found = potentialParents.find(function (par) { return par.uid === entityType.parent; });
            if (found !== undefined) {
                parentName = found.label;
            }
        }
        var potentialParentOptions = potentialParents.map(function (par) { return ({ key: par.label, value: par.uid }); });
        return (React.createElement("div", { className: 'workspace-editor' },
            React.createElement("header", { className: 'editor-header entity_type' },
                React.createElement("div", { className: 'primary-toolbar' },
                    React.createElement("div", { className: 'main-toolbar' },
                        React.createElement("div", { className: 'bread-crumbs' }, entityType.parents.map(function (parent, i) {
                            var parentEntityType = _this.props.dataStore.dataStore.all.entity_type.value.find(function (e) { return e.uid === parent; });
                            return (React.createElement("span", { key: "breadcrumb-" + parent },
                                React.createElement("span", null,
                                    "  ",
                                    parentEntityType.label,
                                    " ",
                                    React.createElement(AddTabButton_1.AddTabButton, { tabType: 'entity_type', uid: parent }),
                                    " "),
                                React.createElement("i", { className: 'fa fa-angle-right' })));
                        })),
                        React.createElement("i", { className: 'fa fa-tag item-icon' }),
                        React.createElement(HeaderEditableFieldComponent, { value: entityType.label, onChange: function (value) { return _this.update({ 'label': value }); } })),
                    React.createElement("div", { className: 'sub-toolbar' },
                        React.createElement("i", { className: 'fa fa-plus add button', "aria-hidden": 'true', onClick: this.createEntity.bind(this) }),
                        React.createElement("i", { className: 'fa fa-trash delete button', "aria-hidden": 'true', onClick: this.del.bind(this) }),
                        React.createElement("i", { className: 'fa fa-clone button', "aria-hidden": 'true', onClick: this.copy.bind(this) }))),
                React.createElement("div", { className: 'secondary-toolbar' },
                    React.createElement("div", { className: 'tab-bar' },
                        React.createElement("div", { className: 'entity_type selected' }, "CORE")))),
            React.createElement("section", { className: 'editor-body' },
                React.createElement("div", { className: 'edit-group' },
                    React.createElement("label", { className: 'small' }, "Parent"),
                    React.createElement(ComboEditableFieldComponent, { value: entityType.parent === null ? { key: '', value: null } : { key: parentName, value: entityType.parent }, onChange: function (value) { return _this.update({ 'parent': value === null ? null : value.value }); }, comboSettings: {
                            options: potentialParentOptions,
                            typeName: 'EntityType'
                        } }),
                    entityType.parent !== null ? (React.createElement(AddTabButton_1.AddTabButton, { tabType: 'entity_type', uid: entityType.parent })) : null),
                React.createElement("div", { className: 'edit-group' },
                    React.createElement("label", { className: 'small' }, "Description"),
                    React.createElement(ParagraphEditableFieldComponent, { value: entityType.description, onChange: function (value) { return _this.update({ 'description': value }); } })),
                React.createElement("div", { className: 'edit-group' },
                    React.createElement(SameAsEditableFieldComponent, { value: entityType.sameAs, onChange: function (value) { return _this.update({ 'sameAs': value }); } })),
                React.createElement("div", null,
                    React.createElement("h4", null, "Direct Children"),
                    React.createElement("ul", null, entityType.children
                        .map(function (child) { return _this.props.dataStore.dataStore.all.entity_type.value.find(function (et) { return et.uid === child; }); })
                        .map(function (childEt) {
                        if (childEt === undefined) {
                            return null;
                        }
                        //TODO: REMOVE !
                        return (React.createElement("li", { key: "dc-" + childEt.label },
                            childEt.label,
                            " ",
                            React.createElement(AddTabButton_1.AddTabButton, { tabType: 'entity_type', uid: childEt.uid })));
                    }))))));
    };
    return EntityTypeWorkspace;
}(React.Component));
EntityTypeWorkspace.contextTypes = {
    router: React.PropTypes.object.isRequired
};
EntityTypeWorkspace = __decorate([
    mobx_react_1.inject('dataStore', 'modalStore'),
    mobx_react_1.observer,
    __metadata("design:paramtypes", [])
], EntityTypeWorkspace);
exports.EntityTypeWorkspace = EntityTypeWorkspace;
//# sourceMappingURL=EntityTypeWorkspace.js.map

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview Empty workspace for when nothing is open!
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

var React = __webpack_require__(0);
var EntityList_1 = __webpack_require__(55);
var PredicateList_1 = __webpack_require__(57);
var SourceList_1 = __webpack_require__(58);
var EntityTypeList_1 = __webpack_require__(56);
exports.ObjectListWorkspace = function (props) { return (React.createElement("div", { className: 'workspace-editor object-list' }, (function () {
    switch (props.listType) {
        case 'entity':
            return (React.createElement(EntityList_1.EntityList, { query: props.query }));
        case 'source':
            return (React.createElement(SourceList_1.SourceList, null));
        case 'predicate':
            return (React.createElement(PredicateList_1.PredicateList, null));
        case 'entity_type':
            return (React.createElement(EntityTypeList_1.EntityTypeList, null));
    }
})())); };
//# sourceMappingURL=ObjectListWorkspace.js.map

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview Predicate editor workspace
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

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
var React = __webpack_require__(0);
var react_router_1 = __webpack_require__(7);
var SameAsEditor_1 = __webpack_require__(16);
var ApiService_1 = __webpack_require__(2);
var falcon_core_1 = __webpack_require__(3);
var EditableHeader_1 = __webpack_require__(12);
var EditableFieldComponent_1 = __webpack_require__(9);
var EditableParagraph_1 = __webpack_require__(15);
var PredicateDescription_1 = __webpack_require__(22);
var literalTypes_1 = __webpack_require__(24);
var mobx_react_1 = __webpack_require__(1);
var HeaderEditableFieldComponent = EditableFieldComponent_1.EditableFieldHOC(EditableHeader_1.EditableHeader);
var ParagraphEditableFieldComponent = EditableFieldComponent_1.EditableFieldHOC(EditableParagraph_1.EditableParagraph);
var SameAsEditableFieldComponent = EditableFieldComponent_1.EditableFieldHOC(SameAsEditor_1.SameAsEditor);
// - Should state the number of times this predicate is used
// - Widening the domain or range always okay
// - Narrowing should check for conflicts and return them
// - Asks 'Delete conflicting records?'
// - Strong check (double button press or type) to confirm
// - Changing name/description/sameAs - absolutly fine
// - Cannot change 'readonly'
var PredicateEditorWorkspace = (function (_super) {
    __extends(PredicateEditorWorkspace, _super);
    function PredicateEditorWorkspace() {
        var _this = _super.call(this) || this;
        _this.state = {
            records: []
        };
        return _this;
    }
    PredicateEditorWorkspace.prototype.updatePredicate = function (field, value, rangeIsReferenceOverride) {
        if (rangeIsReferenceOverride === void 0) { rangeIsReferenceOverride = null; }
        var predicate = this.props.dataStore.dataStore.tabs.predicate[this.props.id].value;
        if (predicate === null) {
            console.warn('Tried to edit unready predicate');
            return;
        }
        var rangeIsReferenceVal = rangeIsReferenceOverride === null
            ? predicate.rangeIsReference : rangeIsReferenceOverride;
        this.props.dataStore.patchItem(falcon_core_1.Predicate, ApiService_1.AppUrls.predicate, predicate.uid, (_a = {},
            _a[field] = value,
            _a.rangeIsReference = rangeIsReferenceVal,
            _a));
        var _a;
    };
    PredicateEditorWorkspace.prototype.copy = function () {
        var _this = this;
        var predicate = this.props.dataStore.dataStore.tabs.predicate[this.props.id].value;
        var newPredicate = falcon_core_1.Serializer.fromJson(falcon_core_1.Predicate, Object.assign({}, falcon_core_1.Serializer.toJson(predicate), { label: 'Copy of ' + predicate.label }));
        this.props.dataStore.postItem(falcon_core_1.Predicate, ApiService_1.AppUrls.predicate, newPredicate, {})
            .then(function (_a) {
            var id = _a[0];
            _this.props.dataStore.createTab('predicate', id, 'item');
        });
    };
    PredicateEditorWorkspace.prototype.del = function () {
        var _this = this;
        this.props.dataStore.delItem(falcon_core_1.Predicate, ApiService_1.AppUrls.predicate, this.props.id)
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
                                data.forEach(function (datum) {
                                    _this.props.dataStore.createTab('entity', datum.entity, 'item');
                                });
                            }
                            if (result === 'deleteAll') {
                                Promise.all(data.record.map(function (datum) { return _this.props.dataStore.delItem(falcon_core_1.Record, ApiService_1.AppUrls.record, datum.uid); }))
                                    .then(function () {
                                    _this.del();
                                });
                            }
                        },
                        settings: {
                            conflictingItems: data,
                            message: 'Deleting Predicate'
                        }
                    };
                    _this.props.modalStore.addModal(conflictResolutionModal);
                });
            }
        });
    };
    PredicateEditorWorkspace.prototype.render = function () {
        var _this = this;
        var predicate = this.props.dataStore.dataStore.tabs.predicate[this.props.id].value;
        var entityTypes = this.props.dataStore.dataStore.all.entity_type.value;
        var currentDomainEntityType = entityTypes.find(function (t) { return t.uid == predicate.domain; });
        var currentDomainEntityTypeName = '';
        if (currentDomainEntityType !== undefined) {
            currentDomainEntityTypeName = currentDomainEntityType.label;
        }
        var domain = { key: currentDomainEntityTypeName, value: predicate.domain };
        var range = { key: '', value: {
                isReference: predicate.rangeIsReference,
                value: predicate.range
            } };
        if (predicate.rangeIsReference) {
            var currentRangeEntityType = entityTypes.find(function (t) { return t.uid === predicate.range; });
            if (currentRangeEntityType !== undefined) {
                range.key = currentRangeEntityType.label;
            }
        }
        else {
            var literalType = literalTypes_1.literalTypes.find(function (t) { return t.value === predicate.range; });
            if (literalType !== undefined) {
                range.key = literalType.label;
            }
        }
        var entityTypeOptions = entityTypes.map(function (t) {
            if (t.uid === null) {
                throw new Error('Encountered entity type with no id!');
            }
            return { key: t.label, value: t.uid };
        });
        var literalTypeOptions = literalTypes_1.literalTypes.map(function (t) { return ({ key: t.label, value: { value: t.label, isReference: false } }); });
        var entityTypeMap2 = entityTypeOptions.map(function (e) { return ({ key: e.key, value: { isReference: true, value: e.value.toString() } }); });
        return (React.createElement("div", { className: 'workspace-editor' },
            React.createElement("header", { className: 'editor-header predicate' },
                React.createElement("div", { className: 'primary-toolbar' },
                    React.createElement("div", { className: 'main-toolbar' },
                        React.createElement("i", { className: 'fa fa-long-arrow-right item-icon' }),
                        React.createElement(HeaderEditableFieldComponent, { value: predicate.label, onChange: function (value) { return _this.updatePredicate('label', value); } })),
                    React.createElement("div", { className: 'sub-toolbar' },
                        React.createElement("i", { className: 'fa fa-trash delete button', "aria-hidden": 'true', onClick: this.del.bind(this) }),
                        React.createElement("i", { className: 'fa fa-clone button', "aria-hidden": 'true', onClick: this.copy.bind(this) }))),
                React.createElement("div", { className: 'secondary-toolbar' },
                    React.createElement("div", { className: 'tab-bar' },
                        React.createElement("div", { className: 'predicate selected' }, "CORE"),
                        React.createElement("div", { style: { display: 'none' }, className: 'predicate' }, "SAME AS")))),
            React.createElement("section", { className: 'editor-body' },
                React.createElement("div", null,
                    React.createElement(react_router_1.Link, { to: "/edit/entity?col1p=" + this.props.id + "&col1f=exists" },
                        "Uses: ",
                        predicate.uses)),
                React.createElement("div", { className: 'edit-group' },
                    React.createElement("label", { className: 'small' }, "Description"),
                    React.createElement(ParagraphEditableFieldComponent, { value: predicate.description, onChange: function (value) { return _this.updatePredicate('description', value); } })),
                React.createElement("div", { className: 'edit-group' },
                    React.createElement("label", { className: 'small' }, "Typing"),
                    React.createElement(PredicateDescription_1.PredicateDescription, { domain: domain, range: range, domainChanged: function (value) { return _this.updatePredicate('domain', value.value); }, rangeChanged: function (value) { return _this.updatePredicate('range', value.value.value, value.value.isReference); }, mode: 'editSingle', domainOptions: entityTypeOptions, rangeOptions: literalTypeOptions.concat(entityTypeMap2) })),
                React.createElement("div", null,
                    React.createElement(SameAsEditableFieldComponent, { value: predicate.sameAs, onChange: function (value) { return _this.updatePredicate('sameAs', value); } })))));
    };
    return PredicateEditorWorkspace;
}(React.Component));
PredicateEditorWorkspace.contextTypes = {
    router: React.PropTypes.object.isRequired
};
PredicateEditorWorkspace = __decorate([
    mobx_react_1.inject('dataStore', 'modalStore'),
    mobx_react_1.observer,
    __metadata("design:paramtypes", [])
], PredicateEditorWorkspace);
exports.PredicateEditorWorkspace = PredicateEditorWorkspace;
//# sourceMappingURL=PredicateEditorWorkspace.js.map

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview Predicate editor workspace
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

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
var React = __webpack_require__(0);
var SameAsEditor_1 = __webpack_require__(16);
var ApiService_1 = __webpack_require__(2);
var falcon_core_1 = __webpack_require__(3);
var EditableHeader_1 = __webpack_require__(12);
var EditableFieldComponent_1 = __webpack_require__(9);
var EditableParagraph_1 = __webpack_require__(15);
var EditableComboDropdown_1 = __webpack_require__(14);
var lodash_1 = __webpack_require__(4);
var mobx_react_1 = __webpack_require__(1);
var AddTabButton_1 = __webpack_require__(5);
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

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview Empty workspace for when nothing is open!
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = __webpack_require__(0);
var RecordsEditor_1 = __webpack_require__(43);
var ApiService_1 = __webpack_require__(2);
var falcon_core_1 = __webpack_require__(3);
var lodash_1 = __webpack_require__(4);
var AddTabButton_1 = __webpack_require__(5);
var findParentTree_1 = __webpack_require__(17);
var EditableFieldComponent_1 = __webpack_require__(9);
var EditableComboDropdown_1 = __webpack_require__(14);
var ComboEditableFieldComponent = EditableFieldComponent_1.EditableFieldHOC(EditableComboDropdown_1.EditableComboDropdown);
// What can I do?
// Entity Operations
// - Delete the entity
// - Merge the entity
// - Split the entity
// - Add 'same-as-ses' to the entity
// Records
// - Order records by type, source and date
// - Add new records
// - Adding a new predicate creates a new record with the
//   entity set, the predicate set, the score set to 3, the period set to null, source set to null
//   it also creates a blank entry in the records sub table based on the range of the predicate.
// - New predicates must have a name. The domain is set to the current entitytype but can be changed
//   to one of its parents. The range MUST be set.
// Visualisations:
// - Network graph of entity relationships
var EntityWorkspaceCoreView = (function (_super) {
    __extends(EntityWorkspaceCoreView, _super);
    function EntityWorkspaceCoreView(props, context) {
        var _this = _super.call(this) || this;
        _this.state = {
            comboValue: { key: 'test', value: null },
            comboSearchValue: ''
        };
        return _this;
    }
    EntityWorkspaceCoreView.prototype.update = function (data) {
        this.props.dataStore.patchItem(falcon_core_1.Entity, ApiService_1.AppUrls.entity, this.props.id, data);
    };
    EntityWorkspaceCoreView.prototype.render = function () {
        var _this = this;
        var entity = this.props.dataStore.dataStore.tabs.entity[this.props.id].value.entity;
        var entityType = this.props.dataStore.dataStore.all.entity_type.value.find(function (t) { return t.uid === entity.entityType; });
        if (entityType === undefined || entityType.uid === null) {
            throw new Error('Encountered undefined entity type or entity type with null id');
        }
        var potentialParents = this.props.dataStore.dataStore.all.entity.value;
        var entityTypeParents = findParentTree_1.findParentTree(entity.entityType, this.props.dataStore.dataStore.all.entity_type.value);
        var predicates = this.props.dataStore.dataStore.all.predicate
            .value.filter(function (pred) { return entityTypeParents.indexOf(pred.domain) !== -1; });
        var sources = this.props.dataStore.dataStore.all.source.value;
        var records = lodash_1.groupBy(this.props.dataStore.dataStore.tabs.entity[this.props.id].value.records, 'predicate');
        var options = predicates.map(function (pred) { return ({ key: pred.label, value: pred.uid, meta: pred }); });
        var parentName = '';
        if (potentialParents !== null && entity.parent !== undefined) {
            var found = potentialParents.find(function (par) { return par.uid === entity.parent; });
            if (found !== undefined) {
                parentName = found.label;
            }
        }
        return (React.createElement("section", { className: 'editor-body' },
            React.createElement("div", { className: 'flex-fill' },
                React.createElement("div", { className: 'flex-fill' },
                    React.createElement("div", null,
                        React.createElement("label", { className: 'small' }, "Type"),
                        entityType.label,
                        " ",
                        React.createElement(AddTabButton_1.AddTabButton, { uid: entityType.uid, tabType: 'entity_type' }))),
                React.createElement("div", { style: { flex: 1 } },
                    React.createElement("label", { className: 'small' }, "Parent"),
                    React.createElement(ComboEditableFieldComponent, { value: { key: parentName, value: entity.parent }, onChange: function (value) { return _this.update({ 'parent': value === null ? null : value.value }); }, comboSettings: {
                            options: potentialParents.map(function (par) { return ({ key: par.label, value: par.uid }); }),
                            typeName: 'Entity'
                        } }),
                    entity.parent !== null ? (React.createElement(AddTabButton_1.AddTabButton, { tabType: 'entity', uid: entity.parent })) : null)),
            React.createElement("div", { className: 'edit-group' },
                React.createElement(RecordsEditor_1.RecordsEditor, { dimension: 'predicates', entityExists: true, id: this.props.id, records: records, onChange: function () { }, predicates: predicates, sources: sources, entityTypeId: entityType.uid }))));
    };
    return EntityWorkspaceCoreView;
}(React.Component));
EntityWorkspaceCoreView.contextTypes = {
    router: React.PropTypes.object.isRequired
};
exports.EntityWorkspaceCoreView = EntityWorkspaceCoreView;
//# sourceMappingURL=EntityWorkspaceCoreView.js.map

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview Empty workspace for when nothing is open!
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = __webpack_require__(0);
var ApiService_1 = __webpack_require__(2);
var falcon_core_1 = __webpack_require__(3);
var AddTabButton_1 = __webpack_require__(5);
// What can I do?
// Entity Operations
// - Delete the entity
// - Merge the entity
// - Split the entity
// - Add 'same-as-ses' to the entity
// Records
// - Order records by type, source and date
// - Add new records
// - Adding a new predicate creates a new record with the
//   entity set, the predicate set, the score set to 3, the period set to null, source set to null
//   it also creates a blank entry in the records sub table based on the range of the predicate.
// - New predicates must have a name. The domain is set to the current entitytype but can be changed
//   to one of its parents. The range MUST be set.
// Visualisations:
// - Network graph of entity relationships
var EntityWorkspaceReferenceView = (function (_super) {
    __extends(EntityWorkspaceReferenceView, _super);
    function EntityWorkspaceReferenceView(props, context) {
        var _this = _super.call(this) || this;
        _this.state = {
            comboValue: { key: 'test', value: '' },
            comboSearchValue: ''
        };
        return _this;
    }
    EntityWorkspaceReferenceView.prototype.update = function (data) {
        this.props.dataStore.patchItem(falcon_core_1.Entity, ApiService_1.AppUrls.entity, this.props.id, data);
    };
    EntityWorkspaceReferenceView.prototype.render = function () {
        var _this = this;
        return (React.createElement("section", { className: 'editor-body' },
            React.createElement("h2", null, "References"),
            React.createElement("table", { className: 'table' },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", null, "Entity"),
                        React.createElement("th", null, "Property"))),
                React.createElement("tbody", null, this.props.dataStore.dataStore.tabs.entity[this.props.id].value.referenceRecords.map(function (record) {
                    return (React.createElement("tr", { key: "record-" + record.uid },
                        React.createElement("td", null,
                            _this.props.dataStore.dataStore.all.entity.value.find(function (entity) { return entity.uid === record.entity; }).label,
                            " ",
                            React.createElement(AddTabButton_1.AddTabButton, { tabType: 'entity', uid: record.entity })),
                        React.createElement("td", null,
                            _this.props.dataStore.dataStore.all.predicate.value.find(function (predicate) { return predicate.uid === record.predicate; }).label,
                            " ",
                            React.createElement(AddTabButton_1.AddTabButton, { tabType: 'predicate', uid: record.predicate }))));
                })))));
    };
    return EntityWorkspaceReferenceView;
}(React.Component));
EntityWorkspaceReferenceView.contextTypes = {
    router: React.PropTypes.object.isRequired
};
exports.EntityWorkspaceReferenceView = EntityWorkspaceReferenceView;
//# sourceMappingURL=EntityWorkspaceReferenceView.js.map

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview Unified export of workspaces
 * @author <a href="mailto:tim.hollies@warwick.ac.uk" />Tim Hollies</a>
 * @version 0.2.0
 */

var EmptyWorkspace_1 = __webpack_require__(61);
exports.EmptyWorkspace = EmptyWorkspace_1.EmptyWorkspace;
var EntityEditorWorkspace_1 = __webpack_require__(62);
exports.EntityEditorWorkspace = EntityEditorWorkspace_1.EntityEditorWorkspace;
var EntityTypeWorkspace_1 = __webpack_require__(63);
exports.EntityTypeWorkspace = EntityTypeWorkspace_1.EntityTypeWorkspace;
var SourceEditorWorkspace_1 = __webpack_require__(66);
exports.SourceEditorWorkspace = SourceEditorWorkspace_1.SourceEditorWorkspace;
var PredicateEditorWorkspace_1 = __webpack_require__(65);
exports.PredicateEditorWorkspace = PredicateEditorWorkspace_1.PredicateEditorWorkspace;
var AdvancedSearchWorkspace_1 = __webpack_require__(60);
exports.AdvancedSearchWorkspace = AdvancedSearchWorkspace_1.AdvancedSearchWorkspace;
var ObjectListWorkspace_1 = __webpack_require__(64);
exports.ObjectListWorkspace = ObjectListWorkspace_1.ObjectListWorkspace;
//# sourceMappingURL=workspace.js.map

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
var falcon_core_1 = __webpack_require__(3);
var ApiService_1 = __webpack_require__(2);
var DataStore_1 = __webpack_require__(71);
var react_sortable_hoc_1 = __webpack_require__(20);
var mobx_1 = __webpack_require__(26);
var lodash_1 = __webpack_require__(4);
var moment = __webpack_require__(19);
var DataController = (function () {
    function DataController(api) {
        this.api = api;
        this.dataStore = lodash_1.cloneDeep(DataStore_1.emptyDataStore);
        this.tabs = [];
        if (typeof window !== 'undefined') {
            var tabString = window.localStorage.getItem('open_tabs');
            if (tabString !== null) {
                this.tabs = JSON.parse(tabString);
            }
        }
    }
    // checks that the page exists and adds it to tabs if necessery
    DataController.prototype.enterPage = function (workspace, uid, other) {
        if (!lodash_1.isNaN(uid)) {
            if (lodash_1.find(this.tabs, function (tab) { return tab.tabType === workspace && tab.uid == uid; }) === undefined) {
                this.tabs = this.tabs.concat([{ tabType: workspace, uid: uid, tabClass: 'item' }]);
                return false;
            }
        }
        if (other !== null) {
            this.entitySearchColumns = [other['col1p'], other['col2p'], other['col3p']].filter(function (a) { return a !== undefined; });
        }
        else {
            this.entitySearchColumns = [];
        }
        return true;
    };
    DataController.prototype.loadTabData = function (tab) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (tab.tabClass !== 'item') {
                    return [2 /*return*/, new falcon_core_1.Entity()];
                }
                switch (tab.tabType) {
                    case 'entity':
                        return [2 /*return*/, Promise.all([
                                this.api.getItem(falcon_core_1.Entity, ApiService_1.AppUrls.entity, tab.uid),
                                this.api.getCollection(falcon_core_1.Record, ApiService_1.AppUrls.record, { entity: tab.uid }),
                                this.api.getCollection(falcon_core_1.Record, ApiService_1.AppUrls.record, { value_type: 'entity', value_entity: tab.uid })
                            ]).then(function (_a) {
                                var entity = _a[0], records = _a[1], referenceRecords = _a[2];
                                return ({ entity: entity, records: records, referenceRecords: referenceRecords });
                            })];
                    case 'predicate':
                        return [2 /*return*/, this.api.getItem(falcon_core_1.Predicate, ApiService_1.AppUrls.predicate, tab.uid)];
                    case 'entity_type':
                        return [2 /*return*/, this.api.getItem(falcon_core_1.EntityType, ApiService_1.AppUrls.entity_type, tab.uid)];
                    case 'source':
                        return [2 /*return*/, Promise.all([
                                this.api.getItem(falcon_core_1.Source, ApiService_1.AppUrls.source, tab.uid),
                                this.api.getCollection(falcon_core_1.SourceElement, ApiService_1.AppUrls.source_element, { source: tab.uid })
                            ]).then(function (_a) {
                                var source = _a[0], source_element = _a[1];
                                return ({ source: source, source_element: source_element });
                            })];
                    default:
                        throw new Error('Unexpected tab type requested');
                }
                return [2 /*return*/];
            });
        });
    };
    /*
    * Loads required data from the server
    * @return Promise returning a boolean indicating whether the operation was succesful
    */
    DataController.prototype.update = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var groupedTabs, tabPromise, allPromise;
            return __generator(this, function (_a) {
                groupedTabs = lodash_1.groupBy(this.tabs, 'tabType');
                if (lodash_1.find(this.tabs, function (tab) { return tab.tabType === 'source' && tab.uid === _this.defaultSource; }) === undefined) {
                    this.defaultSource = null;
                }
                tabPromise = Promise.all(Object.keys(groupedTabs).map(function (tabType) {
                    return Promise.all(groupedTabs[tabType].map(function (tab) {
                        return _this.loadTabData(tab)
                            .then(function (value) {
                            return _a = {}, _a[parseInt(tab.uid)] = { value: value, lastUpdate: moment() }, _a;
                            var _a;
                        })
                            .catch(function (err) {
                            _this.tabs = _this.tabs.filter(function (tab2) { return tab2 !== tab; });
                            _this.saveTabs();
                            // propogate the error
                            throw err;
                        });
                    }))
                        .then(function (tabData) {
                        return _a = {}, _a[tabType] = Object.assign.apply(Object, [{}].concat(tabData)), _a;
                        var _a;
                    });
                }));
                allPromise = Promise.all([
                    this.api.getCollection(falcon_core_1.Predicate, ApiService_1.AppUrls.predicate, {}),
                    this.api.getCollection(falcon_core_1.Source, ApiService_1.AppUrls.source, {}),
                    this.api.getCollection(falcon_core_1.Entity, ApiService_1.AppUrls.entity, {}),
                    this.api.getCollection(falcon_core_1.EntityType, ApiService_1.AppUrls.entity_type, {}),
                    this.api.getItem(falcon_core_1.ElementSet, ApiService_1.AppUrls.element_set, 1)
                ])
                    .then(function (_a) {
                    var predicates = _a[0], sources = _a[1], entities = _a[2], entityType = _a[3], dublinCore = _a[4];
                    return {
                        predicate: { value: predicates, lastUpdate: moment() },
                        source: { value: sources, lastUpdate: moment() },
                        entity: { value: entities, lastUpdate: moment() },
                        entity_type: { value: entityType, lastUpdate: moment() },
                        dublinCore: { value: dublinCore, lastUpdate: moment() }
                    };
                });
                return [2 /*return*/, Promise.all([tabPromise, allPromise])
                        .then(mobx_1.action(function (_a) {
                        var tabsArray = _a[0], all = _a[1];
                        return __awaiter(_this, void 0, void 0, function () {
                            var tabs, _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        tabs = Object.assign.apply(Object, [{}].concat(tabsArray));
                                        this.dataStore.tabs = tabs;
                                        this.dataStore.all = all;
                                        if (!(this.entitySearchColumns.length > 0)) return [3 /*break*/, 2];
                                        _a = this.dataStore;
                                        return [4 /*yield*/, this.getCollection(falcon_core_1.Record, ApiService_1.AppUrls.record, {
                                                predicate: this.entitySearchColumns,
                                                entity: this.dataStore.all.entity.value.map(function (entity) { return entity.uid; })
                                            })];
                                    case 1:
                                        _a.records = _b.sent();
                                        _b.label = 2;
                                    case 2: return [2 /*return*/, true];
                                }
                            });
                        });
                    }))];
            });
        });
    };
    /*
    *
    *    API
    *
    */
    DataController.prototype.getItem = function (obj, baseUrl, uid) {
        return this.api.getItem.apply(this.api, arguments);
    };
    DataController.prototype.getCollection = function (obj, baseUrl, params) {
        return this.api.getCollection.apply(this.api, arguments);
    };
    DataController.prototype.postItem = function (obj, baseUrl, data, params) {
        var _this = this;
        return this.api.postItem.apply(this.api, arguments).then(function (result) { return _this.update().then(function () { return result; }); });
    };
    DataController.prototype.putItem = function (obj, baseUrl, uid, data) {
        var _this = this;
        return this.api.putItem.apply(this.api, arguments).then(function (result) { return _this.update().then(function () { return result; }); });
    };
    //TODO: patch item takes a subset of an objects properties. This is currently being looked at in TS in the
    //context of the 'setState' function in react
    DataController.prototype.patchItem = function (obj, baseUrl, uid, data) {
        var _this = this;
        return this.api.patchItem.apply(this.api, arguments).then(function (result) { return _this.update().then(function () { return result; }); });
    };
    DataController.prototype.delItem = function (obj, baseUrl, uid) {
        var _this = this;
        return this.api.delItem.apply(this.api, arguments).then(function (result) { return _this.update().then(function () { return result; }); });
    };
    DataController.prototype.query = function (graphQLQuery) {
        return this.api.query.apply(this.api, arguments);
    };
    DataController.prototype.getStats = function () {
        return this.api.getStats.apply(this.api, arguments);
    };
    /*
    *
    *    TABS
    *
    */
    DataController.prototype.createTab = function (tabType, uid, tabClass, data, query) {
        // don't add a tab if it already exists
        if (lodash_1.find(this.tabs, function (tab) { return tab.tabType === tabType && tab.uid == uid; }) === undefined) {
            this.tabs.unshift({ tabType: tabType, uid: uid, data: data, tabClass: tabClass, query: query });
            this.saveTabs();
            this.update();
        }
    };
    DataController.prototype.updateTab = function (tabType, uid, data) {
        var tabs = lodash_1.cloneDeep(this.tabs);
        var tabId = lodash_1.findIndex(tabs, function (tab) { return tab.tabType === tabType && tab.uid === uid; });
        if (tabId !== -1) {
            tabs[tabId].data = data;
            this.tabs = tabs;
        }
    };
    DataController.prototype.closeTab = function (tabType, uid) {
        this.tabs = this.tabs.filter(function (a) { return a.tabType !== tabType || a.uid !== uid; });
        this.saveTabs();
        this.update();
    };
    DataController.prototype.saveTabs = function () {
        var tabsString = JSON.stringify(this.tabs);
        window.localStorage.setItem('open_tabs', tabsString);
    };
    DataController.prototype.clearAllTabs = function () {
        this.tabs = [];
        this.saveTabs();
        this.update();
    };
    DataController.prototype.reorderTabs = function (data) {
        this.tabs = react_sortable_hoc_1.arrayMove(this.tabs, data.oldIndex, data.newIndex);
        this.saveTabs();
    };
    return DataController;
}());
__decorate([
    mobx_1.observable,
    __metadata("design:type", Object)
], DataController.prototype, "dataStore", void 0);
__decorate([
    mobx_1.observable,
    __metadata("design:type", Array)
], DataController.prototype, "tabs", void 0);
__decorate([
    mobx_1.observable,
    __metadata("design:type", Number)
], DataController.prototype, "defaultSource", void 0);
__decorate([
    mobx_1.action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", Boolean)
], DataController.prototype, "enterPage", null);
__decorate([
    mobx_1.action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], DataController.prototype, "update", null);
__decorate([
    mobx_1.action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String, Object, Object]),
    __metadata("design:returntype", void 0)
], DataController.prototype, "createTab", null);
__decorate([
    mobx_1.action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", void 0)
], DataController.prototype, "updateTab", null);
__decorate([
    mobx_1.action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], DataController.prototype, "closeTab", null);
__decorate([
    mobx_1.action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DataController.prototype, "saveTabs", null);
__decorate([
    mobx_1.action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DataController.prototype, "clearAllTabs", null);
__decorate([
    mobx_1.action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DataController.prototype, "reorderTabs", null);
exports.DataController = DataController;
//# sourceMappingURL=DataController.js.map

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

var falcon_core_1 = __webpack_require__(3);
exports.emptyDataStore = {
    all: {
        entity: { value: [], lastUpdate: null },
        entity_type: { value: [], lastUpdate: null },
        predicate: { value: [], lastUpdate: null },
        source: { value: [], lastUpdate: null },
        dublinCore: { value: new falcon_core_1.ElementSet(), lastUpdate: null }
    },
    records: [],
    tabs: {
        entity: {},
        entity_type: {},
        predicate: {},
        source: {}
    },
    lockedSource: null
};
//# sourceMappingURL=DataStore.js.map

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
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
var React = __webpack_require__(0);
var lodash_1 = __webpack_require__(4);
var CreatePredicate_1 = __webpack_require__(50);
var CreateRecord_1 = __webpack_require__(52);
var CreatePresetRecord_1 = __webpack_require__(51);
var CreateSource_1 = __webpack_require__(53);
var CreateEntity_1 = __webpack_require__(48);
var CreateEntityType_1 = __webpack_require__(49);
var ConflictResolution_1 = __webpack_require__(47);
var CreateTabSet_1 = __webpack_require__(54);
var mobx_1 = __webpack_require__(26);
var ModalStore = (function () {
    function ModalStore() {
        this.modalQueue = [];
    }
    Object.defineProperty(ModalStore.prototype, "currentModal", {
        // might be @computed?
        get: function () {
            if (this.modalQueue.length === 0) {
                return null;
            }
            var sharedProps = {
                complete: this.modalComplete.bind(this),
                cancel: this.modalCancel.bind(this)
            };
            switch (this.modalQueue[0].name) {
                case 'predicate':
                    return (React.createElement(CreatePredicate_1.CreatePredicate, __assign({}, sharedProps, { initialName: this.modalQueue[0].settings['initialName'], initialDomain: this.modalQueue[0].settings['initialDomain'] })));
                case 'record':
                    return (React.createElement(CreateRecord_1.CreateRecord, __assign({}, sharedProps, { entityType: this.modalQueue[0].settings['entityType'], entityUid: this.modalQueue[0].settings['entityUid'], options: this.modalQueue[0].settings['options'] })));
                case 'preset_record':
                    return (React.createElement(CreatePresetRecord_1.CreatePresetRecord, __assign({}, sharedProps, { source: this.modalQueue[0].settings['source'] })));
                case 'source':
                    return (React.createElement(CreateSource_1.CreateSource, __assign({}, sharedProps, { initialValue: this.modalQueue[0].settings['initialName'] })));
                case 'entity':
                    return (React.createElement(CreateEntity_1.CreateEntity, __assign({}, sharedProps, this.modalQueue[0].settings)));
                case 'entity_type':
                    return (React.createElement(CreateEntityType_1.CreateEntityType, __assign({}, sharedProps, this.modalQueue[0].settings)));
                case 'conflict_resolution':
                    return (React.createElement(ConflictResolution_1.ConflictResolution, __assign({}, sharedProps, { conflictingItems: this.modalQueue[0].settings['conflictingItems'], message: this.modalQueue[0].settings['message'] })));
                case 'createTabSet':
                    return (React.createElement(CreateTabSet_1.CreateTabSet, __assign({}, sharedProps)));
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    ModalStore.prototype.addModal = function (def) {
        this.modalQueue.unshift(def);
    };
    ModalStore.prototype.modalComplete = function (data) {
        if (this.modalQueue.length === 0) {
            throw new Error('Attempted to complete non-existent modal');
        }
        this.modalQueue[0].complete(data);
        if (this.modalQueue.length > 0) {
            this.modalQueue = lodash_1.tail(this.modalQueue);
        }
    };
    ModalStore.prototype.modalCancel = function () {
        if (this.modalQueue.length === 0) {
            throw new Error('Attempted to cancel non-existent modal');
        }
        this.modalQueue[0].cancel();
        this.modalQueue = [];
    };
    return ModalStore;
}());
__decorate([
    mobx_1.observable,
    __metadata("design:type", Array)
], ModalStore.prototype, "modalQueue", void 0);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], ModalStore.prototype, "currentModal", null);
__decorate([
    mobx_1.action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ModalStore.prototype, "addModal", null);
__decorate([
    mobx_1.action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ModalStore.prototype, "modalComplete", null);
__decorate([
    mobx_1.action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ModalStore.prototype, "modalCancel", null);
exports.ModalStore = ModalStore;
//# sourceMappingURL=ModalStore.js.map

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

var React = __webpack_require__(0);
var react_router_1 = __webpack_require__(7);
var StatsGrid_1 = __webpack_require__(25);
var setTabList = function (data, router) {
    window.localStorage.setItem('open_tabs', JSON.stringify(data));
    router.transitionTo('/edit/empty');
};
var deleteTabSet = function (id) {
    fetch('/tabset/' + id, {
        method: 'DELETE',
        credentials: 'same-origin'
    });
};
exports.Admin = function (props, context) { return (React.createElement("div", { className: 'page' },
    React.createElement("section", null,
        React.createElement("h1", null, "Welcome to the admin pages"),
        React.createElement("ul", { className: 'links-list' },
            React.createElement("li", null,
                React.createElement(react_router_1.Link, { to: '/users' },
                    React.createElement("i", { className: 'fa fa-users' }),
                    " Manage Users")),
            React.createElement("li", null,
                React.createElement(react_router_1.Link, { to: '/app' },
                    React.createElement("i", { className: 'fa fa-download' }),
                    " Download app")),
            React.createElement("li", null,
                React.createElement("a", { href: '/snapshot' },
                    React.createElement("i", { className: 'fa fa-cloud-download' }),
                    " Download database snapshot")),
            React.createElement("li", null,
                React.createElement(react_router_1.Link, { to: '/upload' },
                    React.createElement("i", { className: 'fa fa-cloud-upload' }),
                    " Upload database file")))),
    React.createElement("section", null,
        React.createElement("h2", null, "Saved Tab Sets"),
        React.createElement("ul", { className: 'links-list' }, props.tabsets.map(function (tabset) {
            return (React.createElement("li", { key: "tabset-" + tabset.uid },
                React.createElement("span", { className: 'a' },
                    React.createElement("span", { onClick: function () { return setTabList(tabset.tabs, context.router); } }, tabset.name),
                    React.createElement("span", null,
                        React.createElement("i", { className: 'fa fa-times', onClick: function () { return deleteTabSet(tabset.uid); } })))));
        }))),
    props.stats !== null ? (React.createElement(StatsGrid_1.StatsGrid, { stats: props.stats })) : null)); };
exports.Admin.contextTypes = {
    router: React.PropTypes.object.isRequired
};
//# sourceMappingURL=Admin.js.map

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

var React = __webpack_require__(0);
exports.AppDownload = function (props) { return (React.createElement("div", { className: 'page' },
    React.createElement("section", null,
        React.createElement("h1", null, "App Download"),
        React.createElement("p", null, "Use this VRE without an internet connection! Simply download the app for your platform and then" + " " + "download a database snapshot from the main page. When you are ready, use the upload tool to merge" + " " + "your offline copy with the server."),
        React.createElement("ul", { className: 'links-list' },
            React.createElement("li", null,
                React.createElement("a", { href: 'https://github.com/digihum/imperial-entanglements-app/raw/master/bin/imperial-entanglements%20Setup%200.1.1.exe' },
                    React.createElement("i", { className: 'fa fa-windows' }),
                    " Windows")),
            React.createElement("li", null,
                React.createElement("a", { href: 'https://github.com/digihum/imperial-entanglements-app/raw/master/bin/mac/imperial-entanglements-0.1.1.dmg' },
                    React.createElement("i", { className: 'fa fa-apple' }),
                    " Mac")),
            React.createElement("li", null,
                React.createElement("a", { href: 'https://github.com/digihum/imperial-entanglements-app/raw/master/bin/imperial-entanglements-0.1.1-x86_64.AppImage' },
                    React.createElement("i", { className: 'fa fa-linux' }),
                    " Linux")))))); };
//# sourceMappingURL=AppDownload.js.map

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

var React = __webpack_require__(0);
exports.DatabaseUpload = function (props) { return (React.createElement("div", { className: 'page' },
    React.createElement("section", null,
        React.createElement("h1", null, "This is the database upload page"),
        React.createElement("input", { type: 'file', id: 'input', accept: '.sqlite' }),
        React.createElement("button", { onClick: function () { alert('Work in process'); } }, "Upload")))); };
//# sourceMappingURL=DatabaseUpload.js.map

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = __webpack_require__(0);
var Sidebar_1 = __webpack_require__(35);
var Workspace_1 = __webpack_require__(37);
var Toast_1 = __webpack_require__(36);
var DataController_1 = __webpack_require__(70);
var ModalStore_1 = __webpack_require__(72);
var react_sortable_hoc_1 = __webpack_require__(20);
var mobx_react_devtools_1 = __webpack_require__(95);
var mobx_react_1 = __webpack_require__(1);
var ObjectEditorCore = react_sortable_hoc_1.SortableContainer(function (props) {
    return (React.createElement("span", { className: 'flex-fill' },
        React.createElement(Sidebar_1.Sidebar, { list: props.list, id: props.id, workspace: props.workspace }),
        React.createElement(Workspace_1.Workspace, { workspace: props.workspace, id: props.id, loading: props.loadingWheel, location: props.location, list: props.list }),
        props.splitWorkspace ? (React.createElement(Workspace_1.Workspace, { workspace: props.workspace, id: props.id, loading: props.loadingWheel, location: props.location, list: props.list })) : null,
        React.createElement("div", { style: { display: 'none' }, className: 'split-workspace-button-container', onClick: props.toggleSplitWorkspace }, props.splitWorkspace ? (React.createElement("i", { className: 'fa fa-times', title: 'split' })) : (React.createElement("i", { className: 'fa fa-columns', title: 'split' })))));
});
var ModalWrapper = mobx_react_1.inject('modalStore')(mobx_react_1.observer(function (props) { return (React.createElement("span", null, props.modalStore.currentModal)); }));
var ObjectEditor = (function (_super) {
    __extends(ObjectEditor, _super);
    function ObjectEditor(props, context) {
        var _this = _super.call(this) || this;
        _this.state = {
            dataController: new DataController_1.DataController(props.api),
            modalStore: new ModalStore_1.ModalStore(),
            loadingWheel: true,
            loading: true,
            id: NaN,
            list: false,
            splitWorkspace: false
        };
        return _this;
    }
    ObjectEditor.prototype.componentDidMount = function () {
        this.reload(this.props, false, true);
    };
    ObjectEditor.prototype.componentWillUnmount = function () {
        this.state.dataController.saveTabs();
    };
    ObjectEditor.prototype.componentWillReceiveProps = function (props) {
        this.reload(props);
    };
    ObjectEditor.prototype.reload = function (props, force, initialLoad) {
        var _this = this;
        if (force === void 0) { force = false; }
        if (initialLoad === void 0) { initialLoad = false; }
        var oldId = parseInt(this.props.location.pathname.substr(this.props.pathname.length + 1));
        var newId = parseInt(props.location.pathname.substr(props.pathname.length + 1));
        var workspaceChanged = props.workspace !== this.props.workspace;
        var idChanged = isNaN(oldId) ? !isNaN(newId) : isNaN(newId) ? true : oldId !== newId;
        var queryChanged = props.location.search !== this.props.location.search;
        var newWorkspace = props.workspace;
        // if there is not a tab for the current URL - create it
        // if the url is invalid, relocate to /edit/notfound
        if (['entity', 'source', 'predicate', 'entity_type', 'notfound'].indexOf(newWorkspace) === -1) {
            this.context.router.transitionTo('/edit/notfound');
        }
        var alreadyLoaded = newWorkspace === 'notfound' || this.state.dataController.enterPage(newWorkspace, newId, this.props.location.query);
        if (!initialLoad && this.state.loading && !force) {
            this.setState({
                id: newId,
                list: props.location.pathname.substr(props.pathname.length + 1).length === 0
            });
        }
        else {
            this.setState({
                id: newId,
                list: props.location.pathname.substr(props.pathname.length + 1).length === 0,
                loading: true,
                loadingWheel: initialLoad || !alreadyLoaded
            }, function () {
                _this.state.dataController.update()
                    .then(function (dataStore) {
                    _this.setState({
                        loading: false,
                        loadingWheel: false
                    });
                }).catch(function () {
                    _this.context.router.transitionTo('/edit/notfound');
                });
            });
        }
    };
    ObjectEditor.prototype.render = function () {
        var _this = this;
        return (React.createElement(mobx_react_1.Provider, { dataStore: this.state.dataController, modalStore: this.state.modalStore },
            React.createElement("section", { id: 'entity-editor', className: 'flex-fill' },
                process.env.NODE_ENV === 'dev' ? (React.createElement(mobx_react_devtools_1.default, null)) : null,
                React.createElement("span", { className: 'header-colour ' + this.props.workspace }),
                React.createElement("span", { className: 'flex-fill' },
                    React.createElement(ObjectEditorCore, { id: this.state.id, workspace: this.props.workspace, useDragHandle: true, loadingWheel: this.state.loadingWheel, splitWorkspace: this.state.splitWorkspace, helperClass: 'card-being-dragged', toggleSplitWorkspace: function () { return _this.setState({ splitWorkspace: !_this.state.splitWorkspace }); }, list: this.state.list, location: this.props.location, onSortEnd: function (change) { return _this.state.dataController.reorderTabs(change); } }),
                    React.createElement(Toast_1.Toast, null),
                    React.createElement(ModalWrapper, null)),
                React.createElement("span", { className: 'header-colour ' + this.props.workspace }))));
    };
    return ObjectEditor;
}(React.Component));
ObjectEditor.contextTypes = {
    router: React.PropTypes.object.isRequired
};
exports.ObjectEditor = ObjectEditor;
//# sourceMappingURL=ObjectEditor.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(93)))

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

var React = __webpack_require__(0);
exports.RouteNotFound = function (props) { return (React.createElement("section", null,
    React.createElement("h1", null,
        "The page at ",
        props.url,
        " does not exist :("))); };
//# sourceMappingURL=RouteNotFound.js.map

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

var React = __webpack_require__(0);
exports.User = function (props) { return (React.createElement("div", { className: 'page' },
    React.createElement("section", null,
        React.createElement("h1", null, "This is the user page")))); };
//# sourceMappingURL=User.js.map

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

var React = __webpack_require__(0);
exports.UserManagement = function (props) { return (React.createElement("div", { className: 'page' },
    React.createElement("section", null,
        React.createElement("h1", null, "This is the user management page")))); };
//# sourceMappingURL=UserManagement.js.map

/***/ }),
/* 80 */,
/* 81 */,
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */,
/* 92 */,
/* 93 */,
/* 94 */,
/* 95 */,
/* 96 */
/***/ (function(module, exports) {

module.exports = ui_lib;

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

var react_dom_1 = __webpack_require__(31);
var react_1 = __webpack_require__(0);
var FalconApp_1 = __webpack_require__(30);
var ClientApiService_1 = __webpack_require__(29);
var react_router_1 = __webpack_require__(7);
document.addEventListener('DOMContentLoaded', function (event) {
    react_dom_1.render(react_1.createElement(FalconApp_1.FalconApp, {
        api: new ClientApiService_1.ClientApiService(),
        router: react_router_1.BrowserRouter,
        routerSettings: {},
        environment: 'website',
        connected: true
    }), document.getElementById('main'));
});
//# sourceMappingURL=app.frontend.js.map

/***/ })
],[97]);
//# sourceMappingURL=main.dist.js.map