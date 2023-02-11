import { React, useEffect, useState } from 'react';
import TogglableEntry from './togglableEntry';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

const EditPermissionsDialog = props => {
  const [canViewDocument, setCanViewDocument] = useState(false);
  const [canCreateDocument, setCanCreateDocument] = useState(false);
  const [canEditDocument, setCanEditDocument] = useState(false);
  const [canBlockDocument, setCanBlockDocument] = useState(false);
  const [canEditPermissions, setCanEditPermissions] = useState(false);
  const [canViewUsers, setCanViewUsers] = useState(false);

  useEffect(() => {
    setCanViewDocument(props.permissions.includes('view_pages'));
    setCanCreateDocument(props.permissions.includes('create_page'));
    setCanBlockDocument(props.permissions.includes('block_page'));
    setCanEditDocument(props.permissions.includes('edit_page'));
    setCanEditPermissions(props.permissions.includes('grant_permissions'));
    setCanViewUsers(props.permissions.includes('view_users'));
  }, [props.permissions]);

  /*useEffect(() => {
    setCanViewDocument(props.permissions.includes('view_pages'));
  }, [props.permissions]);*/

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
              changeValue={setCanViewDocument}
            ></TogglableEntry>
          </div>
          <div>
            <TogglableEntry
              label="Nuevo documento"
              initialState={props.permissions.includes('create_page')}
              changeValue={setCanCreateDocument}
            ></TogglableEntry>
          </div>
          <div>
            <TogglableEntry
              label="Blockear documento"
              initialState={props.permissions.includes('block_page')}
              changeValue={setCanBlockDocument}
            ></TogglableEntry>
          </div>
          <div>
            <TogglableEntry
              label="Editar documento"
              initialState={props.permissions.includes('edit_page')}
              changeValue={setCanEditDocument}
            ></TogglableEntry>
          </div>
          <div>
            <TogglableEntry
              label="Dar permisos"
              initialState={props.permissions.includes('grant_permissions')}
              changeValue={setCanEditPermissions}
            ></TogglableEntry>
          </div>
          <div>
            <TogglableEntry
              label="Ver usuario"
              initialState={props.permissions.includes('view_users')}
              changeValue={setCanViewUsers}
            ></TogglableEntry>
          </div>
        </div>
        <div>
          <Button
            onClick={() => {
              console.log({
                viewDoc: canViewDocument,
                block: canBlockDocument,
                newDocs: canCreateDocument,
                editDoc: canEditDocument,
                users: canViewUsers,
                permi: canEditPermissions
              });
            }}
          ></Button>
        </div>
      </Dialog>
    </div>
  );
};

export default EditPermissionsDialog;
