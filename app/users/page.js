'use client';
import React, {useEffect, useState, useRef} from 'react';
import {Column} from 'primereact/column';
import {DataTable} from 'primereact/datatable';
import {getUserList} from '../../utils/serverConnector';
import {deleteUserById} from '../../utils/serverConnector';
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import PermissionIcon from '../../components/permissionIcon.js';
import EditPermissionsDialog from '../../components/permissions/editPermissionsDialog.js';
import {Dialog} from 'primereact/dialog';
import PrivateRoute from '../../components/privateRoute';
import Navbar from '../../components/navbar';
import all_permissions from '../../config/permissions.json';
import {Toast} from 'primereact/toast';
import {useRouter} from 'next/navigation';
import {
  canDeleteUsers,
  canEditPermissions,
  canViewUserActions,
  getUserFirebaseUid,
  logout,
} from '../../utils/userSession';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [dialogVisibility, setDialogVisibility] = useState(false);
  const [currentPermissions, setCurrentPermissions] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
  const [editedUserId, setEditedUserId] = useState('');
  const [deleteUserDialogVisibility, setDeleteUserDialogVisibility] = useState(false);
  const toast = useRef(null);

  useEffect(() => {
    getUsers().then((data) => setUsers(data));
  }, []);

  const router = useRouter();
  const signOut = async () => {
    await logout();
    router.push('/login');
  };

  async function getUsers() {
    return await getUserList();
  }

  const permissionsColumnBody = (rowData) => {
    var permissions = rowData['permissions'] !== null ? rowData.permissions : [];
    return (
      <div>
        {all_permissions.map((permission) => {
          return (
            <PermissionIcon
              key={permission.id}
              permission={permissions.includes(permission.id)}
              tooltip={permission.label}
              icon={permission.icon}
            />
          );
        })}
      </div>
    );
  };

  const savePermissionsDialog = async (firebase_uid, permissions) => {
    if (firebase_uid == getUserFirebaseUid()) {
      await signOut();
    }
    const user = users.find((user) => user.firebase_uid === firebase_uid);
    user.permissions = permissions;
    setUsers(users);
    setDialogVisibility(false);
  };

  const hidePermissionsDialog = () => {
    setDialogVisibility(false);
  };

  const actionsBody = (rowData) => {
    return (
      <div>
        {canEditPermissions() && (
          <Button
            className='m-1'
            severity='success'
            rounded
            icon='pi pi-pencil'
            tooltip='Editar permisos'
            tooltipOptions={{showOnDisabled: true, position: 'bottom'}}
            onClick={() => {
              setDialogVisibility(true);
              setCurrentPermissions(rowData.permissions);
              setEditedUserId(rowData['firebase_uid']);
            }}
          />
        )}
        {canDeleteUsers() && (
          <Button
            className=' m-1'
            severity='danger'
            rounded
            icon='pi pi-trash'
            tooltip='Eliminar usuario'
            tooltipOptions={{showOnDisabled: true, position: 'bottom'}}
            onClick={() => confirmDeleteUser(rowData)}
          />
        )}
      </div>
    );
  };

  const deleteUser = async () => {
    try {
      await deleteUserById(currentUser.firebase_uid);
      setUsers(users.filter((user) => user.firebase_uid !== currentUser.firebase_uid));
      setDeleteUserDialogVisibility(false);
      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Usuaio eliminado',
        life: 3000,
      });
    } catch (e) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo eliminar el usuario',
        life: 3000,
      });
    }
  };

  const confirmDeleteUser = (user) => {
    setCurrentUser(user);
    setDeleteUserDialogVisibility(true);
  };

  const hideDeleteUserDialog = () => {
    setDeleteUserDialogVisibility(false);
  };

  const deleteUserDialogFooter = (
    <React.Fragment>
      <Button
        label='Cancelar'
        icon='pi pi-times'
        className='mt-2'
        severity='secondary'
        onClick={hideDeleteUserDialog}
      />
      <Button label='Eliminar' icon='pi pi-check' className='mt-2' onClick={deleteUser} />
    </React.Fragment>
  );

  const deleteUserDialog = () => {
    return (
      <Dialog
        className='w-6'
        visible={deleteUserDialogVisibility}
        header='Confirmar'
        modal
        footer={deleteUserDialogFooter}
        onHide={hideDeleteUserDialog}
      >
        <div className='flex align-items-center justify-content-center'>
          <i className='pi pi-exclamation-triangle mr-3 text-4xl' />
          <span>Estás seguro de que quieres eliminar el usuario?</span>
        </div>
      </Dialog>
    );
  };

  return (
    <PrivateRoute>
      <Toast ref={toast} />
      <Navbar></Navbar>
      <div className='m-5'>
        <div className='text-3xl text-800 font-bold mb-4'>Usuarios</div>
        <div>
          <EditPermissionsDialog
            visibility={dialogVisibility}
            save={savePermissionsDialog}
            close={hidePermissionsDialog}
            permissions={currentPermissions}
            editedUser={editedUserId}
          ></EditPermissionsDialog>
        </div>
        <DataTable
          value={users}
          dataKey='firebase_uid'
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
          currentPageReportTemplate='{first} - {last} de {totalRecords}'
          responsiveLayout='scroll'
        >
          <Column field='email' header='Email' filter sortable></Column>
          <Column field='name' header='Nombre' filter sortable></Column>
          <Column header='Permisos' sortable body={permissionsColumnBody}></Column>
          {canViewUserActions() && (
            <Column header='Acciones' exportable={false} body={actionsBody}></Column>
          )}
        </DataTable>
      </div>
      {deleteUserDialog()}
    </PrivateRoute>
  );
};

export default UsersPage;
