/**
 * @fileOverview Various tool functions.
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as React from 'react';

interface StringFieldEditorProps {
    onChange: (s: string) => void;
    value: string;
}

export const StringFieldEditor : React.StatelessComponent<StringFieldEditorProps> =
    (props: StringFieldEditorProps)  => {
        return (<input type='text' value={props.value} onChange={(e) => props.onChange(e.target.value)} />);
    };