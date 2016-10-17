/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as React from 'react';
import { EditableSubfieldProps } from './EditableFieldComponent';
export { EditableFieldComponent } from './EditableFieldComponent';

export const EditableParagraph : React.StatelessComponent<EditableSubfieldProps<string>>
    = (props: EditableSubfieldProps<string>) => {
         if (!props.edit) {
            return (
                <div>
                    <p>
                        {props.value === null || props.value.length > 0 ? props.value
                        : (
                            <em>No value</em>
                        )}
                        <sup>
                            <i className='fa fa-pencil-square-o'
                                aria-hidden='true'
                                onClick={props.setEdit}>
                            </i>
                        </sup>
                    </p>
                </div>
            );
        } else {
            return (
                <div>
                    <textarea
                        value={props.value}
                        onChange={(e) => props.onChange(e.target.value)}
                        style={{ width: '100%', height: '6em'}}></textarea>
                    <button onClick={props.acceptChanges}><i className='fa fa-check' aria-hidden='true'></i></button>
                    <button onClick={props.cancelChanges}><i className='fa fa-times' aria-hidden='true'></i></button>
                </div>
            );
        }
};