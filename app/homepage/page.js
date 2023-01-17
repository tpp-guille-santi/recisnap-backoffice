"use client";
import React from "react";
import DropdownFilter from "../../components/dropdownFilter";

const Homepage = () => {
  const nullFunction = (argument) => {
    return;
  };

  return (
    <div>
      <div>Homepage</div>
      <DropdownFilter
        material={nullFunction} // para esto hay que agregar el el useMaterials y después los hooks useEffect y useState para obtenerlos del back
        provincia={nullFunction}
        departamento={nullFunction}
        municipio={nullFunction}
      ></DropdownFilter>
    </div>
  );
};

export default Homepage;
