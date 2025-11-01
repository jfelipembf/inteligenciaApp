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

  // Verificar se tem CPF cadastrado (se necessário)
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
