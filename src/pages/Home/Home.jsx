import React from "react";
import { Link } from "react-router-dom";

// Supondo que você tenha acesso ao user no contexto ou via props
import useUser from "../../hooks/useUser";

const Home = () => {
  const { userDetails } = useUser();

  // Defina o dashboard correto conforme o role
  let dashboardLink = "/dashboard";
  if (userDetails?.role === "professor") dashboardLink = "/dashboard-professor";
  else if (userDetails?.role === "coordinator")
    dashboardLink = "/dashboard-coordenador";

  const quickLinks = [
    { to: dashboardLink, icon: "bx bx-line-chart", label: "Dashboard" },
    { to: "/coordinators", icon: "bx bx-user", label: "Coordenadores" },
    { to: "/teachers", icon: "bx bx-user-voice", label: "Professores" },
    {
      to: "/messages",
      icon: "bx bx-message-square-dots",
      label: "Mensagens",
    },
    { to: "/notifications", icon: "bx bx-bell", label: "Notificações" },
    { to: "/classes", icon: "bx bx-group", label: "Turmas" },
    { to: "/students", icon: "bx bx-user-circle", label: "Alunos" },
    { to: "/attendances", icon: "bx bx-bar-chart-alt-2", label: "Frequências" },
    { to: "/grades-list", icon: "bx bx-calculator", label: "Notas" },
    { to: "/calendar", icon: "bx bx-calendar", label: "Calendário" },
    { to: "/events", icon: "bx bx-calendar-event", label: "Eventos" },
    //{ to: "/financeiro/caixa", icon: "bx bx-diamond", label: "Financeiro" },
    //{ to: "/settings", icon: "bx bx-cog", label: "Configurações" },
    { to: "/logout", icon: "bx bx-power-off", label: "Sair", special: true },
  ];

  const masterLinks = [
    { to: "/schools", icon: "bx bx-building", label: "Escolas" },
    { to: "", icon: "", label: "" },
    { to: "", icon: "", label: "" },
    { to: "", icon: "", label: "" },

    { to: "", icon: "", label: "" },
    { to: "", icon: "", label: "" },
    { to: "", icon: "", label: "" },
    { to: "", icon: "", label: "" },
    { to: "", icon: "", label: "" },
    { to: "", icon: "", label: "" },
    { to: "", icon: "", label: "" },
    { to: "/logout", icon: "bx bx-power-off", label: "Sair", special: true },
  ];

  const filteredLinks =
    userDetails?.role === "master"
      ? masterLinks
      : userDetails?.role === "professor"
      ? (() => {
          // Remove "Coordenadores" e "Professores"
          const base = quickLinks.filter(
            (item) => item.to !== "/coordinators" && item.to !== "/teachers"
          );

          // Encontrar índices para inserir os novos atalhos
          const attIdx = base.findIndex((item) => item.to === "/attendances");
          const notasIdx = base.findIndex((item) => item.to === "/grades-list");

          // Inserir "Registrar Frequência" após "Frequências"
          if (attIdx !== -1) {
            base.splice(attIdx + 1, 0, {
              to: "/create-attendance",
              icon: "bx bx-plus-circle",
              label: "Registrar Frequência",
            });
          }
          // Inserir "Registrar Notas" após "Notas"
          if (notasIdx !== -1) {
            base.splice(notasIdx + 2, 0, {
              to: "/grades",
              icon: "bx bx-plus-circle",
              label: "Registrar Notas",
            });
          }
          return base;
        })()
      : quickLinks;

  return (
    <>
      <div className="text-center mt-3 mb-2">
        <span
          className="d-inline-flex align-items-center fw-semibold"
          style={{ fontSize: "1.5rem", color: "#7c4bc0", fontWeight: 500 }}
        >
          <i
            className="bx bx-home me-2"
            style={{ fontSize: "1.6rem", color: "#a18cd1", fontWeight: 400 }}
          ></i>
          HOME
        </span>
        <div
          className="text-muted mb-3 mt-1 fw-normal"
          style={{ fontSize: "1rem", fontWeight: 400 }}
        >
          Utilize os atalhos abaixo para navegar rapidamente pelo sistema
        </div>
      </div>
      <div className="home-atalhos-grid">
        {filteredLinks.map((item, idx) => (
          <Link
            to={item.to}
            key={item.to}
            className={`home-atalho-btn${item.special ? " sair" : ""}`}
          >
            <i className={item.icon}></i>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Home;
