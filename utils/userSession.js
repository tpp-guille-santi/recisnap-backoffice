import { useState } from 'react';

const UserSession = (function () {
  /*const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userFirebaseUid, setUserFirebaseUid] = useState('');
  const [userPermissions, setUserPermissions] = useState([]);*/

  var name = '';
  var email = '';
  var firebaseUid = '';
  var permissions = [];

  const setUser = userInformation => {
    const user = userInformation.data;
    console.log(user);
    self.name = user.name;
    self.email = user.email;
    self.firebaseUid = user.firebase_uid;
    self.permissions = user.userPermissions;
  };

  const getUser = () => {
    return {
      name: self.name,
      email: self.email,
      firebaseUid: self.firebaseUid,
      permissions: self.permissions
    };
  };

  return { setUser: setUser, getUser: getUser };
})();

export default UserSession;
