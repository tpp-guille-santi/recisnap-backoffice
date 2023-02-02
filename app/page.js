'use client';
import React, { useEffect, useRef, useState } from 'react';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  getAdditionalUserInfo
} from 'firebase/auth';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { app } from './firebase-config';
import { Card } from 'primereact/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { saveNewUser, getUserById } from '../utils/serverConnector';
import UserSession from '../utils/userSession';

const LoginPage = () => {
  const [value1, setValue1] = useState();
  const [value2, setValue2] = useState();

  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();
  const router = useRouter();

  const signInWithGoogle = async () => {
    const res = await signInWithPopup(auth, googleProvider)
      .then(credentials => {
        const isNewUser = getAdditionalUserInfo(credentials).isNewUser;
        if (isNewUser) {
          //Manejar Signup
          const exit = saveNewUser({
            firebase_uid: credentials.user.uid,
            email: credentials.user.email,
            name: credentials.user.displayName
          });
        }
        //Manejar Login
        getUserById(credentials.user.uid)
          .then(userInformation => {
            UserSession.setUser(userInformation);
            router.push('/homepage');
          })
          .catch(e => {
            console.log(e);
          });
        //        router.push('/homepage');
      })
      .catch(err => {
        console.error(err);
        alert(err.message);
        /*
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      
      */
      });
  };

  const signInWithEmail = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        // Signed in
        const user = userCredential.user;
        getUserById(user.uid)
          .then(userInformation => {
            UserSession.setUser(userInformation);
            router.push('/homepage');
          })
          .catch(e => {
            console.log(e);
          });
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  return (
    <div>
      <h1>Recisnap!</h1>
      <div>
        <Card
          style={{ width: '25rem', marginBottom: '1em', borderStyle: 'double' }}
        >
          <div>
            <InputText
              value={value1}
              onChange={e => setValue1(e.target.value)}
              placeholder="Email"
            />
            <Password
              style={{ marginTop: '1em', marginBottom: '1em' }}
              value={value2}
              onChange={e => setValue2(e.target.value)}
              placeholder="Contraseña"
            />
          </div>
          <div>
            <Button
              label="Loguearse"
              onClick={() => {
                signInWithEmail(value1, value2);
              }}
            />
          </div>
          <br></br>
          <hr></hr>
          <Button
            style={{ marginTop: '1em', marginBottom: '1em' }}
            label="Entrar con Google"
            onClick={signInWithGoogle}
          />
          <div>
            <Link href="/reset">Olvidé mi contraseña</Link>
          </div>
        </Card>
      </div>
      <Card
        style={{ width: '25rem', marginBottom: '1em', borderStyle: 'double' }}
      >
        <div>
          No tenes cuenta?{' '}
          <Link href="/register">Hace click para registrarte!</Link>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
