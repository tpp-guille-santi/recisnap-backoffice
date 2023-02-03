import { useState } from 'react';

const UserSession = (function () {
  /*const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userFirebaseUid, setUserFirebaseUid] = useState('');
  const [userPermissions, setUserPermissions] = useState([]);*/

  let name = '';
  let email = '';
  let firebaseUid = '';
  let myPerm = [];

  const setUser = userInformation => {
    const user = userInformation.data;
    console.log(user);
    self.name = user.name;
    self.email = user.email;
    self.firebaseUid = user.firebase_uid;
    self.myPerm = user.permissions;
  };

  const getUser = () => {
    return {
      name: self.name,
      email: self.email,
      firebaseUid: self.firebaseUid,
      permissions: self.myPerm
    };
  };

  const canEditPermissions = () => {
    console.log(myPerm);
    return myPerm.includes('grant_permissions');
  };

  return {
    setUser: setUser,
    getUser: getUser,
    canEditPermissions: canEditPermissions
  };
})();

export default UserSession;
