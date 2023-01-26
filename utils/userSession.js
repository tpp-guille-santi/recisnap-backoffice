import { useState } from 'react';

const UserSession = (function () {
  /*const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userFirebaseUid, setUserFirebaseUid] = useState('');
  const [userPermissions, setUserPermissions] = useState([]);
*/
  var name = '';
  var email = '';
  var firebaseUid = '';
  var permissions = [];

  const setUser = user => {
    name = user.name;
    email = user.email;
    firebaseUid = user.firebaseUid;
    permissions = user.userPermissions;
  };

  const getUser = () => {
    return { name: name };
  };

  return { setUser: setUser, getUser: getUser };
})();

export default UserSession;
