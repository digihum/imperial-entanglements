/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

import * as React from 'react';
import * as moment from 'moment';

import { padStart } from 'lodash';

import { formatDate } from '../../helper/formatDate';

export interface DatePickerDropdownProps {
    value: string;
    setValue: (s: string) => void;
}

interface DatePickerDropdownState {
    showingDropDown: boolean;
}

export class DatePickerDropdown<T> extends React.Component<DatePickerDropdownProps, DatePickerDropdownState> {

    private ignoreBlur;
    private ignoreClick;
    private ignoreGlobalClick;
    private boundWindowClick;

    private static readonly datePickerDropDownInputBoxRef : string = 'datePickerDropDownInputBox';

    constructor() {
        super();

        //TODO: should be false
        this.state = {
            showingDropDown: false
        };

        if (document !== undefined) {
            this.boundWindowClick = () => {
                if (!this.ignoreGlobalClick) {
                    this.setState({
                        showingDropDown: false
                    });
                } else {
                    this.ignoreGlobalClick = false;
                }
            };

            document.body.addEventListener('click', this.boundWindowClick);
        }
    }

    public componentWillMount() {
        this.ignoreBlur = false;
        this.ignoreClick = false;
        this.ignoreGlobalClick = false;
    }

    public componentWillUnmount() {
        document.body.removeEventListener('click', this.boundWindowClick);
    }

    public componentWillReceiveProps(newProps: DatePickerDropdownProps) {
        // this.updateFilter(newProps.value.key !== this.props.value.key ? newProps.value.key : this.state.searchString, newProps);
        // this.setState({
        //     searchString: newProps.value.key !== this.props.value.key ? newProps.value.key : this.state.searchString,
        //     selected: newProps.value,
        //     options: newProps.options
        // });
    }

    //should be false
    public handleInputBlur() {
        if (!this.ignoreBlur) {
            this.setState({
                showingDropDown: false
            });
        } else {
            this.ignoreBlur = false;
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
        this.setState({ showingDropDown: true });
    } else {
        //  if (this.state.highlightedIndex !== null && !this.ignoreClick) {
        //      this.selectItemFromMouse(this.state.filteredOptions[this.state.highlightedIndex]);
        //  } else {
             this.ignoreClick = false;
        //  }
    }
  }

  public selectItemFromMouse (item) {
    this.setState({
      showingDropDown: false
    }, () => {
      this.props.setValue(item);
    })
  }

   public isInputFocused () {
    const el = this.refs[DatePickerDropdown.datePickerDropDownInputBoxRef] as HTMLElement;
    return el.ownerDocument && (el === el.ownerDocument.activeElement);
  }

  public onDropdownClick() {
      this.ignoreBlur = true;
      this.ignoreGlobalClick = true;
      console.log('clicked');
  }

  public rangeTypeChanged(rangeType: string) {
       this.props.setValue(rangeType + this.props.value.substr(1));
  }

  public yearChanged(e: React.FormEvent<HTMLSelectElement>) {
      const base = this.props.value.length === 9 ? this.props.value : '=XXXX0000';
      let yearVal : string = e.currentTarget.value.substr(0, 4).replace(/[^0-9]/g, '');
      for (let i = yearVal.length; i < 4; i += 1) {
          yearVal += 'X';
      }
      this.props.setValue(base.substr(0, 1) + yearVal + base.substr(5));
  }

  public monthChanged(e: React.FormEvent<HTMLInputElement>) {
      this.ignoreGlobalClick = true;
      const base = this.props.value.length === 9 ? this.props.value : '=XXXX0000';
      const monthVal : string = e.currentTarget.value.substr(0, 2);
      this.props.setValue(base.substr(0, 5) + monthVal + base.substr(7));
  }

  public dayChanged(e: React.FormEvent<HTMLInputElement>) {
      const base = this.props.value.length === 9 ? this.props.value : '=XXXX0000';
      let dayVal : string = e.currentTarget.value.substr(0, 2).replace(/[^0-9]/g, '');
      dayVal = padStart(dayVal, 2, '0');
      this.props.setValue( base.substr(0, 7) + dayVal);
  }

  public render() {

      let rangeOption = this.props.value.substr(0, 1);

      if (['<', '>', '='].indexOf(rangeOption) === -1) {
          rangeOption = '=';
      }

      const rangeOptionClassName = (val: string) => {
          if (val === rangeOption) {
              return 'range-option selected';
          } else {
              return 'range-option';
          }
      };

      const year = this.props.value.substr(1, 4).replace(/X/g, '');
      const month = this.props.value.substr(5, 2);
      const day = this.props.value[7] === '0' ? this.props.value[8] === '0' ?
        ''
        : this.props.value.substr(8, 1)
        : this.props.value.substr(7, 2);

       const displayValue = formatDate(this.props.value);

       return (
        <div className='combo-dropdown'>
                <div>
                    <input type='text'
                        readOnly={true}
                        ref={DatePickerDropdown.datePickerDropDownInputBoxRef}
                        className='search-input'
                        value={displayValue}
                        onBlur={this.handleInputBlur.bind(this)}
                        onFocus={this.handleInputFocus.bind(this)}
                        onClick={this.handleInputClick.bind(this)}
                    />
                </div>
                {this.state.showingDropDown ? (
                    <div className='dropdown'>
                        <div className='date-picker-dropdown' onMouseDown={this.onDropdownClick.bind(this)}>
                            <section className='range-type'>
                                <div className={rangeOptionClassName('<')} onClick={() => this.rangeTypeChanged('<')}>Before</div>
                                <div className={rangeOptionClassName('=')} onClick={() => this.rangeTypeChanged('=')}>Exactly</div>
                                <div className={rangeOptionClassName('>')} onClick={() => this.rangeTypeChanged('>')}>After</div>
                            </section>
                            <section className='date-select'>
                                <div className='date-selector day'>
                                    <label className='small'>Day</label>
                                    <input type='text' maxLength={2} value={day} onChange={this.dayChanged.bind(this)} />
                                </div>
                                <div className='date-selector month'>
                                    <label className='small'>Month</label>
                                    <select onChange={this.monthChanged.bind(this)} value={month}>
                                        <option value='00'>Unknown</option>
                                        {moment.months().map((month, i) => (
                                            <option key={`option-${month}`} value={padStart((i + 1).toString(), 2, '0')}>{month}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='date-selector year'>
                                    <label className='small'>Year</label>
                                    <input type='text' maxLength={4} value={year} onChange={this.yearChanged.bind(this)} />
                                </div>
                            </section>
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }
}

