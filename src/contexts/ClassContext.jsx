import React, { createContext, useContext } from "react";
import { useFetchClasses } from "../hooks/useFetchClasses";
import { useAuth } from "../hooks/auth/auth.jsx";
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
  const { user, currentSchoolId, loading: authLoading } = useAuth();
  const location = useLocation();
  const schoolId = currentSchoolId;

  const excludedRoutes = ["/login"];
  if (excludedRoutes.includes(location.pathname)) {
    return <>{children}</>;
  }

  if (authLoading || !schoolId) {
    const value = {
      classes: [],
      loading: authLoading,
      error: null,
      refetchClasses: () => {},
    };

    return (
      <ClassContext.Provider value={value}>{children}</ClassContext.Provider>
    );
  }

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
