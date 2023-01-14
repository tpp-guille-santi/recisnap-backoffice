"use client";
import React, { useEffect, useState } from "react";

import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { app } from "../firebase-config";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "next/navigation";

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const sendResetPasswordEmail = () => {
    const auth = getAuth(app);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log("Mail enviado");
        router.push("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
        console.log(errorCode, errorMessage);
      });
  };

  return (
    <Card>
      <div>Por favor, ingrese su email abajo y haga click en el botón</div>
      <InputText
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Nombre y Apellido"
      ></InputText>
      <Button onClick={sendResetPasswordEmail}>Resetear Password</Button>
    </Card>
  );
};

export default ResetPasswordPage;
