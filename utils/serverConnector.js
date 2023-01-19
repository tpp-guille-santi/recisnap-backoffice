const saveNewUser = async () => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/signup`,
    body
  );
  return response.code == 200;
};

export { saveNewUser };
