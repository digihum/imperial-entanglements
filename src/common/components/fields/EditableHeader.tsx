/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

import * as React from 'react';
import { EditableSubfieldProps } from './EditableFieldComponent';

export const EditableHeader : React.StatelessComponent<EditableSubfieldProps<string>>
    = (props: EditableSubfieldProps<string>) => {
         if (!props.edit || props.value == null) {
            return (
                <h2>
                    {props.value}
                    <sup>
                        <i className='fa fa-pencil-square-o'
                            title='Edit'
                            aria-hidden='true'
                            onClick={props.setEdit}>
                        </i>
                    </sup>
                </h2>
            );
        } else {
            return (
                <span>
                    <input type='text'
                        value={props.value}
                        className='text-edit-header'
                        onChange={(e) => props.onChange!((e.target as HTMLInputElement).value)} />
                    <button onClick={props.acceptChanges}><i className='fa fa-check' aria-hidden='true'></i></button>
                    <button onClick={props.cancelChanges}><i className='fa fa-times' aria-hidden='true'></i></button>
                </span>
            );
        }
};
