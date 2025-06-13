import React, { createContext, useContext, useMemo } from "react";
import { useStudentsContext } from "./StudentsContext";
import { useClassContext } from "./ClassContext";
import useFetchUsers from "../hooks/useFetchUsers";

const CoordinatorContext = createContext();

export const useCoordinatorContext = () => {
  const context = useContext(CoordinatorContext);
  if (!context) {
    throw new Error(
      "useCoordinatorContext deve ser usado dentro de um CoordinatorProvider"
    );
  }
  return context;
};

export const CoordinatorDashboardProvider = ({ children }) => {
  const { students, loading: loadingStudents } = useStudentsContext();
  const { classes, loading: loadingClasses } = useClassContext();
  const { users, loading: loadingUsers } = useFetchUsers();

  const teachers = useMemo(
    () => users.filter((user) => user.role === "professor"),
    [users]
  );

  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const totalClasses = classes.length;

  const averageGrade = useMemo(
    () =>
      students.reduce((acc, student) => acc + (student.average || 0), 0) /
      (totalStudents || 1),
    [students, totalStudents]
  );

  const approvedStudents = students.filter(
    (student) => (student.average || 0) >= 7
  ).length;
  const approvalRate = (approvedStudents / (totalStudents || 1)) * 100;

  const getStudentsByClass = (classId) =>
    students.filter((student) => student.class === classId);

  const topStudents = useMemo(
    () =>
      [...students]
        .sort((a, b) => (b.average || 0) - (a.average || 0))
        .slice(0, 5),
    [students]
  );

  const topTeachers = useMemo(() => teachers.slice(0, 5), [teachers]);

  const loading = loadingStudents || loadingClasses || loadingUsers;

  const value = {
    students,
    classes,
    teachers,
    users,
    loading,
    totalStudents,
    totalTeachers,
    totalClasses,
    averageGrade,
    approvalRate,
    getStudentsByClass,
    topStudents,
    topTeachers,
  };

  return (
    <CoordinatorContext.Provider value={value}>
      {children}
    </CoordinatorContext.Provider>
  );
};
