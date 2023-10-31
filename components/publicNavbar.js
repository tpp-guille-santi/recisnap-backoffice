import RouterButton from './routerButton';
import ISOLogo from './isoLogo';

const PublicNavbar = () => {
  return (
    <div className='flex justify-content-between align-items-center px-4 mb-4'>
      <ISOLogo />
      <div className='flex align-items-center justify-content-center flex-wrap p-0 m-0'>
        <RouterButton route={'/login'} label={'Ingresar'}></RouterButton>
        <RouterButton primary={true} route={'/register'} label={'Registrarme'}></RouterButton>
      </div>
    </div>
  );
};

export default PublicNavbar;
