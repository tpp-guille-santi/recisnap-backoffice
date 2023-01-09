"use client";
import React, { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Card } from "primereact/card";
import data from "../config/argentina.json";

const DropdownFilter = (props) => {
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
    props.provincia(province);
  };

  const departmentSelected = (department) => {
    setDepartment(department);
    setmunicipiosList(department.municipios);
    setMunicipioDisabled(false);
    props.departamento(department);
  };

  const municipioSelected = (municipio) => {
    setMunicipio(municipio);
    props.municipio(municipio);
  };

  return (
    <Card>
      <Dropdown
        style={{ margin: "5px 5px 5px 5px" }}
        optionLabel="nombre"
        value={province}
        options={data.provincias}
        placeholder="Seleccione una provincia"
        onChange={(e) => provinceSelected(e.value)}
      ></Dropdown>
      <Dropdown
        style={{ margin: "5px 5px 5px 5px" }}
        optionLabel="nombre"
        value={deparment}
        options={departmentList}
        placeholder="Seleccione un departamento"
        onChange={(e) => departmentSelected(e.value)}
        disabled={departmentDisabled}
      ></Dropdown>
      <Dropdown
        style={{ margin: "5px 5px 5px 5px" }}
        optionLabel="nombre"
        value={municipio}
        options={municipiosList}
        placeholder="Seleccione un municipio"
        emptyMessage="El departamento no posee municipios"
        onChange={(e) => municipioSelected(e.value)}
        disabled={municipioDisabled}
      ></Dropdown>
    </Card>
  );
};

export default DropdownFilter;
