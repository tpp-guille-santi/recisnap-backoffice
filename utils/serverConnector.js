import axios from 'axios';

const saveNewUser = async body => {
  const response = await axios
    .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, body)
    .then(response => {
      return response.code == 201;
    })
    .catch(e => {
      console.log(e);
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
    await axios.patch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userId}`,
      { permissions: permissions }
    );
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const updateInstruction = async (instructionId, body) => {
  try {
    await axios.patch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/instructions/${instructionId}`,
      body
    );
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const deleteUserById = async firebaseId => {
  await axios.delete(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${firebaseId}`
  );
};

export {
  saveNewUser,
  getUserList,
  getUserById,
  updateUserPermissions,
  deleteUserById,
  updateInstruction
};
