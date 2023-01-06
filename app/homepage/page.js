"use client";
import React, { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import data from "../../config/argentina.json";

const Homepage = () => {
  const [province, setProvince] = useState();
  const [departmentList, setDepartmentList] = useState([]);
  const [deparment, setDepartment] = useState();
  const [municipiosList, setmunicipiosList] = useState([]);
  const [municipio, setMunicipio] = useState();
  const [departmentDisabled, setDepartmentDisabled] = useState(true);
  const [municipioDisabled, setMunicipioDisabled] = useState(true);

  const provinceSelected = (province) => {
    setProvince(province);
    setMunicipio(null);
    setDepartmentList(province.departamentos);
    setDepartmentDisabled(false);
    setMunicipioDisabled(true);
  };

  const departmentSelected = (department) => {
    setDepartment(department);
    setmunicipiosList(department.municipios);
    setMunicipioDisabled(false);
  };

  return (
    <div>
      <div>Homepage</div>
      <Dropdown
        optionLabel="nombre"
        value={province}
        options={data.provincias}
        placeholder="Seleccione una provincia"
        onChange={(e) => provinceSelected(e.value)}
      ></Dropdown>
      <Dropdown
        optionLabel="nombre"
        value={deparment}
        options={departmentList}
        placeholder="Seleccione un departamento"
        onChange={(e) => departmentSelected(e.value)}
        disabled={departmentDisabled}
      ></Dropdown>
      <Dropdown
        optionLabel="nombre"
        value={municipio}
        options={municipiosList}
        placeholder="Seleccione un municipio"
        emptyMessage="El departamento no posee municipios"
        onChange={(e) => setMunicipio(e.value)}
        disabled={municipioDisabled}
      ></Dropdown>
    </div>
  );
};

export default Homepage;
