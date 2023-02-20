'use client';
import React, { useEffect, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import data from '../config/argentina.json';

const DropdownFilter = props => {
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
      setMaterial(
        props.materials.find(
          val => val.name === props.instruction.material_name
        )
      );
      const _provincia = data.provincias.find(
        provincia => provincia.nombre === props.instruction.provincia
      );
      const _departamento = _provincia.departamentos.find(
        departamento => departamento.nombre === props.instruction.departamento
      );
      const _municipio = _departamento.municipios.find(
        municipio => municipio.nombre === props.instruction.municipio
      );
      setProvince(_provincia);
      setDepartment(_departamento);
      setMunicipio(_municipio);
      setDepartmentList([_departamento]);
      setmunicipiosList([_municipio]);
    }
  }, []);

  const materialSelected = material => {
    setMaterial(material);
    props.material(material);
  };

  const provinceSelected = province => {
    setProvince(province);
    setMunicipio(null);
    setDepartmentList(province.departamentos);
    setDepartmentDisabled(false);
    setMunicipioDisabled(true);
    props.provincia(province);
  };

  const departmentSelected = department => {
    setDepartment(department);
    setmunicipiosList(department.municipios);
    setMunicipioDisabled(false);
    props.departamento(department);
  };

  const municipioSelected = municipio => {
    setMunicipio(municipio);
    props.municipio(municipio);
  };

  return (
    <div className="formgrid grid">
      <div className="field col-12 md:col-6">
        <label
          htmlFor="dropdownMaterial"
          className="flex flex-1 align-items-center justify-content-start"
        >
          Material:
        </label>
        <Dropdown
          inputId="dropdownMaterial"
          className="flex flex-1 align-items-center justify-content-center"
          optionLabel="name"
          value={material}
          options={props.materials}
          placeholder="Seleccione un material"
          onChange={e => materialSelected(e.value)}
          required
          autoFocus
          disabled={props.preloaded}
        ></Dropdown>
      </div>
      <div className="field col-12 md:col-6">
        <label
          htmlFor="dropdownProvincia"
          className="flex flex-1 align-items-center justify-content-start"
        >
          Provincia:
        </label>
        <Dropdown
          inputId="dropdownProvincia"
          className="flex flex-1 align-items-center justify-content-center"
          optionLabel="nombre"
          value={province}
          options={data.provincias}
          placeholder="Seleccione una provincia"
          onChange={e => provinceSelected(e.value)}
          disabled={props.preloaded}
        ></Dropdown>
      </div>
      <div className="field col-12 md:col-6">
        <label
          htmlFor="dropdownDepartamento"
          className="flex flex-1 align-items-center justify-content-start"
        >
          Departamento:
        </label>
        <Dropdown
          inputId="dropdownDepartamento"
          className="flex flex-1 align-items-center justify-content-center"
          optionLabel="nombre"
          value={deparment}
          options={departmentList ? departmentList : [deparment]}
          placeholder="Seleccione un departamento"
          onChange={e => departmentSelected(e.value)}
          disabled={props.preloaded || departmentDisabled}
        ></Dropdown>
      </div>
      <div className="field col-12 md:col-6">
        <label
          htmlFor="dropdownMunicipio"
          className="flex flex-1 align-items-center justify-content-start"
        >
          Municipio:
        </label>
        <Dropdown
          inputId="dropdownMunicipio"
          className="flex flex-1 align-items-center justify-content-center"
          optionLabel="nombre"
          value={municipio}
          options={municipiosList ? municipiosList : [municipio]}
          placeholder="Seleccione un municipio"
          emptyMessage="El departamento no posee municipios"
          onChange={e => municipioSelected(e.value)}
          disabled={props.preloaded || municipioDisabled}
        ></Dropdown>
      </div>
    </div>
  );
};

export default DropdownFilter;
