'use client';
import { redirect } from 'next/navigation';
import { isLoggedIn } from '../utils/userSession';

const PrivateRoute = ({ children }) => {
  if (!isLoggedIn()) {
    redirect('/login');
  }
  return <section>{children}</section>;
};

export default PrivateRoute;
