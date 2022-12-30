"use client";
import React, { useEffect, useRef, useState } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { app } from "../firebase-config";
import { Card } from "primereact/card";
import Link from "next/link";

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
      <h1>Recisnap!</h1>
      <div>
        <Card
          style={{ width: "25rem", marginBottom: "1em", borderStyle: "double" }}
        >
          <div>
            <InputText
              value={value1}
              onChange={(e) => setValue1(e.target.value)}
              placeholder="Email"
            />
            <Password
              value={value2}
              onChange={(e) => setValue2(e.target.value)}
              placeholder="Contraseña"
            />
          </div>
          <div>
            <Button label="Loguearse" onClick={() => {}} />
          </div>
          <br></br>
          <hr></hr>
          <Button label="Entrar con Google" onClick={signInWithGoogle} />
        </Card>
      </div>
      <Card
        style={{ width: "25rem", marginBottom: "1em", borderStyle: "double" }}
      >
        <div>
          No tenes cuenta?{" "}
          <Link href="/register">Hace click para registrarte!</Link>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
