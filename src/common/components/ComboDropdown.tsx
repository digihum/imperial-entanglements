/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

import * as React from 'react';
import * as lunr from 'lunr';

import { findIndex, noop } from 'lodash';

export interface ComboDropdownOption<T> {
    key: string;
    value: T | null;
}

export interface ComboDropdownProps<T> {
    options: ComboDropdownOption<T>[];
    typeName: string;
    value: ComboDropdownOption<T> | null;
    setValue: (s: ComboDropdownOption<T> | null) => void;
    createNewValue: (s: string) => void;
    updateSearchString?: (s: string) => void;
    allowNew?: boolean;
    additionalClasses?: string[];
}

interface ComboDropdownState<T> {
    searchString: string;
    showingDropDown: boolean;
    filteredOptions: ComboDropdownOption<T>[];
    highlightedIndex: null | number;
    dropDownHeight: number;
}

export class ComboDropdown<T> extends React.Component<ComboDropdownProps<T>, ComboDropdownState<T>> {

    public static defaultProps = {
       allowNew: true,
       additionalClasses: [],
       updateSearchString: noop
    };

    private ignoreBlur;
    private ignoreClick;
    private recalculateHeight;

    private dropDownBoxElement;

    private static readonly comboDropdownInputBoxRef : string = 'comboDropDownInputBox';

    constructor() {
        super();

        this.state = {
            searchString: '',
            showingDropDown: false,
            filteredOptions: [],
            highlightedIndex: null,
            dropDownHeight: 0
        };
    }

    public componentWillMount() {
        this.ignoreBlur = false;
        this.ignoreClick = false;
        this.recalculateHeight = true;
        this.dropDownBoxElement = null;

         this.setState({
            filteredOptions: this.props.options,
            searchString: this.props.value === null || this.props.value.key === null ? '' : this.props.value.key
        });
    }

