/**
 * @fileOverview Entity Field Editor - select box for entities
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

import * as React from 'react';
import { ComboDropdown, ComboDropdownOption } from '../ComboDropdown';
import { Entity } from '@digihum/falcon-core';
import { noop, toString } from 'lodash';


interface EntityFieldEditorProps {
    onChange: (val: number | null) => void;
    value: number;
    entities: Entity[];
}

export const EntityFieldEditor : React.StatelessComponent<EntityFieldEditorProps> =
  (props: EntityFieldEditorProps)  => {

  // build the options list
  const options : ComboDropdownOption[] = props.entities.map((entity) =>
    ({ key: entity.label, value: entity.uid !== null ? toString(entity.uid) : null }));

  // find the default option to display
  let selectedOption : ComboDropdownOption | undefined = options.find((opt) =>
    opt.value !== null && parseInt(opt.value) === props.value);

  if (selectedOption === undefined) {
    selectedOption = { key: '', value: ''};
  }

  return (
    <ComboDropdown
      options={options}
      typeName='entity type'
      allowNew={false}
      value={selectedOption}
      setValue={(val) => val !== null && val.value !== null ? props.onChange(parseInt(val.value)) : props.onChange(null)}
      createNewValue={noop} />
  );
};
