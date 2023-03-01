'use client';
import React, { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { app } from '../firebase-config';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { saveNewUser, getUserById } from '../../utils/serverConnector';
import Image from 'next/image';
import logo from '../../public/logo.svg';
import Link from 'next/link';
import {
  emailValidator,
  nameValidator,
  passwordValidator,
  confirmPasswordValidator
} from '../../utils/validators';
import Spinner from '../../components/spinner';
import { setUser } from '../../utils/userSession';

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
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;
      const userInformationObject = {
        firebase_uid: user.uid,
        name: data.name,
        email: data.email
      };
      const exit = await saveNewUser(userInformationObject);
      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'El usuario se creó con éxito',
        life: 3000
      });
      const userInformation = await getUserById(user.uid);
      setUser(userInformation);
      router.push('/instructions');
    } catch (edit) {
      console.log(e);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al intentar crear el usuario',
        life: 3000
      });
    }
  };

  const getFormErrorMessage = name => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };

  const getProgressSpinner = () => {
    return loading && <Spinner />;
  };

  return (
    <div>
      <Toast ref={toast} />
      {getProgressSpinner()}
      <div className="card">
        <div className="h-screen flex justify-content-center align-content-center flex-wrap">
          <div className="inline-flex flex-wrap flex-column surface-card border-round shadow-2 py-6 px-6">
            <div className="flex align-items-center justify-content-center flex-wrap pb-5">
              <div className="flex align-items-center justify-content-center">
                <Image src={logo} alt="Recisnap logo" height={60} />
              </div>
              <div className="flex align-items-center justify-content-center">
                <h1 className="logo">Recisnap</h1>
              </div>
            </div>
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
                        className={classNames({
                          'p-invalid': fieldState.invalid
                        })}
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
                        className={classNames({
                          'p-invalid': fieldState.invalid
                        })}
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
                        className={classNames({
                          'p-invalid': fieldState.invalid
                        })}
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
                        className={classNames({
                          'p-invalid': fieldState.invalid
                        })}
                      />
                    )}
                  />
                  <label
                    htmlFor="confirm_password"
                    className={classNames({
                      'p-error': errors.confirm_password
                    })}
                  >
                    Repetir contraseña
                  </label>
                </span>
                {getFormErrorMessage('confirm_password')}
              </div>
              <div className="mb-5">
                <Button className="p-2" type="submit" label="Registrate" />
              </div>
              <div className="mb-5">
                Ya tenes cuenta?{' '}
                <Link href="/login">Hace click aquí para ingresar</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HookForm;
