/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';
import { EditableSubfieldProps } from '../fields/EditableFieldComponent';
export { EditableFieldComponent } from '../fields/EditableFieldComponent';
import { ComboDropdown, ComboDropdownOption, ComboDropdownProps } from '../ComboDropdown';

interface EditableComboDropdownProps extends EditableSubfieldProps<ComboDropdownOption> {
    comboSettings: ComboDropdownProps;
}

export const EditableComboDropdown = (props: EditableComboDropdownProps) => {
 
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
                        aria-hidden='true'
                        onClick={props.setEdit}>
                    </i>
                </sup>
            </div>
        );
    }
}; 