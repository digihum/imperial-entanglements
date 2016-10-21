/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';

interface IntegerFieldEditorProps {
    onChange: (s: string) => void;
    value: string;
}

export const IntegerFieldEditor : React.StatelessComponent<IntegerFieldEditorProps> =
    (props: IntegerFieldEditorProps)  => {
        return (<input type='number' value={props.value} onChange={(e) => props.onChange(e.target.value)} />);
    };