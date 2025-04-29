import React, { createContext, useContext } from "react";
import { useFetchClasses } from "../hooks/useFetchClasses";

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
  const {
    classes,
    loading,
    error,
    refetch: refetchClasses,
  } = useFetchClasses();

  const value = {
    classes,
    loading,
    error,
    refetchClasses,
  };

  return (
    <ClassContext.Provider value={value}>{children}</ClassContext.Provider>
  );
};
