import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../store/actions";
import logo from "../assets/images/lgo.png";
import "../assets/scss/pink-sidebar.scss";
import useUser from "../hooks/useUser";

const PinkSidebar = (props) => {
  const [openMenu, setOpenMenu] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userDetails } = useUser();
  const role = userDetails?.role;

  const toggleMenu = (idx) => {
    setOpenMenu((prev) => (prev === idx ? null : idx));
  };

  const handleLogout = () => {
    dispatch(logoutUser(navigate));
  };

  const handleSidebarToggle = () => {
    setSidebarOpen((prev) => !prev);
  };

  let dashboardTo = "/dashboard";
  if (userDetails?.role === "professor") dashboardTo = "/dashboard-professor";
  else if (
    userDetails?.role === "coordinator" ||
    userDetails?.role === "principal" ||
    userDetails?.role === "ceo"
  )
    dashboardTo = "/dashboard-coordenador";

  const isCPFMissing = !userDetails?.personalInfo?.cpf;

  return (
    <>
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
      <nav className={`sidebar-menu-no-bg${sidebarOpen ? "" : " closed"}`}>
        <div className="sidebar-logo-no-bg">
          <img
            src={logo}
            alt="Logo Inteligência"
            className="sidebar-logo-img"
            style={{ filter: "brightness(0) invert(1)" }}
          />
        </div>
        {/* Renderizar apenas "Escolas" para role master */}
        {role === "master" ? (
          <>
            <NavLink to="/schools" className="sidebar-btn-no-bg" end>
              <i className="bx bx-building"></i>
              <span>Escolas</span>
            </NavLink>
            <button className="sidebar-btn-no-bg logout" onClick={handleLogout}>
              <i className="bx bx-power-off"></i>
              <span>Sair</span>
            </button>
          </>
        ) : isCPFMissing ? (
          <>
            {/* Renderizar apenas "Inserir Dados" se o nome estiver ausente */}
            <NavLink to="/profile" className="sidebar-btn-no-bg" end>
              <i className="bx bx-user"></i>
              <span>Inserir Dados</span>
            </NavLink>
            <button className="sidebar-btn-no-bg logout" onClick={handleLogout}>
              <i className="bx bx-power-off"></i>
              <span>Sair</span>
            </button>
          </>
        ) : role === "ceo" ? (
          <>
            {/* Home */}
            <NavLink to="/home" className="sidebar-btn-no-bg" end>
              <i className="bx bx-home"></i>
              <span>Home</span>
            </NavLink>
            <NavLink to="/schools" className="sidebar-btn-no-bg" end>
              <i className="bx bx-building"></i>
              <span>Escolas</span>
            </NavLink>
            {/* Dashboards */}
            <NavLink to={dashboardTo} className="sidebar-btn-no-bg" end>
              <i className="bx bx-line-chart"></i>
              <span>Dashboard</span>
            </NavLink>

            {/* Colaboradores */}
            {role === "ceo" && (
              <div className="sidebar-menu-group">
                <button
                  className="sidebar-btn-no-bg sidebar-btn-parent"
                  onClick={() => toggleMenu("colaboradores")}
                  type="button"
                >
                  <i className="bx bx-user-pin"></i>
                  <span>Colaboradores</span>
                  <i
                    className={`bx bx-chevron-${
                      openMenu === "colaboradores" ? "up" : "down"
                    } ms-auto`}
                  ></i>
                </button>
                {openMenu === "colaboradores" && (
                  <div className="sidebar-submenu">
                    <NavLink
                      to="/teachers"
                      className="sidebar-btn-no-bg sidebar-btn-sub"
                      end
                    >
                      <span>Professores</span>
                    </NavLink>
                    <NavLink
                      to="/coordinators"
                      className="sidebar-btn-no-bg sidebar-btn-sub"
                      end
                    >
                      <span>Coordenadores</span>
                    </NavLink>
                    <NavLink
                      to="/colaborators/create"
                      className="sidebar-btn-no-bg sidebar-btn-sub"
                      end
                    >
                      <span>Adicionar Colaborador</span>
                    </NavLink>
                  </div>
                )}
              </div>
            )}

            {/* Comunicação */}
            <div className="sidebar-menu-group">
              <button
                className="sidebar-btn-no-bg sidebar-btn-parent"
                onClick={() => toggleMenu("comunicacao")}
                type="button"
              >
                <i className="bx bx-message-square-dots"></i>
                <span>Comunicação</span>
                <i
                  className={`bx bx-chevron-${
                    openMenu === "comunicacao" ? "up" : "down"
                  } ms-auto`}
                ></i>
              </button>
              {openMenu === "comunicacao" && (
                <div className="sidebar-submenu">
                  <NavLink
                    to="/doubts"
                    className="sidebar-btn-no-bg sidebar-btn-sub"
                    end
                  >
                    <span>Dúvidas</span>
                  </NavLink>
                  <NavLink
                    to="/notifications"
                    className="sidebar-btn-no-bg sidebar-btn-sub"
                    end
                  >
                    <span>Notificações</span>
                  </NavLink>
                </div>
              )}
            </div>

            {/* Turmas */}
            <div className="sidebar-menu-group">
              <button
                className="sidebar-btn-no-bg sidebar-btn-parent"
                onClick={() => toggleMenu("turmas")}
                type="button"
              >
                <i className="bx bx-group"></i>
                <span>Turmas</span>
                <i
                  className={`bx bx-chevron-${
                    openMenu === "turmas" ? "up" : "down"
                  } ms-auto`}
                ></i>
              </button>
              {openMenu === "turmas" && (
                <div className="sidebar-submenu">
                  {role !== "professor" && (
                    <NavLink
                      to="/create-class"
                      className="sidebar-btn-no-bg sidebar-btn-sub"
                      end
                    >
                      <span>Criar Turma</span>
                    </NavLink>
                  )}
                  <NavLink
                    to="/classes"
                    className="sidebar-btn-no-bg sidebar-btn-sub"
                    end
                  >
                    <span>Visualizar Turmas</span>
                  </NavLink>
                  {role === "professor" && (
                    <NavLink
                      to="/myclasses"
                      className="sidebar-btn-no-bg sidebar-btn-sub"
                      end
                    >
                      <span>Minhas Aulas</span>
                    </NavLink>
                  )}
                </div>
              )}
            </div>

            {/* Alunos */}
            <NavLink to="/students" className="sidebar-btn-no-bg" end>
              <i className="bx bx-user-circle"></i>
              <span>Alunos</span>
            </NavLink>

            {/* Frequências */}
            <div className="sidebar-menu-group">
              <button
                className="sidebar-btn-no-bg sidebar-btn-parent"
                onClick={() => toggleMenu("frequencias")}
                type="button"
              >
                <i className="bx bx-bar-chart-alt-2"></i>
                <span>Frequências</span>
                <i
                  className={`bx bx-chevron-${
                    openMenu === "frequencias" ? "up" : "down"
                  } ms-auto`}
                ></i>
              </button>
              {openMenu === "frequencias" && (
                <div className="sidebar-submenu">
                  {role === "professor" && (
                    <NavLink
                      to="/create-attendance"
                      className="sidebar-btn-no-bg sidebar-btn-sub"
                      end
                    >
                      <span>Registrar Frequência</span>
                    </NavLink>
                  )}
                  <NavLink
                    to="/attendances"
                    className="sidebar-btn-no-bg sidebar-btn-sub"
                    end
                  >
                    <span>Visualizar Frequências</span>
                  </NavLink>
                </div>
              )}
            </div>

            {/* Atividades */}
            {role === "professor" && (
              <div className="sidebar-menu-group">
                <button
                  className="sidebar-btn-no-bg sidebar-btn-parent"
                  onClick={() => toggleMenu("atividades")}
                  type="button"
                >
                  <i className="bx bx-clipboard"></i>
                  <span>Atividades</span>
                  <i
                    className={`bx bx-chevron-${
                      openMenu === "atividades" ? "up" : "down"
                    } ms-auto`}
                  ></i>
                </button>
                {openMenu === "atividades" && (
                  <div className="sidebar-submenu">
                    <NavLink
                      to="/activities/add-activity"
                      className="sidebar-btn-no-bg sidebar-btn-sub"
                      end
                    >
                      <span>Criar Atividade</span>
                    </NavLink>
                    <NavLink
                      to="/activities"
                      className="sidebar-btn-no-bg sidebar-btn-sub"
                      end
                    >
                      <span>Visualizar Atividades</span>
                    </NavLink>
                  </div>
                )}
              </div>
            )}

            {/* Notas */}
            <div className="sidebar-menu-group">
              <button
                className="sidebar-btn-no-bg sidebar-btn-parent"
                onClick={() => toggleMenu("notas")}
                type="button"
              >
                <i className="bx bx-calculator"></i>
                <span>Notas</span>
                <i
                  className={`bx bx-chevron-${
                    openMenu === "notas" ? "up" : "down"
                  } ms-auto`}
                ></i>
              </button>
              {openMenu === "notas" && (
                <div className="sidebar-submenu">
                  {role === "professor" && (
                    <NavLink
                      to="/grades"
                      className="sidebar-btn-no-bg sidebar-btn-sub"
                      end
                    >
                      <span>Adicionar Notas</span>
                    </NavLink>
                  )}
                  <NavLink
                    to="/grades-list"
                    className="sidebar-btn-no-bg sidebar-btn-sub"
                    end
                  >
                    <span>Visualizar Notas</span>
                  </NavLink>
                </div>
              )}
            </div>

            {/* Calendário */}
            <NavLink to="/calendar" className="sidebar-btn-no-bg" end>
              <i className="bx bx-calendar"></i>
              <span>Calendário</span>
            </NavLink>

            {/* Eventos */}
            <div className="sidebar-menu-group">
              <button
                className="sidebar-btn-no-bg sidebar-btn-parent"
                onClick={() => toggleMenu("eventos")}
                type="button"
              >
                <i className="bx bx-calendar-event"></i>
                <span>Eventos</span>
                <i
                  className={`bx bx-chevron-${
                    openMenu === "eventos" ? "up" : "down"
                  } ms-auto`}
                ></i>
              </button>
              {openMenu === "eventos" && (
                <div className="sidebar-submenu">
                  <NavLink
                    to="/events/create"
                    className="sidebar-btn-no-bg sidebar-btn-sub"
                    end
                  >
                    <span>Criar Evento</span>
                  </NavLink>
                  <NavLink
                    to="/events"
                    className="sidebar-btn-no-bg sidebar-btn-sub"
                    end
                  >
                    <span>Visualizar Eventos</span>
                  </NavLink>
                </div>
              )}
            </div>
            <button className="sidebar-btn-no-bg logout" onClick={handleLogout}>
              <i className="bx bx-power-off"></i>
              <span>Sair</span>
            </button>
          </>
        ) : (
          <>
            {/* Home */}
            <NavLink to="/home" className="sidebar-btn-no-bg" end>
              <i className="bx bx-home"></i>
              <span>Home</span>
            </NavLink>

            {/* Dashboards */}
            <NavLink to={dashboardTo} className="sidebar-btn-no-bg" end>
              <i className="bx bx-line-chart"></i>
              <span>Dashboard</span>
            </NavLink>

            {/* Colaboradores */}
            {(role === "ceo" ||
              role === "coordinator" ||
              role === "principal") && (
              <div className="sidebar-menu-group">
                <button
                  className="sidebar-btn-no-bg sidebar-btn-parent"
                  onClick={() => toggleMenu("colaboradores")}
                  type="button"
                >
                  <i className="bx bx-user-pin"></i>
                  <span>Colaboradores</span>
                  <i
                    className={`bx bx-chevron-${
                      openMenu === "colaboradores" ? "up" : "down"
                    } ms-auto`}
                  ></i>
                </button>
                {openMenu === "colaboradores" && (
                  <div className="sidebar-submenu">
                    <NavLink
                      to="/teachers"
                      className="sidebar-btn-no-bg sidebar-btn-sub"
                      end
                    >
                      <span>Professores</span>
                    </NavLink>
                    <NavLink
                      to="/coordinators"
                      className="sidebar-btn-no-bg sidebar-btn-sub"
                      end
                    >
                      <span>Coordenadores</span>
                    </NavLink>
                    <NavLink
                      to="/colaborators/create"
                      className="sidebar-btn-no-bg sidebar-btn-sub"
                      end
                    >
                      <span>Adicionar Colaborador</span>
                    </NavLink>
                  </div>
                )}
              </div>
            )}

            {/* Comunicação */}
            <div className="sidebar-menu-group">
              <button
                className="sidebar-btn-no-bg sidebar-btn-parent"
                onClick={() => toggleMenu("comunicacao")}
                type="button"
              >
                <i className="bx bx-message-square-dots"></i>
                <span>Comunicação</span>
                <i
                  className={`bx bx-chevron-${
                    openMenu === "comunicacao" ? "up" : "down"
                  } ms-auto`}
                ></i>
              </button>
              {openMenu === "comunicacao" && (
                <div className="sidebar-submenu">
                  <NavLink
                    to="/doubts"
                    className="sidebar-btn-no-bg sidebar-btn-sub"
                    end
                  >
                    <span>Dúvidas</span>
                  </NavLink>
                  <NavLink
                    to="/notifications"
                    className="sidebar-btn-no-bg sidebar-btn-sub"
                    end
                  >
                    <span>Notificações</span>
                  </NavLink>
                </div>
              )}
            </div>

            {/* Turmas */}
            <div className="sidebar-menu-group">
              <button
                className="sidebar-btn-no-bg sidebar-btn-parent"
                onClick={() => toggleMenu("turmas")}
                type="button"
              >
                <i className="bx bx-group"></i>
                <span>Turmas</span>
                <i
                  className={`bx bx-chevron-${
                    openMenu === "turmas" ? "up" : "down"
                  } ms-auto`}
                ></i>
              </button>
              {openMenu === "turmas" && (
                <div className="sidebar-submenu">
                  {role !== "professor" && (
                    <NavLink
                      to="/create-class"
                      className="sidebar-btn-no-bg sidebar-btn-sub"
                      end
                    >
                      <span>Criar Turma</span>
                    </NavLink>
                  )}
                  <NavLink
                    to="/classes"
                    className="sidebar-btn-no-bg sidebar-btn-sub"
                    end
                  >
                    <span>Visualizar Turmas</span>
                  </NavLink>
                  {role === "professor" && (
                    <NavLink
                      to="/myclasses"
                      className="sidebar-btn-no-bg sidebar-btn-sub"
                      end
                    >
                      <span>Minhas Aulas</span>
                    </NavLink>
                  )}
                </div>
              )}
            </div>

            {/* Alunos */}
            <NavLink to="/students" className="sidebar-btn-no-bg" end>
              <i className="bx bx-user-circle"></i>
              <span>Alunos</span>
            </NavLink>

            {/* Frequências */}
            <div className="sidebar-menu-group">
              <button
                className="sidebar-btn-no-bg sidebar-btn-parent"
                onClick={() => toggleMenu("frequencias")}
                type="button"
              >
                <i className="bx bx-bar-chart-alt-2"></i>
                <span>Frequências</span>
                <i
                  className={`bx bx-chevron-${
                    openMenu === "frequencias" ? "up" : "down"
                  } ms-auto`}
                ></i>
              </button>
              {openMenu === "frequencias" && (
                <div className="sidebar-submenu">
                  {role === "professor" && (
                    <NavLink
                      to="/create-attendance"
                      className="sidebar-btn-no-bg sidebar-btn-sub"
                      end
                    >
                      <span>Registrar Frequência</span>
                    </NavLink>
                  )}
                  <NavLink
                    to="/attendances"
                    className="sidebar-btn-no-bg sidebar-btn-sub"
                    end
                  >
                    <span>Visualizar Frequências</span>
                  </NavLink>
                </div>
              )}
            </div>

            {/* Atividades */}
            {role === "professor" && (
              <div className="sidebar-menu-group">
                <button
                  className="sidebar-btn-no-bg sidebar-btn-parent"
                  onClick={() => toggleMenu("atividades")}
                  type="button"
                >
                  <i className="bx bx-clipboard"></i>
                  <span>Atividades</span>
                  <i
                    className={`bx bx-chevron-${
                      openMenu === "atividades" ? "up" : "down"
                    } ms-auto`}
                  ></i>
                </button>
                {openMenu === "atividades" && (
                  <div className="sidebar-submenu">
                    <NavLink
                      to="/activities/add-activity"
                      className="sidebar-btn-no-bg sidebar-btn-sub"
                      end
                    >
                      <span>Criar Atividade</span>
                    </NavLink>
                    <NavLink
                      to="/activities"
                      className="sidebar-btn-no-bg sidebar-btn-sub"
                      end
                    >
                      <span>Visualizar Atividades</span>
                    </NavLink>
                  </div>
                )}
              </div>
            )}

            {/* Notas */}
            <div className="sidebar-menu-group">
              <button
                className="sidebar-btn-no-bg sidebar-btn-parent"
                onClick={() => toggleMenu("notas")}
                type="button"
              >
                <i className="bx bx-calculator"></i>
                <span>Notas</span>
                <i
                  className={`bx bx-chevron-${
                    openMenu === "notas" ? "up" : "down"
                  } ms-auto`}
                ></i>
              </button>
              {openMenu === "notas" && (
                <div className="sidebar-submenu">
                  {role === "professor" && (
                    <NavLink
                      to="/grades"
                      className="sidebar-btn-no-bg sidebar-btn-sub"
                      end
                    >
                      <span>Adicionar Notas</span>
                    </NavLink>
                  )}
                  <NavLink
                    to="/grades-list"
                    className="sidebar-btn-no-bg sidebar-btn-sub"
                    end
                  >
                    <span>Visualizar Notas</span>
                  </NavLink>
                </div>
              )}
            </div>

            {/* Calendário */}
            <NavLink to="/calendar" className="sidebar-btn-no-bg" end>
              <i className="bx bx-calendar"></i>
              <span>Calendário</span>
            </NavLink>

            {/* Eventos */}
            <div className="sidebar-menu-group">
              <button
                className="sidebar-btn-no-bg sidebar-btn-parent"
                onClick={() => toggleMenu("eventos")}
                type="button"
              >
                <i className="bx bx-calendar-event"></i>
                <span>Eventos</span>
                <i
                  className={`bx bx-chevron-${
                    openMenu === "eventos" ? "up" : "down"
                  } ms-auto`}
                ></i>
              </button>
              {openMenu === "eventos" && (
                <div className="sidebar-submenu">
                  <NavLink
                    to="/events/create"
                    className="sidebar-btn-no-bg sidebar-btn-sub"
                    end
                  >
                    <span>Criar Evento</span>
                  </NavLink>
                  <NavLink
                    to="/events"
                    className="sidebar-btn-no-bg sidebar-btn-sub"
                    end
                  >
                    <span>Visualizar Eventos</span>
                  </NavLink>
                </div>
              )}
            </div>

            {/* Logout */}
            <button className="sidebar-btn-no-bg logout" onClick={handleLogout}>
              <i className="bx bx-power-off"></i>
              <span>Sair</span>
            </button>
          </>
        )}
      </nav>
    </>
  );
};

export default PinkSidebar;
