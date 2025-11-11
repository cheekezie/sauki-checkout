import { Route } from "react-router-dom";
import Login from "../pages/auth/Login";

export const AuthRoutes = () => {
  return (
    <>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
    </>
  );
};
