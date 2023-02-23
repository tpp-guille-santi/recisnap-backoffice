'use client';
import { app } from '../app/firebase-config';
import { getAuth, signOut } from 'firebase/auth';

const UserSession = (function () {
  const setUser = userInformation => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('user', JSON.stringify(userInformation.data));
    }
  };

  const getUser = () => {
    if (typeof window !== 'undefined') {
      return JSON.parse(sessionStorage.getItem('user'));
    }
    return null;
  };

  const getUserName = () => {
    const user = getUser();
    const name = user?.name ?? null;
    return name;
  };

  const getUserFirebaseUid = () => {
    const user = getUser();
    const firebase_uid = user?.firebase_uid ?? null;
    return firebase_uid;
  };

  const getUserPermissions = () => {
    const user = getUser();
    const permissions = user?.permissions ?? [];
    return permissions;
  };

  const canViewUsers = () => {
    const permissions = getUserPermissions();
    return permissions.includes('view_users');
  };

  const canEditPermissions = () => {
    const permissions = getUserPermissions()
    return permissions.includes('edit_user_permissions');
  };

  const canDeleteUsers = () => {
    const permissions = getUserPermissions()
    return permissions.includes('delete_users');
  };

  const canViewUserActions = () => {
    const permissions = getUserPermissions()
    return permissions.some(r =>
      ['edit_user_permissions', 'delete_users'].includes(r)
    );
  };

  const canDeleteInstructions = () => {
    const permissions = getUserPermissions()
    return permissions.includes('delete_instructions');
  };

  const canCreateInstructions = () => {
    const permissions = getUserPermissions()
    return permissions.includes('create_instructions');
  };

  const canEditInstructions = () => {
    const permissions = getUserPermissions()
    return permissions.includes('edit_instructions');
  };

  const canBlockInstructions = () => {
    const permissions = getUserPermissions()
    return permissions.includes('block_instructions');
  };

  const canViewInstructions = () => {
    const permissions = getUserPermissions()
    return permissions.includes('view_instructions');
  };

  const logout = async () => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('user', null);
      }
      const auth = getAuth(app);
      signOut(auth);
    } catch (e) {
      console.log(e);
    }
  };

  const isLoggedIn = () => {
    const user = getUser();
    const firebase_uid = user?.firebase_uid ?? false;
    return !!firebase_uid;
  };

  return {
    setUser: setUser,
    getUser: getUser,
    getUserName: getUserName,
    getUserFirebaseUid: getUserFirebaseUid,
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
