/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 ** @version 0.2.3
 */

import * as React from 'react';

interface StringFieldEditorProps {
    onChange: (s: string) => void;
    value: string;
}

export const StringFieldEditor : React.StatelessComponent<StringFieldEditorProps> =
  (props: StringFieldEditorProps)  => {
    return (
      <input type='text' value={props.value} onChange={(e) => props.onChange((e.target as HTMLInputElement).value)} />
    );
};
