'use client';
import React from 'react';
import DropdownFilter from '../../components/dropdownFilter';
import UserSession from '../../utils/userSession';

const Homepage = () => {
  const nullFunction = argument => {
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
      <div>
        The name is: '{UserSession.getUser().name}' and my email is '
        {UserSession.getUser().email}'
      </div>
      <div>{JSON.stringify(UserSession.getUser())}</div>
    </div>
  );
};

export default Homepage;
