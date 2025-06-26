import React, { createContext, useContext, useEffect, useState } from "react";
import useFetchTeachers from "../hooks/useFetchTeachers";

const TeachersContext = createContext();

export const useTeachersContext = () => {
  const context = useContext(TeachersContext);
  if (!context) {
    throw new Error(
      "useTeachersContext deve ser usado dentro de um TeachersProvider"
    );
  }
  return context;
};

export const TeachersProvider = ({ children }) => {
  const { teachers, loading, error, refetch } = useFetchTeachers();
  const [filteredTeachers, setFilteredTeachers] = useState([]);

  useEffect(() => {
    setFilteredTeachers(teachers);
  }, [teachers]);

  const value = {
    teachers,
    filteredTeachers,
    setFilteredTeachers,
    loading,
    error,
    refetchTeachers: refetch,
  };

  return (
    <TeachersContext.Provider value={value}>
      {children}
    </TeachersContext.Provider>
  );
};
