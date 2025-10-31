import React from "react";
import { AuthProvider } from "./auth/auth";

export function AppProvider({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
