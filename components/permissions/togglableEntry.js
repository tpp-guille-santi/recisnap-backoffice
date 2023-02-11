'use client';
import { React, useState } from 'react';
import { ToggleButton } from 'primereact/togglebutton';

const TogglableEntry = props => {
  const [checked, setChecked] = useState(props.initialState);

  const onChangeValue = value => {
    setChecked(value);
    props.changeValue(value);
  };

  return (
    <div>
      <label>{props.label}</label>
      <ToggleButton
        checked={checked}
        onChange={e => onChangeValue(e.value)}
      ></ToggleButton>
    </div>
  );
};

export default TogglableEntry;
