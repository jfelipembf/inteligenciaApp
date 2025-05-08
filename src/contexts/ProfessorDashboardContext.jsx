import React, { createContext, useContext, useState, useEffect } from "react";
import useProfessorDashboard from "../hooks/useProfessorDashboard";

const ProfessorDashboardContext = createContext();

export const useProfessorDashboardContext = () => {
  const context = useContext(ProfessorDashboardContext);
  if (!context) {
    throw new Error(
      "useProfessorDashboardContext deve ser usado dentro de um ProfessorDashboardProvider"
    );
  }
  return context;
};

export const ProfessorDashboardProvider = ({ children }) => {
  const {
    teacherClassCount,
    studentsLength,
    overallAverage,
    classAverages,
    studentAverages,
    teacherClasses,
    unitAverages,
    loading,
    error,
  } = useProfessorDashboard();

  const value = {
    teacherClassCount: teacherClassCount || 0,
    studentsLength: studentsLength || 0,
    overallAverage,
    classAverages,
    studentAverages,
    teacherClasses,
    unitAverages,
    loading,
    error,
  };

  return (
    <ProfessorDashboardContext.Provider value={value}>
      {children}
    </ProfessorDashboardContext.Provider>
  );
};
