import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { ClassProvider } from "../contexts/ClassContext";
import { LessonsProvider } from "../contexts/LessonContext";
import { StudentsProvider } from "../contexts/StudentsContext";
import { TeachersProvider } from "../contexts/TeachersContext";
import { ProfessorDashboardProvider } from "../contexts/ProfessorDashboardContext";
import PropTypes from "prop-types";

const Authmiddleware = ({ children }) => {
  const { isAuthenticated, loading, userDetails } = useAuthContext();

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

  // Se userDetails existe e o role é aluno, redirecionar
  if (userDetails && userDetails.role === "aluno") {
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
