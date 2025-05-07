import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { ClassProvider } from "../contexts/ClassContext";
import { LessonsProvider } from "../contexts/LessonContext";
import { StudentsProvider } from "../contexts/StudentsContext";
import { TeachersProvider } from "../contexts/TeachersContext";
import { ProfessorDashboardProvider } from "../contexts/ProfessorDashboardContext";

const Authmiddleware = ({ children }) => {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return <div>Carregando...</div>; // Exibir um spinner ou mensagem de carregamento
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
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

export default Authmiddleware;
