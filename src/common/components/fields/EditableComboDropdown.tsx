/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

import * as React from 'react';
import { EditableSubfieldProps } from '../fields/EditableFieldComponent';
export { EditableFieldComponent } from '../fields/EditableFieldComponent';
import { ComboDropdown, ComboDropdownOption, ComboDropdownProps } from '../ComboDropdown';

interface EditableComboDropdownProps<T> extends EditableSubfieldProps<ComboDropdownOption<T>> {
    comboSettings: ComboDropdownProps<T>;
}

export function EditableComboDropdown<T>(props: EditableComboDropdownProps<T>) {

    if (props.edit) {
        return (<div>
            <ComboDropdown {...props.comboSettings}
                value={props.value}
                setValue={props.onChange}
                allowNew={false}
                createNewValue={() => {}} />
            <button><i className='fa fa-check' onClick={props.acceptChanges} aria-hidden='true'></i></button>
            <button><i className='fa fa-times' aria-hidden='true' onClick={props.cancelChanges}></i></button>
        </div>
        );
    } else {
        return (
            <div>
                {props.value !== null && props.value.key.length > 0 ? props.value.key
                : (
                    <em>No value</em>
                )}
                <sup>
                    <i className='fa fa-pencil-square-o'
                        title='Edit'
                        aria-hidden='true'
                        onClick={props.setEdit}>
                    </i>
                </sup>
            </div>
        );
    }
};
