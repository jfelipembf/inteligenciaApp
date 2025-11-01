import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/auth/auth.jsx";
import { ClassProvider } from "../contexts/ClassContext";
import { LessonsProvider } from "../contexts/LessonContext";
import { StudentsProvider } from "../contexts/StudentsContext";
import { TeachersProvider } from "../contexts/TeachersContext";
import { ProfessorDashboardProvider } from "../contexts/ProfessorDashboardContext";
import PropTypes from "prop-types";

const Authmiddleware = ({ children }) => {
  const { isAuthenticated, loading, user, currentSchool } = useAuth();

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Se usuário existe e o role é aluno, redirecionar
  const currentRole = currentSchool?.role;
  if (currentRole === "aluno") {
    return <Navigate to="/unauthorized" />;
  }

  return (
    <ClassProvider>
      <TeachersProvider>
        <LessonsProvider>
          <StudentsProvider>
            <ProfessorDashboardProvider>
              {children || <Outlet />}
            </ProfessorDashboardProvider>
          </StudentsProvider>
        </LessonsProvider>
      </TeachersProvider>
    </ClassProvider>
  );
};

// PropTypes para validação
Authmiddleware.propTypes = {
  children: PropTypes.node,
};

export default Authmiddleware;
