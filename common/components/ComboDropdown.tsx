/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as React from 'react';
import * as lunr from 'lunr';

import { globalClick } from '../Signaller';
import { findIndex, noop } from 'lodash';

export interface ComboDropdownOption {
    key: string;
    value: string;
    meta?: any;
}

interface ComboDropdownProps {
    options: ComboDropdownOption[];
    typeName: string;
    value: ComboDropdownOption;
    setValue: (s: ComboDropdownOption) => void;
    createNewValue: (s: string) => void;
    updateSearchString?: (s: string) => void;
    allowNew?: boolean;
}

interface ComboDropdownState {
    searchString: string;
    selected: ComboDropdownOption;
    showingDropDown: boolean;
    filteredOptions: ComboDropdownOption[];
    boundHideFunc: any;
}

export class ComboDropdown<T> extends React.Component<ComboDropdownProps, ComboDropdownState> {

    public static defaultProps : ComboDropdownProps = {
       allowNew: true,
       updateSearchString: noop
    }

    constructor() {
        super();

        this.state = {
            searchString: '',
            selected: { key: '', value: ''},
            showingDropDown: false,
            filteredOptions: [],
            boundHideFunc: this.hide.bind(this)
        };
    }

    public componentWillMount() {
         this.setState({
            filteredOptions: this.props.options,
            searchString: this.props.value.key === null ? '' : this.props.value.key,
            selected: this.props.value
        });
    }

    public componentWillReceiveProps(newProps: ComboDropdownProps) {
        this.setState({
            searchString: newProps.value.key,
            selected: newProps.value,
            options: newProps.options
        });
    }

    public changeSearchString(event : React.EventHandler<React.FormData>) {
        this.setState({searchString: event.target.value, showingDropDown: true}, () => {
            this.updateFilter(this.state.searchString);
        });
    }

    public updateFilter(filter: string) {

        if (this.props.updateSearchString !== undefined) {
            this.props.updateSearchString(filter);
        }

        let filtered : any[] = [];

        if (filter.length > 0) {
            const idx = lunr(function () {
                this.field('key', { boost: 10 });
            });

            this.props.options.forEach((opt, i) => idx.add(Object.assign({}, opt, { id: i})));

            const result = idx.search(filter);

            for (let i = 0; i < result.length; i += 1) {
                filtered.push(this.props.options[result[i].ref]);
            }
        } else {
            filtered = this.props.options;
        }

        this.setState({
            filteredOptions: filtered
        });
    }

    public addNewAction(option: string) {
        this.props.createNewValue(option);
    }

    public selectOption(option: ComboDropdownOption) {
        this.props.setValue(option);
    }

    public show(e : React.EventHandler<React.FormEvent>) {
        this.setState({ showingDropDown: true });
        globalClick.add(this.state.boundHideFunc);
        e.stopPropagation();
    }

    public hide() {
        this.setState({ showingDropDown: false });
        globalClick.remove(this.state.boundHideFunc);
        if (findIndex(this.props.options, (option) => option.key === this.state.searchString) === -1) {
            this.setState({ searchString: this.props.value.key }, () => {
                this.updateFilter(this.props.value.key);
            });
        }
    }

    public render() {
       return (
            <div className='combo-dropdown'>
                <div>
                    <input type='text'
                        className='search-input'
                        value={this.state.searchString}
                        placeholder='Click here and start typing..'
                        onClick={this.show.bind(this)}
                        onChange={this.changeSearchString.bind(this)}
                    />
                </div>
                {this.state.showingDropDown ? (
                    <div className='dropdown'>
                        <ul>
                            {this.state.searchString.length === 0 && this.props.allowNew ? (
                                <li className='add' onClick={() => this.addNewAction('')}>
                                    <i className='fa fa-plus' aria-hidden='true'></i>
                                    Add new {this.props.typeName}</li>
                            ) : null }
                            {this.state.filteredOptions.map((opt) => (
                                <li key={`opt-${opt.key}`} onClick={() => this.selectOption(opt)}>{opt.key}</li>
                            ))}
                            {this.state.searchString.length > 0 && this.props.allowNew ? (
                                <li className='add' onClick={() => this.addNewAction(this.state.searchString)}>
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