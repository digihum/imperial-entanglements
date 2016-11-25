/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';

import { DatePickerDropdown } from '../fields/DatePickerDropdown';

interface DateFieldEditorProps {
    onChange: (s: string) => void;
    value: string;
}

export const DateFieldEditor : React.StatelessComponent<DateFieldEditorProps> =
    (props: DateFieldEditorProps)  => {
        return (
        <div className='date-selector'>
            <DatePickerDropdown
                value={props.value}
                setValue={props.onChange}
            />
        </div>);
    };