/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as React from 'react';

interface ScorePickerProps {
    value: number;
    onChange: (val: number) => void;
}

export const ScorePicker : React.StatelessComponent<ScorePickerProps> =
    (props: ScorePickerProps) => {

        const values = [1, 2, 3, 4, 5];

        return (<span className='score-picker'>
            {values.map((val) => (<i key={val}
                className={'fa fa-star' + (val > props.value ? '-o' : '')}
                onClick={() => props.onChange(val)}
                aria-hidden='true'></i>))}
        </span>);
    };