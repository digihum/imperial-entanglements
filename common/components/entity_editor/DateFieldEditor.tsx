/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';

interface DateFieldEditorProps {
    onChange: (s: string) => void;
    value: string;
}

const validate = (s: string) => {
    let justNumbers = s.replace(/\D/g, '').substr(0, 8);

    if (s.slice(-1) === ' ') {
        if (justNumbers.length === 5) {
            justNumbers = justNumbers.substr(0, 4) + '0' + justNumbers.slice(-1);
        }
    }
    return justNumbers;
}

export const DateFieldEditor : React.StatelessComponent<DateFieldEditorProps> =
    (props: DateFieldEditorProps)  => {
        let displayValue = '';
        if (props.value.length > 4) {
            displayValue = props.value.substr(0,4) + ' ';
            if (props.value.length > 6) {
                displayValue += props.value.substr(4,2) + ' ' + props.value.substring(6);
            } else {
                displayValue += props.value.substring(4);
            }
        } else {
            displayValue = props.value;
        }

        return (
        <div className='date-selector'>
            <div className='date'>
                <select>
                    <option>Exactly</option>
                    <option>Before</option>
                    <option>After</option>
                </select>
                <input type='text' value={displayValue} onChange={(e) => props.onChange(validate(e.target.value))} />
            </div>
        </div>);
    };