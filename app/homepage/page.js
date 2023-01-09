import React from "react";
import DropdownFilter from "../../components/dropdownFilter";

const Homepage = () => {
  const nullFunction = (argument) => {
    return;
  };

  return (
    <div>
      <div>Homepage</div>
      <DropdownFilter></DropdownFilter>
    </div>
  );
};

export default Homepage;
