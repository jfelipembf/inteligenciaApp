import React, { createContext, useContext } from "react";
import useFetchEvents from "../hooks/useFetchEvents";

const EventsContext = createContext();

export const useEventsContext = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error(
      "useEventsContext deve ser usado dentro de um EventsProvider"
    );
  }
  return context;
};

export const EventsProvider = ({ children }) => {
  const { events, loading, error, refetch } = useFetchEvents();

  const value = {
    events,

    loading,
    error,
    refetchEvents: refetch,
  };

  return (
    <EventsContext.Provider value={value}>{children}</EventsContext.Provider>
  );
};
