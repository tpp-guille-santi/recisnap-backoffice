import axios from "axios";

const saveNewUser = async (body) => {
  const response = await axios
    .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, body)
    .then((response) => {
      console.log(response);
      return response.code == 201;
    })
    .catch((error) => {
      console.log(error);
    });
};

export { saveNewUser };
