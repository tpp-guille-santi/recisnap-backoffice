'use client';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../public/logo.png';
import ProfileDropdown from '../components/profileDropdown';
import UserSession from '../utils/userSession';
import { usePathname } from 'next/navigation';

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

const Navbar = () => {
  const pathname = usePathname();
  const instructionsColor =
    pathname === '/instructions' ? '' : 'text-color-secondary';
  const usersColor = pathname === '/users' ? '' : 'text-color-secondary';
  return (
    <div className="flex justify-content-between align-items-center px-4 mb-4">
      {isologo()}
      <nav className="flex justify-content-center align-items-center">
        <i className="pi pi-book"></i>
        <Link
          style={{ textDecoration: 'none' }}
          className={`text-bold ${instructionsColor}`}
          href="/instructions"
        >
          Instrucciones
        </Link>
        {UserSession.canViewUsers() && (
          <div>
            <i className="pi pi-users ml-4"></i>
            <Link
              style={{ textDecoration: 'none' }}
              className={`text-bold ${usersColor}`}
              href="/users"
            >
              Usuarios
            </Link>
          </div>
        )}
      </nav>
      <ProfileDropdown></ProfileDropdown>
    </div>
  );
};

export default Navbar;
