'use client';
import React, { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { app } from '../firebase-config';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  getAdditionalUserInfo
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { saveNewUser, getUserById } from '../../utils/serverConnector';
import Image from 'next/image';
import logo from '../../public/logo.png';
import Link from 'next/link';
import { emailValidator, passwordValidator } from '../../utils/validators';
import UserSession from '../../utils/userSession';
import Spinner from '../../components/spinner';

function HookForm() {
  const defaultValues = {
    email: '',
    password: ''
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
    await signInWithEmail(data.email, data.password);
    reset();
    setLoading(false);
  };

  const router = useRouter();

  const getFormErrorMessage = name => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };

  const getProgressSpinner = () => {
    return loading && <Spinner />;
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const auth = getAuth(app);
      const googleProvider = new GoogleAuthProvider();
      const credentials = await signInWithPopup(auth, googleProvider);
      const isNewUser = await getAdditionalUserInfo(credentials).isNewUser;
      if (isNewUser) {
        await saveNewUser({
          firebase_uid: credentials.user.uid,
          email: credentials.user.email,
          name: credentials.user.displayName
        });
      }
      const userInformation = await getUserById(credentials.user.uid);
      UserSession.setUser(userInformation);
      router.push('/instructions');
    } catch (error) {
      console.log('Error sign in');
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al intentar ingresar',
        life: 3000
      });
    }
    setLoading(false);
  };

  const signInWithEmail = async (email, password) => {
    try {
      const auth = getAuth(app);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const userInformation = await getUserById(user.uid);
      UserSession.setUser(userInformation);
      router.push('/instructions');
    } catch (error) {
      console.log('Error sign in');
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al intentar ingresar',
        life: 3000
      });
    }
  };

  return (
    <div>
      <Toast ref={toast} />
      {getProgressSpinner()}
      <div className="card">
        <div className="h-screen flex justify-content-center align-content-center flex-wrap">
          <div className="inline-flex flex-wrap flex-column surface-card border-round shadow-2 py-6 px-8">
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
                        feedback={false}
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
                <Button className="p-2" type="submit" label="Ingresar" />
              </div>
              <div className="mb-5">
                <Link href="/reset">Olvidé mi contraseña</Link>
              </div>
              <div className="mb-5">
                <hr></hr>
              </div>

              <div className="mb-5">
                <Button
                  className="p-2 bg-white text-color"
                  icon="pi pi-google"
                  label="Continuar con Google"
                  onClick={signInWithGoogle}
                />
              </div>
              <div className="mb-5">
                No tenes cuenta?{' '}
                <Link href="/register">Hace click aquí para registrarte</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HookForm;
