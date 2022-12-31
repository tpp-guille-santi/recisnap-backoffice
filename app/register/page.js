"use client";
import React, { useEffect, useRef, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { InputText } from "primereact/inputtext";
import { app } from "../firebase-config";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [passwordRepeat, setPasswordRepeat] = useState();

  const auth = getAuth(app);
  const router = useRouter();

  const saveUser = () => {
    console.log("Saving user");
    if (password !== passwordRepeat) {
      console.log("Passwords dont match");
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        console.log("Signed In!");
        const user = userCredential.user;
        router.push("/homepage");
      })
      .catch((error) => {
        console.log("Error sign in");
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  return (
    <div>
      <Card>
        <div>
          <InputText
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre y Apellido"
          />
          <InputText
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
          />
          <Password
            value={passwordRepeat}
            onChange={(e) => setPasswordRepeat(e.target.value)}
            placeholder="Repetir Contraseña"
          />
        </div>
        <div>
          <Button label="Registrarse" onClick={saveUser} />
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
