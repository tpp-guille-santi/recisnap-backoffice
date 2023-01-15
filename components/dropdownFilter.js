"use client";
import React, { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Card } from "primereact/card";
import data from "../config/argentina.json";


const DropdownFilter = (props) => {
  const [material, setMaterial] = useState(props.defaultMaterial);
  const [province, setProvince] = useState();
  const [departmentList, setDepartmentList] = useState([]);
  const [deparment, setDepartment] = useState();
  const [municipiosList, setmunicipiosList] = useState([]);
  const [municipio, setMunicipio] = useState();
  const [departmentDisabled, setDepartmentDisabled] = useState(true);
  const [municipioDisabled, setMunicipioDisabled] = useState(true);


  useEffect(() => {
    if (props.preloaded) {
      setMaterial(props.materials.find(val => val.name === props.instruction.material_name));
      const _provincia = data.provincias.find(provincia => provincia.nombre === props.instruction.provincia)
      const _departamento = _provincia.departamentos.find(departamento => departamento.nombre === props.instruction.departamento)
      const _municipio = _departamento.municipios.find(municipio => municipio.nombre === props.instruction.municipio)
      setProvince(_provincia);
      setDepartment(_departamento);
      setMunicipio(_municipio);
      setDepartmentList([_departamento])
      setmunicipiosList([_municipio])
    }
  }, []);




  const materialSelected = (material) => {
    setMaterial(material);
    props.material(material);
  };

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
        optionLabel="name"
        value={material}
        options={props.materials}
        placeholder="Seleccione un material"
        onChange={(e) => materialSelected(e.value)}
        required
        autoFocus
        disabled={props.preloaded}
      ></Dropdown>
      <Dropdown
        style={{ margin: "5px 5px 5px 5px" }}
        optionLabel="nombre"
        value={province}
        options={data.provincias}
        placeholder="Seleccione una provincia"
        onChange={(e) => provinceSelected(e.value)}
        disabled={props.preloaded}
      ></Dropdown>
      <Dropdown
        style={{ margin: "5px 5px 5px 5px" }}
        optionLabel="nombre"
        value={deparment}
        options={departmentList ? departmentList : [deparment]}
        placeholder="Seleccione un departamento"
        onChange={(e) => departmentSelected(e.value)}
        disabled={props.preloaded || departmentDisabled}
      ></Dropdown>
      <Dropdown
        style={{ margin: "5px 5px 5px 5px" }}
        optionLabel="nombre"
        value={municipio}
        options={municipiosList ? municipiosList : [municipio]}
        placeholder="Seleccione un municipio"
        emptyMessage="El departamento no posee municipios"
        onChange={(e) => municipioSelected(e.value)}
        disabled={props.preloaded || municipioDisabled}
      ></Dropdown>
    </Card>
  );
};

export default DropdownFilter;
