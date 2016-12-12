/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';
import { ComboDropdown, ComboDropdownOption } from '../ComboDropdown';
import { Entity } from 'falcon-core';
import { noop } from 'lodash';


interface EntityFieldEditorProps {
    onChange: (val: number | null) => void;
    value: number;
    entities: Entity[];
}

export const EntityFieldEditor : React.StatelessComponent<EntityFieldEditorProps> =
    (props: EntityFieldEditorProps)  => {

        const options : ComboDropdownOption[] = props.entities.map((entity) => ({ key: entity.label, value: entity.uid}));

        let selectedOption : ComboDropdownOption | undefined = options.find((opt) => parseInt(opt.value) === props.value);

        if (selectedOption === undefined) {
            selectedOption = { key: '', value: ''};
        }

        return (
             <ComboDropdown
                options={options}
                typeName='entity type'
                allowNew={false}
                value={selectedOption}
                setValue={(val) => val !== null ? props.onChange(parseInt(val.value)) : props.onChange(null)}
                createNewValue={noop} />
        );
    };
