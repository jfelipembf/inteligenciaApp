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

            {/* Dashboard */}
            <li>
              <Link to="/dashboard" className="waves-effect">
                <i className="bx bx-home-circle font-size-18"></i>
                <span className="menu-item">{props.t("Dashboard")}</span>
              </Link>
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
                <i className="bx bx-user-circle font-size-18"></i>
                <span className="menu-item">{props.t("Alunos")}</span>
              </Link>
            </li>

            {/* Calendário */}
            <li>
              <Link to="/calendar" className="waves-effect">
                <i className="bx bx-calendar font-size-18"></i>
                <span className="menu-item">{props.t("Calendário")}</span>
              </Link>
            </li>

            {/* Professores */}
            <li>
              <Link to="/teachers" className="waves-effect">
                <i className="bx bx-user-voice font-size-18"></i>
                <span className="menu-item">{props.t("Professores")}</span>
              </Link>
            </li>

            {/* Coordenadores */}
            <li>
              <Link to="/coordinators" className="waves-effect">
                <i className="bx bx-user-check font-size-18"></i>
                <span className="menu-item">{props.t("Coordenadores")}</span>
              </Link>
            </li>

            {/* Administradores */}
            <li>
              <Link to="/administrators" className="waves-effect">
                <i className="bx bx-user-circle font-size-18"></i>
                <span className="menu-item">{props.t("Administradores")}</span>
              </Link>
            </li>

            {/* Logout - positioned at bottom */}
            <li style={{ position: "absolute", bottom: "20px", width: "100%" }}>
              <Link to="/logout" className="waves-effect text-danger">
                <i className="bx bx-power-off font-size-18"></i>
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
