/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

import * as React from 'react';
import { EditableSubfieldProps } from '../fields/EditableFieldComponent';
import { NumberComboDropdown, ComboDropdownOption } from '../ComboDropdown';

interface EditableComboDropdownProps extends EditableSubfieldProps<ComboDropdownOption<number>> {
    comboSettings: {
      options: ComboDropdownOption<number>[];
      typeName: string;
    };
}

export function EditableComboDropdown(props: EditableComboDropdownProps) {

    if (props.edit) {
        return (<div>
            <NumberComboDropdown {...props.comboSettings}
                value={props.value!}
                setValue={props.onChange!}
                allowNew={false}
                createNewValue={() => {}} />
            <button onClick={props.acceptChanges}><i className='fa fa-check' aria-hidden='true'></i></button>
            <button onClick={props.cancelChanges}><i className='fa fa-times' aria-hidden='true'></i></button>
        </div>
        );
    } else {
        return (
            <div>
                {props.value !== null && props.value!.key.length > 0 ? props.value!.key
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
