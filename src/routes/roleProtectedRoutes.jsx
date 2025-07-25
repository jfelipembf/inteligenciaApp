import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

const RoleProtectedRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, loading, userDetails } = useAuthContext();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!userDetails.personalInfo.cpf && location.pathname !== "/create") {
    return <Navigate to="/create" />;
  }

  if (userDetails.role === "aluno") {
    return <Navigate to="/unauthorized" />;
  }

  if (!allowedRoles.includes(userDetails?.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default RoleProtectedRoute;