    public componentWillReceiveProps(newProps: ComboDropdownProps<T>) {

        let filterString = '';

        if (this.props.value === null) {
            if (newProps.value === null) {
                // change nothing
                filterString = this.state.searchString;
            } else {
                // set to newProps value
                filterString = newProps.value.key;
            }
        } else {
            if (newProps.value === null) {
                // set to ''
                filterString = '';
            } else {
                if (newProps.value === this.props.value) {
                    // change nothing
                    filterString = this.state.searchString;
                } else {
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
    }

    public changeSearchString(event : React.FormEvent<HTMLInputElement>) {
        this.setState({
            searchString: (event.target as HTMLInputElement).value,
            showingDropDown: true},
        () => {
            this.updateFilter(this.state.searchString, this.props);
            if (this.props.updateSearchString !== undefined) {
              this.props.updateSearchString(this.state.searchString);
            }
        });
    }

    public updateSearchString(s: string) {
        if (this.props.updateSearchString !== undefined) {
          this.props.updateSearchString(s);
        }
    }

    public updateFilter(filter: string, props: ComboDropdownProps<T>) {

        let filtered : any[] = [];

        if (filter.length > 0) {
            const idx = lunr(function () {
                this.field('key', { boost: 10 });
            });

            props.options.forEach((opt, i) => idx.add(Object.assign({}, opt, { id: i})));

            const result = idx.search(filter);

            for (let i = 0; i < result.length; i += 1) {
                filtered.push(props.options[result[i].ref]);
            }
        } else {
            filtered = props.options;
        }

        if (this.dropDownBoxElement !== null) {
            this.recalculateHeight = true;
            this.calculateDropdownHeight(this.dropDownBoxElement);
        }

        this.setState({
            filteredOptions: filtered
        });
    }

    public addNewAction(option: string) {
        this.props.createNewValue(option);
    }

    public selectOption(option: ComboDropdownOption<T>) {
        this.props.setValue(option);
        this.ignoreBlur = false;
        this.recalculateHeight = true;
        this.setState({ showingDropDown: false, searchString: option.key });
        this.updateSearchString(option.key);
    }

    public handleInputBlur() {
        if (!this.ignoreBlur) {

            if (this.state.searchString.length === 0) {
                 this.setState({ searchString: '' });
            } else {
                 if (findIndex(this.props.options, (option) => option.key === this.state.searchString) === -1) {
                    this.setState({ searchString: this.props.value === null ? '' : this.props.value.key }, () => {
                        this.updateFilter(this.props.value === null ? '' : this.props.value.key, this.props);
                    });
                }
            }
            this.recalculateHeight = true;
            this.setState({
                showingDropDown: false
            });
        }
    }

    public handleInputFocus () {
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
  }

  public handleInputClick () {
    // Input will not be focused if it's disabled
    if (this.isInputFocused() && this.state.showingDropDown === false) {
        this.setState({ showingDropDown: true })
    } else {
         if (this.state.highlightedIndex !== null && !this.ignoreClick) {
             this.selectItemFromMouse(this.state.filteredOptions[this.state.highlightedIndex]);
         } else {
             this.ignoreClick = false;
         }
    }
  }

  public selectItemFromMouse (item) {
       this.recalculateHeight = true;
    this.setState({
      showingDropDown: false,
      highlightedIndex: null
    }, () => {
      this.props.setValue(item);
      (this.refs[ComboDropdown.comboDropdownInputBoxRef] as HTMLElement).focus();
    });
  }

   public isInputFocused () {
    const el = this.refs[ComboDropdown.comboDropdownInputBoxRef] as HTMLElement;
    return el.ownerDocument && (el === el.ownerDocument.activeElement);
  }

  public clearSearchBox() {
      this.props.setValue(null);
      this.setState({ searchString: '' });
      (this.refs[ComboDropdown.comboDropdownInputBoxRef] as HTMLElement).focus();
  }

  public calculateDropdownHeight(val: null | HTMLElement) {

    this.dropDownBoxElement = val;

      if (val === null || !this.recalculateHeight) {
          return;
      } else {
          this.setState({
              dropDownHeight: window.document.body.getBoundingClientRect().bottom - val.getBoundingClientRect().top - 32
          });
          this.recalculateHeight = false;
      }
  }

  public render() {

       return (
        <div className={'combo-dropdown ' + this.props.additionalClasses!.join(' ')}>
                <div>
                    <input type='text'
                        ref={ComboDropdown.comboDropdownInputBoxRef}
                        className='search-input'
                        value={this.state.searchString}
                        placeholder='Click here and start typing..'
                        onBlur={this.handleInputBlur.bind(this)}
                        onFocus={this.handleInputFocus.bind(this)}
                        onChange={this.changeSearchString.bind(this)}
                        onClick={this.handleInputClick.bind(this)}
                    />
                    {this.state.searchString.length > 0 ? (
                        <i className='fa fa-times clear-button' onClick={this.clearSearchBox.bind(this)}></i>
                    ) : null}
                </div>
                {this.state.showingDropDown ? (
                    <div className='dropdown'
                        style={{maxHeight: this.state.dropDownHeight, overflowY: 'auto'}}
                        ref={this.calculateDropdownHeight.bind(this)}>
                        <ul>
                            {this.state.searchString.length === 0 && this.props.allowNew ? (
                                <li className='add'
                                onMouseDown={() => this.ignoreBlur = true}
                                 onClick={() => this.addNewAction('')}>
                                    <i className='fa fa-plus' aria-hidden='true'></i>
                                    Add new {this.props.typeName}</li>
                            ) : null }
                            {this.state.filteredOptions.map((opt, i) => (
                                <li key={`opt-${opt.key}-${i}`}
                                onMouseDown={() => this.ignoreBlur = true}
                                onClick={() => this.selectOption(opt)}>{opt.key}</li>
                            ))}
                            {this.state.searchString.length > 0 && this.props.allowNew ? (
                                <li className='add'
                                onMouseDown={() => this.ignoreBlur = true}
                                onClick={() => this.addNewAction(this.state.searchString)}>
                                    <i className='fa fa-plus' aria-hidden='true'></i>
                                    Add new {this.props.typeName}: '{this.state.searchString}'</li>
                            ) : null }
                        </ul>
                    </div>
                ) : null}
            </div>
        );
    }
}

export class NumberComboDropdown extends ComboDropdown<number> {}
export class StringComboDropdown extends ComboDropdown<string> {}
