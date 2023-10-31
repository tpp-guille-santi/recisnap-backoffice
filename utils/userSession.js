import { app } from '../app/firebase-config';
import { getAuth, signOut } from 'firebase/auth';
import { setCookie, getCookie, deleteCookie } from 'cookies-next';

const setUser = userInformation => {
  const user = userInformation.data;
  setCookie('user', user);
};

const getUser = () => {
  const user = getCookie('user');
  if (!user) {
    return null;
  }
  return JSON.parse(user);
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

const getUserEmail = () => {
  const user = getUser();
  const email = user?.email ?? null;
  return email;
};

const canViewUsers = () => {
  const permissions = getUserPermissions();
  return permissions.includes('view_users');
};

const canEditPermissions = () => {
  const permissions = getUserPermissions();
  return permissions.includes('edit_user_permissions');
};

const canDeleteUsers = () => {
  const permissions = getUserPermissions();
  return permissions.includes('delete_users');
};

const canViewUserActions = () => {
  const permissions = getUserPermissions();
  return permissions.some(r =>
    ['edit_user_permissions', 'delete_users'].includes(r)
  );
};

const canDeleteInstructions = () => {
  const permissions = getUserPermissions();
  return permissions.includes('delete_instructions');
};

const canCreateInstructions = () => {
  const permissions = getUserPermissions();
  return permissions.includes('create_instructions');
};

const canEditInstructions = () => {
  const permissions = getUserPermissions();
  return permissions.includes('edit_instructions');
};

const canBlockInstructions = () => {
  const permissions = getUserPermissions();
  return permissions.includes('block_instructions');
};

const canViewInstructions = () => {
  const permissions = getUserPermissions();
  return permissions.includes('view_instructions');
};

const logout = async () => {
  try {
    deleteCookie('user');
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

export {
  setUser,
  getUser,
  getUserName,
  getUserFirebaseUid,
  getUserEmail,
  isLoggedIn,
  logout,
  canEditPermissions,
  canDeleteUsers,
  canViewUserActions,
  canViewUsers,
  canDeleteInstructions,
  canCreateInstructions,
  canEditInstructions,
  canBlockInstructions,
  canViewInstructions
};
