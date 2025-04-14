import React from "react";
import { Navigate } from "react-router-dom";
import useUser from "../hooks/useUser";

const Authmiddleware = (props) => {
  const { isAuthenticated, loading } = useUser();

  // Mostrar um indicador de carregamento enquanto verificamos a autenticação
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  // Redirecionar para a página de login se não estiver autenticado
  if (!isAuthenticated) {
    return <Navigate to={{ pathname: "/login", state: { from: props.location } }} />;
  }

  // Renderizar os componentes filhos se estiver autenticado
  return <React.Fragment>{props.children}</React.Fragment>;
};

export default Authmiddleware;
