import { Route } from "react-router-dom";
import Dashboard from "../pages/dashboard/Dashboard";
import Profile from "../pages/dashboard/Profile";
import Transactions from "../pages/dashboard/Transactions";

export const TransactionRoutes = () => {
  return (
    <>
      <Route index element={<Dashboard />} />
      <Route path="profile" element={<Profile />} />
      <Route path="transactions" element={<Transactions />} />
    </>
  );
};
