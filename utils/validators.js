export const nameValidator = name => {
  if (!name.trim()) {
    return 'Name is required';
  }
  return null;
};

export const emailValidator = email => {
  if (!email) {
    return 'Email is required';
  } else if (!new RegExp(/\S+@\S+\.\S+/).test(email)) {
    return 'Incorrect email format';
  }
  return null;
};

export const passwordValidator = password => {
  if (!password) {
    return 'Password is required';
  } else if (password.length < 6) {
    return 'Password must have a minimum 8 characters';
  }
  return null;
};

export const confirmPasswordValidator = (confirmPassword, form) => {
  if (!confirmPassword) {
    return 'Confirm password is required';
  } else if (confirmPassword.length < 6) {
    return 'Confirm password must have a minimum 8 characters';
  } else if (confirmPassword !== form.password) {
    return 'Passwords do not match';
  }
  return null;
};
