import { React, useState } from 'react';
import { ToggleButton } from 'primereact/togglebutton';

const TogglableEntry = props => {
  const [checked, setChecked] = useState(props.initialState);
  return (
    <div>
      <label>{props.label}</label>
      <ToggleButton
        checked={checked}
        onChange={e => setChecked(e.value)}
      ></ToggleButton>
    </div>
  );
};

export default TogglableEntry;
