import axios from 'axios';

const saveNewUser = async body => {
  const response = await axios
    .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, body)
    .then(response => {
      console.log(response);
      return response.code == 201;
    })
    .catch(error => {
      console.log(error);
    });
  return response;
};

const getUserList = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users`
    );
    return response.data;
  } catch (e) {
    console.log(e);
    return [];
  }
};

const getUserById = async firebaseId => {
  /*const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${firebaseId}`
    );*/
  return await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${firebaseId}`
  );
};

const updateUserPermissions = async (userId, permissions) => {
  try {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userId}`,
      { permissions: permissions }
    );
  } catch (e) {
    console.log(e);
  }
};

export { saveNewUser, getUserList, getUserById, updateUserPermissions };
