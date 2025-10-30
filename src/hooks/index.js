/**
 * AppProvider - Composição de todos os Providers
 * Padrão do mobile: centraliza todos os providers
 */

import React from "react";
import { AuthProvider } from "./auth/auth";

/**
 * AppProvider - Composição de todos os providers
 * Adicionar novos providers aqui conforme necessário
 */
export function AppProvider({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
