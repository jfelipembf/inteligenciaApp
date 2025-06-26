import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../store/actions";
import logo from "../assets/images/lgo.png";
import "../assets/scss/pink-sidebar.scss";
import useUser from "../hooks/useUser";

const PinkSidebar = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true); // novo estado
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userDetails } = useUser();

  let dashboardTo = "/dashboard";
  if (userDetails?.role === "professor") dashboardTo = "/dashboard-professor";
  else if (userDetails?.role === "coordinator")
    dashboardTo = "/dashboard-coordenador";
  const menuItems = [
    { icon: "bx bx-home", label: "Home", to: "/home" },
    { icon: "bx bx-line-chart", label: "Dashboard", to: dashboardTo },
    {
      icon: "bx bx-user-pin",
      label: "Colaboradores",
      children: [
        { label: "Professores", to: "/teachers" },
        { label: "Coordenadores", to: "/coordinators" },
        { label: "Administradores", to: "/administrators" },
      ],
    },
    {
      icon: "bx bx-message-square-dots",
      label: "Comunicação",
      children: [
        { label: "Mensagens", to: "/messages" },
        { label: "Notificações", to: "/notifications" },
      ],
    },
    {
      icon: "bx bx-group",
      label: "Turmas",
      children: [
        { label: "Criar Turma", to: "/create-class" },
        { label: "Visualizar Turmas", to: "/classes" },
      ],
    },
    { icon: "bx bx-user-circle", label: "Alunos", to: "/students" },
    {
      icon: "bx bx-clipboard",
      label: "Frequências",
      children: [
        { label: "Registrar Frequência", to: "/create-attendance" },
        { label: "Visualizar Frequências", to: "/attendances" },
      ],
    },
    {
      icon: "bx bx-clipboard",
      label: "Atividades",
      children: [
        { label: "Criar Atividade", to: "/activities/add-activity" },
        { label: "Visualizar Atividades", to: "/activities" },
      ],
    },
    {
      icon: "bx bx-clipboard",
      label: "Notas",
      children: [
        { label: "Adicionar Notas", to: "/grades" },
        { label: "Visualizar Notas", to: "/grades-list" },
      ],
    },
    { icon: "bx bx-calendar", label: "Calendário", to: "/calendar" },
    {
      icon: "bx bx-calendar-event",
      label: "Eventos",
      children: [
        { label: "Criar Evento", to: "/events/create" },
        { label: "Visualizar Eventos", to: "/events" },
      ],
    },
    { icon: "bx bx-cog", label: "Configurações", to: "/settings" },
    // { icon: "bx bx-money", label: "Financeiro", to: "/financeiro/caixa" },
  ];

  const toggleMenu = (idx) => {
    setOpenMenu((prev) => (prev === idx ? null : idx));
  };

  const handleLogout = () => {
    dispatch(logoutUser(navigate));
  };

  const handleSidebarToggle = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <>
      {/* Botão para abrir/fechar a sidebar */}
      <button
        className="sidebar-toggle-btn"
        onClick={handleSidebarToggle}
        style={{
          position: "fixed",
          top: 20,
          left: sidebarOpen ? 220 : 20,
          zIndex: 1100,
        }}
      >
        {sidebarOpen ? (
          <i className="bx bx-menu-alt-left"></i>
        ) : (
          <i className="bx bx-menu"></i>
        )}
      </button>
      {/* Sidebar */}
      <nav className={`sidebar-menu-no-bg${sidebarOpen ? "" : " closed"}`}>
        <div className="sidebar-logo-no-bg">
          <img
            src={logo}
            alt="Logo Inteligência"
            className="sidebar-logo-img"
            style={{ filter: "brightness(0) invert(1)" }}
          />
        </div>
        {menuItems.map((item, idx) =>
          item.children ? (
            <div key={idx} className="sidebar-menu-group">
              <button
                className="sidebar-btn-no-bg sidebar-btn-parent"
                onClick={() => toggleMenu(idx)}
                type="button"
              >
                <i className={item.icon}></i>
                <span>{item.label}</span>
                <i
                  className={`bx bx-chevron-${
                    openMenu === idx ? "up" : "down"
                  } ms-auto`}
                ></i>
              </button>
              {openMenu === idx && (
                <div className="sidebar-submenu">
                  {item.children.map((sub, subIdx) => (
                    <NavLink
                      to={sub.to}
                      className="sidebar-btn-no-bg sidebar-btn-sub"
                      key={subIdx}
                      end
                    >
                      <span>{sub.label}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <NavLink to={item.to} className="sidebar-btn-no-bg" key={idx} end>
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </NavLink>
          )
        )}
        <button className="sidebar-btn-no-bg logout" onClick={handleLogout}>
          <i className="bx bx-power-off"></i>
          <span>Sair</span>
        </button>
      </nav>
    </>
  );
};

export default PinkSidebar;
