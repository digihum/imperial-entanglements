/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as React from 'react';
import { ComboDropdown } from '../ComboDropdown';
import { noop } from 'lodash';

interface PredicateDescriptionProps {
    domain: string;
    range: string;
    mode: 'editAll' | 'editSingle';
}

export const PredicateDescription : React.StatelessComponent<PredicateDescriptionProps>
    = (props: PredicateDescriptionProps) => {

    return (
    <div className='predicate-function-description'>
        <div className='domain'>
            {props.mode === 'editAll' ? (
                <ComboDropdown
                    options={[{key: 'any', value: 'any'},{key: 'person', value: 'any'}]}
                    typeName='entity type'
                    allowNew={false}
                    value={props.domain}
                    setValue={() => console.log('meh')}
                    createNewValue={noop} />
            ) : props.domain}
        </div>
        <div className='arrow'><i className='fa fa-long-arrow-right' aria-hidden='true'></i></div>
        <div className='range'>
            {props.mode === 'editAll' ? (
                <ComboDropdown
                    options={[]}
                    typeName='entity type'
                    allowNew={false}
                    value={props.range}
                    setValue={() => console.log('meh')}
                    createNewValue={noop} />
            ) : props.range}
        </div>
    </div>);
};