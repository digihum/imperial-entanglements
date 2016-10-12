/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as React from 'react';
import * as lunr from 'lunr';

import { globalClick } from '../Signaller';
import { findIndex } from 'lodash';

interface ComboDropdownProps {
    options: {key: string, value: string}[];
    typeName: string;
    value: string;
    setValue: (s: string) => void;
    createNewValue: (s: string) => void;
    allowNew?: boolean;
}

interface ComboDropdownState {
    internalValue: string;
    showingDropDown: boolean;
    filteredOptions: {key: string, value: string}[];
    boundHideFunc: any;
}

export class ComboDropdown<T> extends React.Component<ComboDropdownProps, ComboDropdownState> {

    public static defaultProps : ComboDropdownProps = {
       allowNew: true 
    }

    constructor() {
        super();

        this.state = {
            internalValue: '',
            showingDropDown: false,
            filteredOptions: [],
            boundHideFunc: this.hide.bind(this)
        };
    }

    public componentWillMount() {
         this.setState({
            filteredOptions: this.props.options,
            internalValue: this.props.value
        });
    }

    public componentWillReceiveProps(newProps: ComboDropdownProps) {
        this.setState({ internalValue: newProps.value, options: newProps.options });
    }

    public changeSearchString(event : React.EventHandler<FormData>) {
        this.setState({internalValue: event.target.value, showingDropDown: true}, () => {
            this.updateFilter(this.state.internalValue);
        });
    }

    public updateFilter(filter: string) {

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
        })
    }

    public addNewAction(option: string) {
        this.props.createNewValue(option);
    }

    public selectOption(option: string) {
        this.props.setValue(option);
    }

    public show(e) {
        this.setState({ showingDropDown: true });
        globalClick.add(this.state.boundHideFunc);
        e.stopPropagation();
    }

    public hide() {
        this.setState({ showingDropDown: false });
        globalClick.remove(this.state.boundHideFunc);
        if (findIndex(this.props.options, (option) => option.key === this.state.internalValue) === -1) {
            this.setState({ internalValue: this.props.value }, () => {
                this.updateFilter(this.props.value);
            });
        }
    }

    public render() {
       return (
            <div className='combo-dropdown'>
                <div>
                    <input type='text'
                        className='search-input'
                        value={this.state.internalValue}
                        placeholder='Click here and start typing..'
                        onClick={this.show.bind(this)}
                        onChange={this.changeSearchString.bind(this)}
                    />
                </div>
                {this.state.showingDropDown ? (
                    <div className='dropdown'>
                        <ul>
                            {this.state.internalValue.length === 0 && this.props.allowNew ? (
                                <li className='add' onClick={() => this.addNewAction('')}>
                                    <i className='fa fa-plus' aria-hidden='true'></i>
                                    Add new {this.props.typeName}</li>
                            ) : null }
                            {this.state.filteredOptions.map((opt) => (
                                <li key={`opt-${opt.key}`} onClick={() => this.selectOption(opt.key)}>{opt.key}</li>
                            ))}
                            {this.state.internalValue.length > 0 && this.props.allowNew ? (
                                <li className='add' onClick={() => this.addNewAction(this.state.internalValue)}>
                                    <i className='fa fa-plus' aria-hidden='true'></i>
                                    Add new {this.props.typeName}: '{this.state.internalValue}'</li>
                            ) : null }
                        </ul>
                    </div>
                ) : null}
            </div>
        );
    }
}