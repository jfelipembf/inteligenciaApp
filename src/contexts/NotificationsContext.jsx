import React, { createContext, useContext } from "react";
import useNotifications from "../hooks/useNotifications";

const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const notificationsHook = useNotifications();

  return (
    <NotificationsContext.Provider value={notificationsHook}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotificationsContext = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      "useNotificationsContext deve ser usado dentro de NotificationsProvider"
    );
  }
  return context;
};
