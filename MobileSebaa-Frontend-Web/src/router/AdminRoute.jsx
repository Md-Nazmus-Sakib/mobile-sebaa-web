/* eslint-disable react/prop-types */

import { Navigate, useLocation } from "react-router-dom";

import useAdmin from "../Hooks/useAdmin";
import { getUserFromToken } from "../Hooks/jwtDecode";

const AdminRoute = ({ children }) => {
  const user = getUserFromToken();
  const location = useLocation();
  const [isAdmin, isAdminLoading] = useAdmin();
  if (isAdminLoading) {
    return <progress className="progress w-56"></progress>;
  }
  if (user && isAdmin) {
    return children;
  }

  return <Navigate to="/" state={{ from: location }} replace></Navigate>;
};

export default AdminRoute;
