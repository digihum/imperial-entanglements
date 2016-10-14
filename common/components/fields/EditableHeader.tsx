/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as React from 'react';
import { EditableSubfieldProps } from './EditableFieldComponent';
export { EditableFieldComponent } from './EditableFieldComponent';

export const EditableHeader : React.StatelessComponent<EditableSubfieldProps<string>>
    = (props: EditableSubfieldProps<string>) => {
         if (!props.edit || props.value == null) {
            return (
                <h2>
                    {props.value}
                    <sup>
                        <i className='fa fa-pencil-square-o'
                            aria-hidden='true'
                            onClick={props.setEdit}>
                        </i>
                    </sup>
                </h2>
            );
        } else {
            return (
                <div>
                    <input type='text'
                        value={props.value}
                        onChange={(e) => props.onChange(e.target.value)} />
                    <button onClick={props.acceptChanges}><i className='fa fa-check' aria-hidden='true'></i></button>
                    <button onClick={props.cancelChanges}><i className='fa fa-times' aria-hidden='true'></i></button>
                </div>
            );
        }
};