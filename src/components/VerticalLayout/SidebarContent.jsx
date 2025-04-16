import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";

// //Import Scrollbar
import SimpleBar from "simplebar-react";

// MetisMenu
import MetisMenu from "metismenujs";
import { Link, useLocation } from "react-router-dom";
import withRouter from "../Common/withRouter";

//i18n
import { withTranslation } from "react-i18next";
import { useCallback } from "react";

const SidebarContent = (props) => {
  const ref = useRef();
  const path = useLocation();

  const activateParentDropdown = useCallback((item) => {
    item.classList.add("active");
    const parent = item.parentElement;
    const parent2El = parent.childNodes[1];
    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show");
    }

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show"); // ul tag

        const parent3 = parent2.parentElement; // li tag

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement; // ul
          if (parent4) {
            parent4.classList.add("mm-show"); // ul
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("mm-show"); // li
              parent5.childNodes[0].classList.add("mm-active"); // a tag
            }
          }
        }
      }
      scrollElement(item);
      return false;
    }
    scrollElement(item);
    return false;
  }, []);

  const removeActivation = (items) => {
    for (var i = 0; i < items.length; ++i) {
      var item = items[i];
      const parent = items[i].parentElement;

      if (item && item.classList.contains("active")) {
        item.classList.remove("active");
      }
      if (parent) {
        const parent2El =
          parent.childNodes && parent.childNodes.lenght && parent.childNodes[1]
            ? parent.childNodes[1]
            : null;
        if (parent2El && parent2El.id !== "side-menu") {
          parent2El.classList.remove("mm-show");
        }

        parent.classList.remove("mm-active");
        const parent2 = parent.parentElement;

        if (parent2) {
          parent2.classList.remove("mm-show");

          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.remove("mm-active"); // li
            parent3.childNodes[0].classList.remove("mm-active");

            const parent4 = parent3.parentElement; // ul
            if (parent4) {
              parent4.classList.remove("mm-show"); // ul
              const parent5 = parent4.parentElement;
              if (parent5) {
                parent5.classList.remove("mm-show"); // li
                parent5.childNodes[0].classList.remove("mm-active"); // a tag
              }
            }
          }
        }
      }
    }
  };

  const activeMenu = useCallback(() => {
    const pathName = path.pathname;
    let matchingMenuItem = null;
    const ul = document.getElementById("side-menu");
    const items = ul.getElementsByTagName("a");
    removeActivation(items);

    for (let i = 0; i < items.length; ++i) {
      if (pathName === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    }
  }, [path.pathname, activateParentDropdown]);

  useEffect(() => {
    ref.current.recalculate();
  }, []);

  useEffect(() => {
    const metisMenu = new MetisMenu("#side-menu");
    activeMenu();

    // Cleanup on component unmount
    return () => {
      metisMenu.dispose();
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    activeMenu();
  }, [activeMenu]);

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  }

  return (
    <React.Fragment>
      <SimpleBar className="h-100" ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="menu-title">{props.t("Menu")} </li>

            {/* Dashboards */}
            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-home-circle"></i>
                <span>{props.t("Dashboards")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="/dashboard-gestor">
                    {props.t("Dashboard Gestor")}
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard-coordenador">
                    {props.t("Dashboard Coordenador")}
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard-professor">
                    {props.t("Dashboard Professor")}
                  </Link>
                </li>
              </ul>
            </li>

            {/* Colaboradores */}
            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-user-pin"></i>
                <span>{props.t("Colaboradores")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="/teachers">{props.t("Professores")}</Link>
                </li>
                <li>
                  <Link to="/coordinators">{props.t("Coordenadores")}</Link>
                </li>
                <li>
                  <Link to="/administrators">{props.t("Administradores")}</Link>
                </li>
                <li>
                  <Link to="/staff">{props.t("Funcionários")}</Link>
                </li>
              </ul>
            </li>

            {/* Comunicação */}
            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-message-square-dots"></i>
                <span>{props.t("Comunicação")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="/messages">{props.t("Mensagens")}</Link>
                </li>
                <li>
                  <Link to="/notifications">{props.t("Notificações")}</Link>
                </li>
              </ul>
            </li>

            {/* Turmas */}
            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-group"></i>
                <span>{props.t("Turmas")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="/create-class">{props.t("Criar Turma")}</Link>
                </li>
                <li>
                  <Link to="/classes">{props.t("Visualizar Turmas")}</Link>
                </li>
              </ul>
            </li>

            {/* Alunos */}
            <li>
              <Link to="/students" className="waves-effect">
                <i className="bx bx-user-circle"></i>
                <span className="menu-item">{props.t("Alunos")}</span>
              </Link>
            </li>

            {/* Atividades */}
            <li>
              <Link to="/activities" className="waves-effect">
                <i className="bx bx-clipboard font-size-18"></i>
                <span className="menu-item">{props.t("Atividades")}</span>
              </Link>
            </li>

            {/* Calendário */}
            <li>
              <Link to="/calendar" className="waves-effect">
                <i className="bx bx-calendar"></i>
                <span className="menu-item">{props.t("Calendário")}</span>
              </Link>
            </li>

            {/* Eventos */}
            <li>
              <Link to="/events" className="waves-effect">
                <i className="bx bx-calendar-event"></i>
                <span className="menu-item">{props.t("Eventos")}</span>
              </Link>
            </li>

            {/* Financeiro */}
            <li>
              <Link to="/financeiro/caixa" className="waves-effect">
                <i className="bx bx-money"></i>
                <span className="menu-item">{props.t("Financeiro")}</span>
              </Link>
            </li>

            {/* Configurações */}
            <li>
              <Link to="/settings" className="waves-effect">
                <i className="bx bx-cog"></i>
                <span className="menu-item">{props.t("Configurações")}</span>
              </Link>
            </li>

            {/* Logout - positioned at bottom */}
            <li className="sidebar-menu-item-bottom">
              <Link to="/logout" className="waves-effect text-danger">
                <i className="bx bx-power-off"></i>
                <span className="menu-item">{props.t("Sair")}</span>
              </Link>
            </li>
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  );
};

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(SidebarContent));
