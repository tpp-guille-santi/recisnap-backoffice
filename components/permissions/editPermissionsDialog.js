import { React } from 'react';
import TogglableEntry from './togglableEntry';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

const EditPermissionsDialog = props => {
  return (
    <div>
      <Dialog
        visible={props.visibility}
        onHide={() => props.setVisibility(false)}
        style={{ width: '50vw' }}
      >
        <div>
          <div>
            <TogglableEntry
              label="Ver documento"
              initialState={props.permissions.includes('view_pages')}
            ></TogglableEntry>
          </div>
          <div>
            <TogglableEntry
              label="Nuevo documento"
              initialState={props.permissions.includes('create_page')}
            ></TogglableEntry>
          </div>
          <div>
            <TogglableEntry
              label="Blockear documento"
              initialState={props.permissions.includes('block_page')}
            ></TogglableEntry>
          </div>
          <div>
            <TogglableEntry
              label="Editar documento"
              initialState={props.permissions.includes('edit_page')}
            ></TogglableEntry>
          </div>
          <div>
            <TogglableEntry
              label="Dar permisos"
              initialState={props.permissions.includes('grant_permissions')}
            ></TogglableEntry>
          </div>
          <div>
            <TogglableEntry
              label="Ver usuario"
              initialState={props.permissions.includes('view_users')}
            ></TogglableEntry>
          </div>
        </div>
        <div>
          <Button></Button>
        </div>
      </Dialog>
    </div>
  );
};

export default EditPermissionsDialog;
