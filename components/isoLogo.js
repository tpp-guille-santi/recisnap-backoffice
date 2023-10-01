'use client';
import Image from 'next/image';
import logo from '../public/logo.svg';

function ISOLogo() {
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
}

export default ISOLogo;
