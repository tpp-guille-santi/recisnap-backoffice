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
    <div style={{ marginTop: '1em', marginBottom: '1em' }}>
      <ToggleButton
        checked={checked}
        onChange={e => onChangeValue(e.value)}
        style={{ marginRight: '10px', height: '30px' }}
      ></ToggleButton>
      <label>{props.label}</label>
    </div>
  );
};

export default TogglableEntry;
