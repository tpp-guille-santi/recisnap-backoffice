'use client';
import React, { useEffect, useRef, useState } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { app } from './firebase-config';

const firebaseConfig = {
  apiKey: "AIzaSyBC6Ex5oeA9ICNG8lO1bCeNnp4f0-bNjVU",
  authDomain: "recisnap.firebaseapp.com",
  projectId: "recisnap",
  storageBucket: "recisnap.appspot.com",
  messagingSenderId: "924203588296",
  appId: "1:924203588296:web:2c3351678558628b4d23fd",
  measurementId: "G-8MF8Z1RPMS"
};




const LoginPage = () => {

  const [value1, setValue1] = useState();
  const [value2, setValue2] = useState();
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();

  const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;
      const q = query(collection(db, "users"), where("uid", "==", user.uid));
      const docs = await getDocs(q);
      if (docs.docs.length === 0) {
        await addDoc(collection(db, "users"), {
          uid: user.uid,
          name: user.displayName,
          authProvider: "google",
          email: user.email,
        });
      }
    } catch (err) {
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
    }
  };

  return (
    <div>
      <h1>Login Page</h1>
      <p>This will be the login page</p>
      <div>
        <div>
          <InputText value={value1} onChange={(e) => setValue1(e.target.value)} placeholder="Email"/>
          <Password value={value2} onChange={(e) => setValue2(e.target.value)} placeholder="Contraseña" />
        </div>
        <Button label="Entrar" onClick={signInWithGoogle}/>
      </div>
    </div>
  );
}

export default LoginPage;