"use client";
import React, { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import data from "../../config/argentina.json";

const Homepage = () => {
  const [province, setProvince] = useState(data.provincias[0]);

  const printInfo = () => {
    console.log(data);
  };

  return (
    <div>
      <div>Homepage</div>
      <Dropdown
        optionLabel="nombre"
        value={province}
        options={data.provincias}
        placeholder="Select a City"
        onChange={(e) => setProvince(e.value)}
      ></Dropdown>
    </div>
  );
};

export default Homepage;
