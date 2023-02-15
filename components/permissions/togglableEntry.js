'use client';
import { React, useState } from 'react';
import { ToggleButton } from 'primereact/togglebutton';
import { InputSwitch } from 'primereact/inputswitch';

const TogglableEntry = props => {
  const [checked, setChecked] = useState(props.initialState);

  const onChangeValue = value => {
    setChecked(value);
    props.changeValue(value);
  };

  return (
    <div className="flex flex-row flex-wrap justify-content-between align-content-center">
      <label className="flex align-items-center justify-content-center m-1">
        {props.label}
      </label>
      <InputSwitch
        className="flex align-items-center justify-content-center m-1"
        checked={checked}
        onChange={e => onChangeValue(e.value)}
      ></InputSwitch>
    </div>
  );
};

export default TogglableEntry;
