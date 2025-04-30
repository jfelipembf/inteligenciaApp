import React, { createContext, useContext, useState, useEffect } from "react";
import useFetchLessons from "../hooks/useFetchLessons";

const LessonsContext = createContext();

export const useLessonsContext = () => {
  const context = useContext(LessonsContext);
  if (!context) {
    throw new Error(
      "useLessonsContext deve ser usado dentro de um LessonsProvider"
    );
  }
  return context;
};

export const LessonsProvider = ({ children }) => {
  const [selectedClassId, setSelectedClassId] = useState(null);
  const { lessons, loading, error } = useFetchLessons(selectedClassId);

  const value = {
    lessons,
    loading,
    error,
    selectedClassId,
    setSelectedClassId,
  };

  return (
    <LessonsContext.Provider value={value}>{children}</LessonsContext.Provider>
  );
};
