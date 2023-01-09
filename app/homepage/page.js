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
        provincia={nullFunction}
        departamento={nullFunction}
        municipio={nullFunction}
      ></DropdownFilter>
    </div>
  );
};

export default Homepage;
