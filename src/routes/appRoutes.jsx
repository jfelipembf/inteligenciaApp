import React from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoutesWrapper from "../wrappers/ProtectedRoutesWrapper";
import { authProtectedRoutes, publicRoutes } from "./index";

// Middleware para autenticação
import Authmiddleware from "./route";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rotas públicas */}
      {publicRoutes.map((route, idx) => (
        <Route path={route.path} element={route.component} key={idx} />
      ))}

      {/* Rotas protegidas */}
      <Route element={<Authmiddleware />}>
        <Route element={<ProtectedRoutesWrapper />}>
          {authProtectedRoutes.map((route, idx) => (
            <Route path={route.path} element={route.component} key={idx} />
          ))}
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
