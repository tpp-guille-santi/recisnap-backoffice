import { React } from 'react';
import TogglableEntry from './togglableEntry';
import { Dialog } from 'primereact/dialog';

const EditPermissionsDialog = props => {
  return (
    <div>
      <Dialog
        visible={props.visibility}
        onHide={() => props.setVisibility(false)}
        style={{ width: '50vw' }}
      >
        Dialog
        <div>
          <TogglableEntry></TogglableEntry>
        </div>
        <div>
          <TogglableEntry></TogglableEntry>
        </div>
        <div>
          <TogglableEntry></TogglableEntry>
        </div>
        <div>
          <TogglableEntry></TogglableEntry>
        </div>
        <div>
          <TogglableEntry></TogglableEntry>
        </div>
        <div>
          <TogglableEntry></TogglableEntry>
        </div>
      </Dialog>
    </div>
  );
};

export default EditPermissionsDialog;
