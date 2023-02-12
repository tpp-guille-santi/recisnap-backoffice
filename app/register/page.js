'use client';
import React, { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import { app } from '../firebase-config';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { saveNewUser, getUserById } from '../../utils/serverConnector';
import {
  emailValidator,
  nameValidator,
  passwordValidator,
  confirmPasswordValidator
} from '../../utils/validators';
import UserSession from '../../utils/userSession';

function HookForm() {
  const defaultValues = {
    name: '',
    email: '',
    password: '',
    confirm_password: ''
  };

  const [loading, setLoading] = useState(false);
  const toast = useRef(null);

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm({ defaultValues: defaultValues, shouldFocusError: false });

  const onSubmit = async data => {
    setLoading(true);
    await saveUser(data);
    setLoading(false);
    reset();
  };

  const auth = getAuth(app);
  const router = useRouter();

  const saveUser = async data => {
    console.log('Saving user');
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      console.log('Signed Up!');
      const user = userCredential.user;
      const userInformationObject = {
        firebase_uid: user.uid,
        name: data.name,
        email: data.email
      };
      const exit = await saveNewUser(userInformationObject);
      toast.current.show({
        severity: 'success',
        summary: 'Successful',
        detail: 'Created user successfully',
        life: 3000
      });
      console.log('Creating Session');
      const userInformation = await getUserById(user.uid);
      UserSession.setUser(userInformation);
      router.push('/homepage');
    } catch (error) {
      console.log('Error sign in');
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error when creating user',
        life: 3000
      });
    }
  };

  const getFormErrorMessage = name => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };

  const getProgressSpinner = name => {
    return (
      loading && (
        <div className="flex justify-content-center flex-wrap card-container yellow-container">
          <ProgressSpinner
            aria-label="Loading"
            className="flex align-items-center justify-content-center w-4rem h-4rem m-2"
          />
        </div>
      )
    );
  };

  return (
    <div>
      <Toast ref={toast} />
      {getProgressSpinner()}
      <div className="surface-card border-round shadow-2 p-4">
        <span className="text-900 text-2xl font-medium mb-4 block">
          Registrate con un nuevo usuario
        </span>
        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
          <div className="mb-5">
            <span className="p-float-label">
              <Controller
                name="name"
                control={control}
                rules={{ validate: nameValidator }}
                render={({ field, fieldState }) => (
                  <InputText
                    id={field.name}
                    {...field}
                    className={classNames({ 'p-invalid': fieldState.invalid })}
                  />
                )}
              />
              <label
                htmlFor="name"
                className={classNames({ 'p-error': errors.name })}
              >
                Nombre y Apellido
              </label>
            </span>
            {getFormErrorMessage('name')}
          </div>
          <div className="mb-5">
            <span className="p-float-label p-input-icon-right">
              <i className="pi pi-envelope" />
              <Controller
                name="email"
                control={control}
                rules={{ validate: emailValidator }}
                render={({ field, fieldState }) => (
                  <InputText
                    id={field.name}
                    {...field}
                    className={classNames({ 'p-invalid': fieldState.invalid })}
                  />
                )}
              />
              <label
                htmlFor="email"
                className={classNames({ 'p-error': !!errors.email })}
              >
                Email
              </label>
            </span>
            {getFormErrorMessage('email')}
          </div>
          <div className="mb-5">
            <span className="p-float-label">
              <Controller
                name="password"
                control={control}
                rules={{ validate: passwordValidator }}
                render={({ field, fieldState }) => (
                  <Password
                    id={field.name}
                    {...field}
                    inputRef={field.ref}
                    toggleMask
                    className={classNames({ 'p-invalid': fieldState.invalid })}
                  />
                )}
              />
              <label
                htmlFor="password"
                className={classNames({ 'p-error': errors.password })}
              >
                Contraseña
              </label>
            </span>
            {getFormErrorMessage('password')}
          </div>
          <div className="mb-5">
            <span className="p-float-label">
              <Controller
                name="confirm_password"
                control={control}
                rules={{ validate: confirmPasswordValidator }}
                render={({ field, fieldState }) => (
                  <Password
                    id={field.name}
                    {...field}
                    inputRef={field.ref}
                    toggleMask
                    className={classNames({ 'p-invalid': fieldState.invalid })}
                  />
                )}
              />
              <label
                htmlFor="confirm_password"
                className={classNames({ 'p-error': errors.confirm_password })}
              >
                Contraseña
              </label>
            </span>
            {getFormErrorMessage('confirm_password')}
          </div>

          <Button type="submit" label="Registrarse" />
        </form>
      </div>
    </div>
  );
}

export default HookForm;
