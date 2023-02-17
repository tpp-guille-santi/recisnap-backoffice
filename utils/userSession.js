'use client';
import { ReactSession } from 'react-client-session';
import { app } from '../app/firebase-config';
import { getAuth, signOut } from 'firebase/auth';

const UserSession = (function () {
  const setUser = userInformation => {
    const user = userInformation.data;
    ReactSession.setStoreType('sessionStorage');
    ReactSession.set('user', user.name);
    ReactSession.set('email', user.email);
    ReactSession.set('firebaseUid', user.firebase_uid);
    ReactSession.set('permissions', user.permissions);
  };

  const getUser = () => {
    ReactSession.setStoreType('sessionStorage');
    return {
      name: ReactSession.get('user'),
      email: ReactSession.get('email'),
      firebaseUid: ReactSession.get('firebaseUid'),
      permissions: ReactSession.get('permissions')
    };
  };

  const canViewUsers = () => {
    ReactSession.setStoreType('sessionStorage');
    const permissions = ReactSession.get('permissions') ?? [];
    return permissions.includes('view_users');
  };

  const canEditPermissions = () => {
    ReactSession.setStoreType('sessionStorage');
    const permissions = ReactSession.get('permissions') ?? [];
    return permissions.includes('edit_user_permissions');
  };

  const canDeleteUsers = () => {
    ReactSession.setStoreType('sessionStorage');
    const permissions = ReactSession.get('permissions') ?? [];
    return permissions.includes('delete_users');
  };

  const canViewUserActions = () => {
    ReactSession.setStoreType('sessionStorage');
    const permissions = ReactSession.get('permissions') ?? [];
    return permissions.some(r =>
      ['edit_user_permissions', 'delete_users'].includes(r)
    );
  };

  const canDeleteInstructions = () => {
    ReactSession.setStoreType('sessionStorage');
    const permissions = ReactSession.get('permissions') ?? [];
    return permissions.includes('delete_instructions');
  };

  const canCreateInstructions = () => {
    ReactSession.setStoreType('sessionStorage');
    const permissions = ReactSession.get('permissions') ?? [];
    return permissions.includes('create_instructions');
  };

  const canEditInstructions = () => {
    ReactSession.setStoreType('sessionStorage');
    const permissions = ReactSession.get('permissions') ?? [];
    return permissions.includes('edit_instructions');
  };

  const canBlockInstructions = () => {
    ReactSession.setStoreType('sessionStorage');
    const permissions = ReactSession.get('permissions') ?? [];
    return permissions.includes('block_instructions');
  };

  const canViewInstructions = () => {
    ReactSession.setStoreType('sessionStorage');
    const permissions = ReactSession.get('permissions') ?? [];
    return permissions.includes('view_instructions');
  };

  const logout = async () => {
    try {
      ReactSession.setStoreType('sessionStorage');
      ReactSession.set('user', null);
      ReactSession.set('email', null);
      ReactSession.set('firebaseUid', null);
      ReactSession.set('permissions', null);
      const auth = getAuth(app);
      signOut(auth);
    } catch (e) {
      console.log(e);
    }
  };

  const isLoggedIn = () => {
    const user = getUser();
    const firebaseUid = user.firebaseUid ?? false;
    return !!firebaseUid;
  };

  return {
    setUser: setUser,
    getUser: getUser,
    isLoggedIn: isLoggedIn,
    logout: logout,
    canEditPermissions: canEditPermissions,
    canDeleteUsers: canDeleteUsers,
    canViewUserActions: canViewUserActions,
    canViewUsers: canViewUsers,
    canDeleteInstructions: canDeleteInstructions,
    canCreateInstructions: canCreateInstructions,
    canEditInstructions: canEditInstructions,
    canBlockInstructions: canBlockInstructions,
    canViewInstructions: canViewInstructions
  };
})();

export default UserSession;
