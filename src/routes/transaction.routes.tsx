import { Route } from 'react-router-dom';
import Dashboard from '../features/dashboard/Dashboard';
import Profile from '../features/dashboard/Profile';
import Transactions from '../features/dashboard/Transactions';

export const TransactionRoutes = () => {
  return (
    <>
      <Route index element={<Dashboard />} />
      <Route path='profile' element={<Profile />} />
      <Route path='transactions' element={<Transactions />} />
    </>
  );
};
