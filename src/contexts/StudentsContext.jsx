import React, { createContext, useContext, useEffect, useState } from "react";
import useFetchStudents from "../hooks/useFetchStudents";

const StudentsContext = createContext();

export const useStudentsContext = () => {
  const context = useContext(StudentsContext);
  if (!context) {
    throw new Error(
      "useStudentsContext deve ser usado dentro de um StudentsProvider"
    );
  }
  return context;
};

export const StudentsProvider = ({ children }) => {
  const { students, loading, error, fetchStudents } = useFetchStudents();
  const [filteredStudents, setFilteredStudents] = useState([]);

  useEffect(() => {
    setFilteredStudents(students);
  }, [students]);

  const value = {
    students,
    filteredStudents,
    setFilteredStudents,
    loading,
    error,
    refetchStudents: fetchStudents,
  };

  return (
    <StudentsContext.Provider value={value}>
      {children}
    </StudentsContext.Provider>
  );
};
