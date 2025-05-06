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
  // Chamar o hook diretamente no nível superior
  const { teacherClassCount, loading, error } = useProfessorDashboard();

  // Armazenar os dados em cache para evitar chamadas repetidas
  const [cachedData, setCachedData] = useState(null);

  useEffect(() => {
    if (!loading && !error && teacherClassCount !== undefined) {
      setCachedData({ teacherClassCount });
    }
  }, [teacherClassCount, loading, error]);

  const value = {
    teacherClassCount: cachedData?.teacherClassCount || 0,
    loading,
    error,
  };

  return (
    <ProfessorDashboardContext.Provider value={value}>
      {children}
    </ProfessorDashboardContext.Provider>
  );
};
