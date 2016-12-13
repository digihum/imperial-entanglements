/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';
import { reverse } from 'lodash';

interface ScorePickerProps {
    value: number;
    onChange?: (val: number) => void;
    readOnly: boolean;
}

export const ScorePicker : React.StatelessComponent<ScorePickerProps> =
    (props: ScorePickerProps) => {

        const values = [1, 2, 3, 4, 5];

        if (props.readOnly) {
            return (
            <span className='score-picker'>
                {values.map((val) => (<i key={val}
                    className={'fa fa-star' + (val > props.value ? '-o' : '')}
                    aria-hidden='true'></i>))}
            </span>
            );
        } else {

          return (
            <span className='score-picker editing'>
                {reverse(values).map((val) => (
                  <i key={val}
                    className={'fa fa-star' + (val > props.value ? '-o' : '')}
                    onClick={() => {
                      if(props.onChange === undefined) {
                        throw new Error('An onChange handler is required');
                      }
                      props.onChange(val);
                    }}
                    aria-hidden='true'></i>
                ))}
            </span>
            );
        }


    };
