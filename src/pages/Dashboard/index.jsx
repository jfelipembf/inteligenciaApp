import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { Container } from "reactstrap";

// Dashboards específicos por perfil
import GestorDashboard from "./GestorDashboard";
import CoordenadorDashboard from "./CoordenadorDashboard";
import ProfessorDashboard from "./ProfessorDashboard";

//i18n
import { withTranslation } from "react-i18next";

const Dashboard = (props) => {
  // Estado para armazenar o perfil do usuário
  const [userRole, setUserRole] = useState("gestor"); // Valores possíveis: gestor, coordenador, professor

  useEffect(() => {
    // Aqui você pode implementar a lógica para obter o perfil do usuário logado
    // Por exemplo, através de uma API ou do localStorage
    
    // Simulação: obtendo o perfil do usuário
    const getUserRole = () => {
      // Em uma implementação real, você obteria o perfil do usuário de uma API ou do localStorage
      // Por enquanto, vamos usar um valor fixo para demonstração
      return "gestor"; // Valores possíveis: gestor, coordenador, professor
    };
    
    setUserRole(getUserRole());
    
    // Definir o título da página
    document.title = `Dashboard | Painel Escolar`;
  }, []);

  // Renderizar o dashboard específico com base no perfil do usuário
  const renderDashboard = () => {
    switch (userRole) {
      case "gestor":
        return <GestorDashboard />;
      case "coordenador":
        return <CoordenadorDashboard />;
      case "professor":
        return <ProfessorDashboard />;
      default:
        return <GestorDashboard />;
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {renderDashboard()}
        </Container>
      </div>
    </React.Fragment>
  );
};

Dashboard.propTypes = {
  t: PropTypes.any,
};

export default withTranslation()(Dashboard);
