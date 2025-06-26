import React, { createContext, useContext } from "react";
import useFetchUsersBySchool from "../hooks/useFetchUsersBySchool";

const UsersContext = createContext();

export const useUsersContext = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error(
      "useUsersContext deve ser usado dentro de um UsersProvider"
    );
  }
  return context;
};

export const UsersProvider = ({ children }) => {
  const { users, loading, error } = useFetchUsersBySchool();

  return (
    <UsersContext.Provider value={{ users, loading, error }}>
      {children}
    </UsersContext.Provider>
  );
};
