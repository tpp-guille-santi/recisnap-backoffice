'use client';
import { React, useEffect, useState } from 'react';
import TogglableEntry from './togglableEntry';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { updateUserPermissions } from '../../utils/serverConnector';

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

  const saveNewPermissions = async () => {
    let userNewPermissions = [];
    if (canViewDocument) userNewPermissions.push('view_pages');
    if (canCreateDocument) userNewPermissions.push('create_page');
    if (canBlockDocument) userNewPermissions.push('block_page');
    if (canEditDocument) userNewPermissions.push('edit_page');
    if (canViewUsers) userNewPermissions.push('grant_permissions');
    if (canEditPermissions) userNewPermissions.push('view_users');
    await updateUserPermissions(props.editedUser, userNewPermissions);
    props.close();
  };

  const dialogFooter = (
    <div>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className="p-button-text"
        onClick={() => props.close()}
      />
      <Button
        label="Guardar"
        icon="pi pi-check"
        onClick={() => saveNewPermissions()}
      />
    </div>
  );

  return (
    <div>
      <Dialog
        className="w-3"
        visible={props.visibility}
        footer={dialogFooter}
        onHide={() => props.close()}
        header="Permisos del usuario"
      >
        <div>
          <div>
            <TogglableEntry
              label="Ver instrucciones"
              icon={'pi pi-eye'}
              initialState={props.permissions.includes('view_pages')}
              changeValue={setCanViewDocument}
            ></TogglableEntry>
          </div>
          <div>
            <TogglableEntry
              label="Crear instrucciones"
              icon={'pi pi-plus'}
              initialState={props.permissions.includes('create_page')}
              changeValue={setCanCreateDocument}
            ></TogglableEntry>
          </div>
          <div>
            <TogglableEntry
              label="Bloquear instrucciones"
              icon={'pi pi-stop-circle'}
              initialState={props.permissions.includes('block_page')}
              changeValue={setCanBlockDocument}
            ></TogglableEntry>
          </div>
          <div>
            <TogglableEntry
              label="Editar instrucciones"
              icon={'pi pi-file-edit'}
              initialState={props.permissions.includes('edit_page')}
              changeValue={setCanEditDocument}
            ></TogglableEntry>
          </div>
          <div>
            <TogglableEntry
              label="Editar usuarios"
              icon={'pi pi-user-edit'}
              initialState={props.permissions.includes('grant_permissions')}
              changeValue={setCanEditPermissions}
            ></TogglableEntry>
          </div>
          <div>
            <TogglableEntry
              label="Ver usuarios"
              icon={'pi pi-user'}
              initialState={props.permissions.includes('view_users')}
              changeValue={setCanViewUsers}
            ></TogglableEntry>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default EditPermissionsDialog;
