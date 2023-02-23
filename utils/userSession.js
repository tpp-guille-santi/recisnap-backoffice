'use client';
import { app } from '../app/firebase-config';
import { getAuth, signOut } from 'firebase/auth';

const UserSession = (function () {
  const setUser = userInformation => {
    const user = userInformation.data;
    sessionStorage.setItem('user', JSON.stringify(user));
  };

  const getUser = () => {
    return JSON.parse(sessionStorage.getItem('user'));
  };

  const canViewUsers = () => {
    const permissions = getUser().permissions ?? [];
    return permissions.includes('view_users');
  };

  const canEditPermissions = () => {
    const permissions = getUser().permissions ?? [];
    return permissions.includes('edit_user_permissions');
  };

  const canDeleteUsers = () => {
    const permissions = getUser().permissions ?? [];
    return permissions.includes('delete_users');
  };

  const canViewUserActions = () => {
    const permissions = getUser().permissions ?? [];
    return permissions.some(r =>
      ['edit_user_permissions', 'delete_users'].includes(r)
    );
  };

  const canDeleteInstructions = () => {
    const permissions = getUser().permissions ?? [];
    return permissions.includes('delete_instructions');
  };

  const canCreateInstructions = () => {
    const permissions = getUser().permissions ?? [];
    return permissions.includes('create_instructions');
  };

  const canEditInstructions = () => {
    const permissions = getUser().permissions ?? [];
    return permissions.includes('edit_instructions');
  };

  const canBlockInstructions = () => {
    const permissions = getUser().permissions ?? [];
    return permissions.includes('block_instructions');
  };

  const canViewInstructions = () => {
    const permissions = getUser().permissions ?? [];
    return permissions.includes('view_instructions');
  };

  const logout = async () => {
    try {
      sessionStorage.setItem('user', null);
      const auth = getAuth(app);
      signOut(auth);
    } catch (e) {
      console.log(e);
    }
  };

  const isLoggedIn = () => {
    const user = getUser();
    const firebase_uid = user.firebase_uid ?? false;
    return !!firebase_uid;
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
