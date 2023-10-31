'use client';
import {useRef} from 'react';
import {useRouter} from 'next/navigation';
import {OverlayPanel} from 'primereact/overlaypanel';
import Image from 'next/image';
import {Button} from 'primereact/button';
import {getUserEmail, getUserFirebaseUid, getUserName, logout} from '../utils/userSession';

const ProfileDropdown = () => {
  const router = useRouter();

  const signOut = async () => {
    logout();
    router.push('/login');
  };

  const imageUrl = `https://api.dicebear.com/5.x/fun-emoji/svg?seed=${getUserFirebaseUid()}.svg`;

  const namePlusIcon = () => {
    return (
      <div className='flex flex-row align-items-center justify-content-center flex-wrap gap-3'>
        <div className='flex align-items-center justify-content-center'>
          <Image src={imageUrl} alt='Profile Picture' width={30} height={30} />
        </div>
        <h4 className='flex align-items-center justify-content-center text-color'>
          {getUserName()}
        </h4>
      </div>
    );
  };
  const op = useRef(null);

  return (
    <div>
      <Button
        label={namePlusIcon()}
        className='p-0 m-0'
        text
        onClick={(e) => op.current.toggle(e)}
      />
      <OverlayPanel ref={op}>
        <div className='flex flex-column align-content-center justify-content-center'>
          <div className='flex align-items-center justify-content-center m-2'>
            <Image src={imageUrl} alt='Profile Picture' width={50} height={50} />
          </div>
          <h4 className='flex align-items-center justify-content-center m-2'>{getUserName()}</h4>
          <h4 className='flex align-items-center justify-content-center m-2'>{getUserEmail()}</h4>
          <Button
            className='flex align-items-center justify-content-center m-2 mt-4'
            severity='danger'
            outlined
            icon='pi pi-sign-out'
            label='Cerrar Sesión'
            onClick={signOut}
          />
        </div>
      </OverlayPanel>
    </div>
  );
};

export default ProfileDropdown;
