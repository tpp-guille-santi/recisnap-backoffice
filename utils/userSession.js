import { ReactSession } from 'react-client-session';

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

  const canEditPermissions = () => {
    ReactSession.setStoreType('sessionStorage');
    const permissions = ReactSession.get('permissions');
    if (permissions === undefined) {
      return false;
    }
    return permissions.includes('grant_permissions');
  };

  const signOut = () => {
    ReactSession.setStoreType('sessionStorage');
    ReactSession.set('user', null);
    ReactSession.set('email', null);
    ReactSession.set('firebaseUid', null);
    ReactSession.set('permissions', null);
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
    signOut: signOut,
    canEditPermissions: canEditPermissions
  };
})();

export default UserSession;
