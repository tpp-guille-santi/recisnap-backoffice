'use client';
import React, { useEffect, useState } from 'react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { getUserList } from '../../utils/serverConnector';
import { Button } from 'primereact/button';
import PermissionIcon from '../../components/permissionIcon.js';
import UserSession from '../../utils/userSession';
import EditPermissionsDialog from '../../components/permissions/editPermissionsDialog.js';
import PrivateRoute from '../../components/privateRoute';
import Navbar from '../../components/navbar';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [dialogVisibility, setDialogVisibility] = useState(false);
  const [currentPermissions, setCurrentPermissions] = useState([]);
  const [editedUserId, setEditedUserId] = useState('');

  useEffect(() => {
    getUsers().then(data => setUsers(data));
  }, []);

  async function getUsers() {
    return getUserList();
  }

  const permissionsColumnBody = rowData => {
    var permissions =
      rowData['permissions'] !== null ? rowData.permissions : [];
    return (
      <div>
        <PermissionIcon
          permission={permissions.includes('view_pages')}
          tooltip="Ver documento"
          icon={'pi pi-eye'}
        />
        <PermissionIcon
          permission={permissions.includes('create_page')}
          tooltip="Nuevo documento"
          icon={'pi pi-plus'}
        />
        <PermissionIcon
          permission={permissions.includes('block_page')}
          tooltip="Blockear documento"
          icon={'pi pi-stop-circle'}
        />
        <PermissionIcon
          permission={permissions.includes('edit_page')}
          tooltip="Editar documento"
          icon={'pi pi-file-edit'}
        />
        <PermissionIcon
          permission={permissions.includes('grant_permissions')}
          tooltip="Dar permisos"
          icon={'pi pi-user-edit'}
        />
        <PermissionIcon
          permission={permissions.includes('view_users')}
          tooltip="Ver usuario"
          icon={'pi pi-user'}
        />
      </div>
    );
  };

  const closeDialog = () => {
    setDialogVisibility(false);
    getUsers().then(data => setUsers(data));
  };

  const actionsBody = rowData => {
    return (
      <div>
        <Button
          className="p-button-rounded m-1"
          icon="pi pi-pencil"
          tooltip="Editar permisos"
          disabled={!UserSession.canEditPermissions()}
          onClick={() => {
            setDialogVisibility(true);
            setCurrentPermissions(rowData.permissions);
            setEditedUserId(rowData['firebase_uid']);
          }}
        />
      </div>
    );
  };

  return (
    <PrivateRoute>
      <Navbar></Navbar>
      <div className='m-5'>
        <div className="text-3xl text-800 font-bold mb-4">Usuarios</div>
        <div>
          <EditPermissionsDialog
            visibility={dialogVisibility}
            close={closeDialog}
            permissions={currentPermissions}
            editedUser={editedUserId}
          ></EditPermissionsDialog>
        </div>
        <DataTable
          value={users}
          dataKey="id"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
          responsiveLayout="scroll"
        >
          <Column
            field="email"
            header="Email"
            sortable
          ></Column>
          <Column
            field="name"
            header="Nombre"
            sortable
          ></Column>
          <Column
            header="Permisos"
            sortable
            body={permissionsColumnBody}
          ></Column>
          <Column
            header="Acciones"
            exportable={false}
            body={actionsBody}
          ></Column>
        </DataTable>
      </div>
    </PrivateRoute>
  );
};

export default UsersPage;
