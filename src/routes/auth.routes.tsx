import { Route } from 'react-router-dom';
import Login from '../features/auth/Login';

export const AuthRoutes = () => {
  return (
    <>
      <Route path='/' element={<Login />} />
      <Route path='/login' element={<Login />} />
    </>
  );
};
