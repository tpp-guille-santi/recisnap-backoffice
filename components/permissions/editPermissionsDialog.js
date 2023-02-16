'use client';
import { React, useEffect, useState } from 'react';
import TogglableEntry from './togglableEntry';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { updateUserPermissions } from '../../utils/serverConnector';
import all_permissions from '../../config/permissions.json';

const EditPermissionsDialog = props => {
  const [checkedPermissions, setCheckedPermissions] = useState([]);

  function changePermission(id, value) {
    console.log(checkedPermissions);
    const permission = checkedPermissions.find(
      permission => permission.id === id
    );
    permission.value = value;
    setCheckedPermissions(checkedPermissions);
  }

  useEffect(() => {
    setCheckedPermissions(
      all_permissions.map(permission => {
        return {
          id: permission.id,
          value: props.permissions.includes(permission.id)
        };
      })
    );
  }, [props.permissions]);

  const savePermissions = async () => {
    console.log(checkedPermissions);
    const permissions = checkedPermissions
      .filter(permission => !!permission.value)
      .map(permission => permission.id);
    console.log(permissions);
    const success = await updateUserPermissions(props.editedUser, permissions);
    if (success) {
      props.save(props.editedUser, permissions);
    }
    setCheckedPermissions([]);
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
        onClick={() => savePermissions()}
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
          {all_permissions.map(permission => {
            return (
              <TogglableEntry
                key={permission.id}
                id={permission.id}
                label={permission.label}
                initialState={props.permissions.includes(permission.id)}
                changeValue={changePermission}
              ></TogglableEntry>
            );
          })}
        </div>
      </Dialog>
    </div>
  );
};

export default EditPermissionsDialog;
