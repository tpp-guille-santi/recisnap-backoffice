'use client';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../public/logo.svg';
import ProfileDropdown from '../components/profileDropdown';
import { usePathname } from 'next/navigation';
import { canViewUsers } from '../utils/userSession';
import RouterButton from './routerButton';
import ISOLogo from './isoLogo';

const isologo = () => {
  return (
    <div className="flex align-items-center justify-content-center flex-wrap p-0 m-0">
      <div className="flex align-items-center justify-content-center mr-1">
        <Image src={logo} alt="Recisnap logo" height={35} />
      </div>
      <div className="flex align-items-center justify-content-center">
        <h3 className="logo">Recisnap</h3>
      </div>
    </div>
  );
};

const PublicNavbar = () => {
  return (
    <div className="flex justify-content-between align-items-center px-4 mb-4">
      <ISOLogo />
      <div className="flex align-items-center justify-content-center flex-wrap p-0 m-0">
        <RouterButton route={'/login'} label={'Ingresar'}></RouterButton>
        <RouterButton
          primary={true}
          route={'/register'}
          label={'Registrarme'}
        ></RouterButton>
      </div>
    </div>
  );
};

export default PublicNavbar;
