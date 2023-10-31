import Link from 'next/link';
import ProfileDropdown from '../components/profileDropdown';
import { usePathname } from 'next/navigation';
import { canViewUsers } from '../utils/userSession';
import ISOLogo from './isoLogo';

const Navbar = () => {
  const pathname = usePathname();
  const instructionsColor =
    pathname === '/instructions' ? '' : 'text-color-secondary';
  const usersColor = pathname === '/users' ? '' : 'text-color-secondary';
  return (
    <div className="flex justify-content-between align-items-center px-4 mb-4">
      <ISOLogo />
      <nav className="flex justify-content-center align-items-center">
        <i className="pi pi-book"></i>
        <Link
          style={{ textDecoration: 'none' }}
          className={`text-bold ${instructionsColor}`}
          href="/instructions"
        >
          Instrucciones
        </Link>
        {canViewUsers() && (
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
