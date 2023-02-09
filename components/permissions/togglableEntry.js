import { React, useState } from 'react';
import { ToggleButton } from 'primereact/togglebutton';

const TogglableEntry = props => {
  const [checked, setChecked] = useState(false);
  return (
    <div>
      <label> Permiso </label>
      <div>
        <ToggleButton
          checked={checked}
          onChange={e => setChecked(e.value)}
        ></ToggleButton>
      </div>
    </div>
  );
};

export default TogglableEntry;
