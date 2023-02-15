'use client';
import { useRef } from 'react';
import UserSession from '../utils/userSession';
import { app } from '../app/firebase-config';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { OverlayPanel } from 'primereact/overlaypanel';
import Image from 'next/image';
import { Button } from 'primereact/button';

const ProfileDropdown = () => {
  const router = useRouter();

  const logout = async () => {
    try {
      const auth = getAuth(app);
      await signOut(auth);
      UserSession.signOut();
    } catch (error) {
      console.log(error);
    }
    router.push('/login');
  };

  const imageUrl = `https://api.dicebear.com/5.x/fun-emoji/svg?seed=${
    UserSession.getUser().firebaseUid
  }.svg`;

  const namePlusIcon = () => {
    return (
      <div className="flex flex-row align-items-center justify-content-center flex-wrap gap-3">
        <div className="flex align-items-center justify-content-center">
          <Image src={imageUrl} alt="Profile Picture" width={30} height={30} />
        </div>
        <h4 className="flex align-items-center justify-content-center text-color">
          {UserSession.getUser().name}
        </h4>
      </div>
    );
  };
  const op = useRef(null);

  return (
    <div>
      <Button
        label={namePlusIcon()}
        className="p-button-text p-0 m-0"
        onClick={e => op.current.toggle(e)}
      />
      <OverlayPanel ref={op}>
        <div className="flex flex-column align-content-center justify-content-center">
          <div className="flex align-items-center justify-content-center">
            <Image
              src={imageUrl}
              alt="Profile Picture"
              width={50}
              height={50}
            />
          </div>
          <div className="flex align-items-center justify-content-center">
            <h4>{UserSession.getUser().name}</h4>
          </div>
          <div className="flex align-items-center justify-content-center">
            <h4>{UserSession.getUser().email}</h4>
          </div>
          <div className="flex align-items-center justify-content-center">
            <Button
              className="p-button-danger p-button-outlined w-full"
              icon="pi pi-sign-out"
              label="Cerrar Sesión"
              onClick={logout}
            />
          </div>
        </div>
      </OverlayPanel>
    </div>
  );
};

export default ProfileDropdown;