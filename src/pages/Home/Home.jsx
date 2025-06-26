import React from "react";
import { Link } from "react-router-dom";

const quickLinks = [
  { to: "/dashboard", icon: "bx bx-grid-alt", label: "Dashboard" },
  { to: "/coordinators", icon: "bx bx-share-alt", label: "Colaboradores" },
  { to: "/messages", icon: "bx bx-message-square-dots", label: "Comunicação" },
  { to: "/classes", icon: "bx bx-group", label: "Turmas" },
  { to: "/students", icon: "bx bx-user-plus", label: "Alunos" },
  { to: "/attendances", icon: "bx bx-bar-chart-alt-2", label: "Frequências" },
  { to: "/grades-list", icon: "bx bx-calculator", label: "Notas" },
  { to: "/calendar", icon: "bx bx-calendar", label: "Calendário" },
  { to: "/events", icon: "bx bx-star", label: "Eventos" },
  { to: "/financeiro/caixa", icon: "bx bx-diamond", label: "Financeiro" },
  { to: "/settings", icon: "bx bx-cog", label: "Configurações" },
  { to: "/logout", icon: "bx bx-power-off", label: "Sair", special: true },
];

const Home = () => (
  <>
    <div className="text-center mt-3 mb-2">
      <span className="d-inline-flex align-items-center fw-semibold" style={{ fontSize: '1.5rem', color: '#7c4bc0', fontWeight: 500 }}>
        <i className="bx bx-home me-2" style={{ fontSize: '1.6rem', color: '#a18cd1', fontWeight: 400 }}></i>
        HOME
      </span>
      <div className="text-muted mb-3 mt-1 fw-normal" style={{ fontSize: '1rem', fontWeight: 400 }}>
        Utilize os atalhos abaixo para navegar rapidamente pelo sistema
      </div>
    </div>
    <div className="home-atalhos-grid">
      {quickLinks.map((item, idx) => (
        <Link
          to={item.to}
          key={item.to}
          className={`home-atalho-btn${item.special ? ' sair' : ''}`}
        >
          <i className={item.icon}></i>
          <span>{item.label}</span>
        </Link>
      ))}
    </div>
  </>
);

export default Home;
