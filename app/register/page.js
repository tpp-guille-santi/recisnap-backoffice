"use client";
import React, { useEffect, useRef, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { InputText } from "primereact/inputtext";

const RegisterPage = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [passwordRepeat, setPasswordRepeat] = useState();

  return (
    <div>
      <Card>
        <div>
          <InputText
            value={name}
            onChange={(e) => {
              (e) => setName(e.target.value);
            }}
            placeholder="Nombre y Apellido"
          />
          <InputText
            value={email}
            onChange={(e) => {
              (e) => setEmail(e.target.value);
            }}
            placeholder="Email"
          />
          <Password
            value={password}
            onChange={(e) => {
              (e) => setPassword(e.target.value);
            }}
            placeholder="Contraseña"
          />
          <Password
            value={passwordRepeat}
            onChange={(e) => setPasswordRepeat(e.target.value)}
            placeholder="Repetir Contraseña"
          />
        </div>
        <div>
          <Button label="Registrarse" onClick={() => {}} />
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
