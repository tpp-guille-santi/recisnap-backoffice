import { ReactSession } from 'react-client-session';

const UserSession = (function () {
  const setUser = userInformation => {
    const user = userInformation.data;
    console.log(user);
    ReactSession.set('user', user.name);
    ReactSession.set('email', user.email);
    ReactSession.set('firebaseUid', user.firebase_uid);
    ReactSession.set('permissions', user.permissions);
  };

  const getUser = () => {
    return {
      name: ReactSession.get('user'),
      email: ReactSession.get('email'),
      firebaseUid: ReactSession.get('firebaseUid'),
      permissions: ReactSession.get('permissions')
    };
  };

  const canEditPermissions = () => {
    const permissions = ReactSession.get('permissions');
    if (permissions === undefined) {
      return false;
    }
    return permissions.includes('grant_permissions');
  };

  return {
    setUser: setUser,
    getUser: getUser,
    canEditPermissions: canEditPermissions
  };
})();

export default UserSession;
