import React from "react";
import { Outlet } from "react-router-dom";
import { ClassProvider } from "../contexts/ClassContext";
import { LessonsProvider } from "../contexts/LessonContext";
import { StudentsProvider } from "../contexts/StudentsContext";
import { TeachersProvider } from "../contexts/TeachersContext";
import { ProfessorDashboardProvider } from "../contexts/ProfessorDashboardContext";

const ProtectedRoutesWrapper = () => {
  return (
    <ClassProvider>
      <TeachersProvider>
        <LessonsProvider>
          <StudentsProvider>
            <ProfessorDashboardProvider>
              <Outlet />
            </ProfessorDashboardProvider>
          </StudentsProvider>
        </LessonsProvider>
      </TeachersProvider>
    </ClassProvider>
  );
};

export default ProtectedRoutesWrapper;
