import React, { createContext, useContext } from "react";
import { useFetchClasses } from "../hooks/useFetchClasses";
import { useAuthContext } from "./AuthContext";
import { useLocation } from "react-router-dom";

const ClassContext = createContext();

export const useClassContext = () => {
  const context = useContext(ClassContext);
  if (!context) {
    throw new Error(
      "useClassContext deve ser usado dentro de um ClassProvider"
    );
  }
  return context;
};

export const ClassProvider = ({ children }) => {
  const { userDetails, loading: authLoading } = useAuthContext();
  const location = useLocation();
  const schoolId = userDetails?.schoolId;

  // Ignorar o ClassProvider em páginas específicas
  const excludedRoutes = ["/login", "/register", "/forgot-password"];
  if (excludedRoutes.includes(location.pathname)) {
    return <>{children}</>;
  }

  // Se o usuário não está autenticado ou o schoolId não está disponível
  if (authLoading || !schoolId) {
    const value = {
      classes: [],
      loading: authLoading,
      error: null,
      refetchClasses: () => {}, // Função vazia para evitar erros
    };

    return (
      <ClassContext.Provider value={value}>{children}</ClassContext.Provider>
    );
  }

  // Inicializar o hook useFetchClasses somente quando o schoolId estiver disponível
  const {
    classes,
    loading: classesLoading,
    error,
    refetch: refetchClasses,
  } = useFetchClasses({
    skipInitialFetch: false,
  });

  const value = {
    classes,
    loading: classesLoading,
    error,
    refetchClasses,
  };

  return (
    <ClassContext.Provider value={value}>{children}</ClassContext.Provider>
  );
};
