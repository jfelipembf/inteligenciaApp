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

  return (
    <ClassProvider>
      <TeachersProvider>
        <LessonsProvider>
          <StudentsProvider>{children || <Outlet />}</StudentsProvider>
        </LessonsProvider>
      </TeachersProvider>
    </ClassProvider>
  );
};

export default Authmiddleware;
