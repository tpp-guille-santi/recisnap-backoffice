'use client';
import React, { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { app } from '../firebase-config';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logo from '../../public/logo.png';
import Link from 'next/link';
import { emailValidator } from '../../utils/validators';
import Spinner from '../../components/spinner';

function HookForm() {
  const defaultValues = {
    email: ''
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
    await sendResetPasswordEmail(data.email);
    setLoading(false);
    reset();
  };

  const router = useRouter();

  const sendResetPasswordEmail = async email => {
    try {
      const auth = getAuth(app);
      await sendPasswordResetEmail(auth, email);
      router.push('/');
    } catch (e) {
      console.log(e)
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al intentar enviar el email',
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
                <Link href="/login">
                  Por favor, ingrese su email abajo y haga click en el botón
                </Link>
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
                <Button
                  className="p-2"
                  type="submit"
                  label="Resetear Contraseña"
                />
              </div>
              <div className="mb-5">
                <Link href="/login">
                  Hace click aquí para volver a ingresar
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HookForm;
