import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/auth/auth.jsx";
import PropTypes from "prop-types";

const RoleProtectedRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, loading, user, currentSchool } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const currentRole = currentSchool?.role;
  const userRole = user?.role;

  if (
    user?.personalInfo &&
    !user.personalInfo.cpf &&
    location.pathname !== "/profile"
  ) {
    return <Navigate to="/profile" />;
  }

  if (currentRole === "aluno") {
    return <Navigate to="/unauthorized" />;
  }

  if (
    (allowedRoles.includes("ceo") || allowedRoles.includes("master")) &&
    !currentRole &&
    (userRole === "ceo" || userRole === "master") &&
    (location.pathname === "/schools/create" ||
      location.pathname === "/schools" ||
      location.pathname.startsWith("/schools/"))
  ) {
    return children;
  }

  // Verificação normal: se tem role e está permitido
  if (currentRole && allowedRoles.includes(currentRole)) {
    return children;
  }

  // Verificação para CEO/Master com escola (usando userRole como fallback)
  if (
    (userRole === "ceo" || userRole === "master") &&
    allowedRoles.includes(userRole)
  ) {
    return children;
  }

  if (!currentRole || !allowedRoles.includes(currentRole)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

RoleProtectedRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.node.isRequired,
};

export default RoleProtectedRoute;
