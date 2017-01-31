/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

import * as React from 'react';
import { EditableSubfieldProps } from './EditableFieldComponent';

import * as mousetrap from 'mousetrap';

export const EditableParagraph : React.StatelessComponent<EditableSubfieldProps<string>> =
    (props: EditableSubfieldProps<string>) => {

    let keyBoardShortcuts;

    const bindKeyboard = (val) => {
        if (val !== null) {
            val.focus();
            keyBoardShortcuts = new mousetrap(val);
            keyBoardShortcuts.bind('ctrl+return', props.acceptChanges);
            keyBoardShortcuts.bind('escape', props.cancelChanges);
        } else {
            keyBoardShortcuts.unbind('ctrl+return');
        }
    };

    if (!props.edit) {
        return (
            <div onClick={props.setEdit} className='editable-paragraph-box'>
                <p>
                    {props.value === null || props.value!.length > 0 ? props.value
                    : (
                        <em>No value</em>
                    )}
                    <sup>
                        <i className='fa fa-pencil-square-o'
                            title='Edit'
                            aria-hidden='true'
                            >
                        </i>
                    </sup>
                </p>
            </div>
        );
    } else {
        return (
            <div>
                <textarea
                    value={props.value === null ? '' : props.value}
                    ref={bindKeyboard}
                    onChange={(e) => props.onChange!(e.target.value)}
                    style={{ width: '100%', height: '6em'}}></textarea>
                <button onClick={props.acceptChanges}>
                    <i className='fa fa-check' aria-hidden='true'></i></button>
                <button onClick={props.cancelChanges}><i className='fa fa-times' aria-hidden='true'></i></button>
            </div>
        );
    }
 };
