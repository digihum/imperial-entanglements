/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as React from 'react';
import { ComboDropdown, ComboDropdownOption } from '../ComboDropdown';
import { noop } from 'lodash';

interface PredicateDescriptionProps {
    domain: ComboDropdownOption;
    range: ComboDropdownOption;
    mode: 'editAll' | 'editSingle';
    domainChanged: (s: ComboDropdownOption) => void;
    rangeChanged: (s: ComboDropdownOption) => void;
    domainOptions: ComboDropdownOption[];
    rangeOptions: ComboDropdownOption[];
}

export const PredicateDescription : React.StatelessComponent<PredicateDescriptionProps>
    = (props: PredicateDescriptionProps) => {

    return (
    <div className='predicate-function-description'>
        <div className='domain'>
            {props.mode === 'editAll' ? (
                <ComboDropdown
                    options={props.domainOptions}
                    typeName='entity type'
                    allowNew={false}
                    value={props.domain}
                    setValue={props.domainChanged}
                    createNewValue={noop} />
            ) : props.domain.key}
        </div>
        <div className='arrow'><i className='fa fa-long-arrow-right' aria-hidden='true'></i></div>
        <div className='range'>
            {props.mode === 'editAll' ? (
                <ComboDropdown
                    options={props.rangeOptions}
                    typeName='entity type'
                    allowNew={false}
                    value={props.range}
                    setValue={props.rangeChanged}
                    createNewValue={noop} />
            ) : props.range.key}
        </div>
    </div>);
};