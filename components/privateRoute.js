'use client';
import UserSession from '../utils/userSession';
import { redirect } from 'next/navigation';

const PrivateRoute = ({ children }) => {
  const isLoggedIn = UserSession.isLoggedIn();
  if (!isLoggedIn) {
    redirect('/login');
  }
  return <section>{children}</section>;
};

export default PrivateRoute;
