import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import withRouter from "../Common/withRouter";

//i18n
import { withTranslation } from "react-i18next";
import SidebarContent from "./SidebarContent";

import { Link } from "react-router-dom";

// Importar as logos
import logoWhite from "../../assets/images/logoWhite.png";
import inteliIcon from "../../assets/images/inteli_icon.png";
import inteliLogo from "../../assets/images/inteliLogo.png";

const Sidebar = (props) => {
  // Estado para controlar se o menu está colapsado
  const [isMenuCollapsed, setIsMenuCollapsed] = React.useState(
    document.body.classList.contains("vertical-collpsed")
  );

  // Atualizar o estado quando a classe mudar
  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      const bodyElement = document.body;
      if (bodyElement) {
        const isCollapsed = bodyElement.classList.contains("vertical-collpsed");
        if (isCollapsed !== isMenuCollapsed) {
          setIsMenuCollapsed(isCollapsed);
        }
      }
    });

    observer.observe(document.body, { attributes: true });

    return () => observer.disconnect();
  }, [isMenuCollapsed]);

  {
    /*React.useEffect(() => {
    document.body.setAttribute("data-sidebar-image", "img5");
    return () => {
      document.body.removeAttribute("data-sidebar-image");
    };
  }, []);*/
  }

  return (
    <React.Fragment>
      <div className="vertical-menu">
        <div data-simplebar className="h-100">
          <div
            className="navbar-brand-box"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px 0",
            }}
          >
            {isMenuCollapsed ? (
              <Link to="/" className="logo">
                <span style={{ display: "flex", justifyContent: "center" }}>
                  <img src={inteliIcon} alt="Inteli" height="24" />
                </span>
              </Link>
            ) : (
              // Quando o menu estiver aberto
              <Link to="/" className="logo">
                <span>
                  <img src={logoWhite} alt="Inteli" height="40" />
                </span>
              </Link>
            )}
          </div>
          {props.type !== "condensed" ? <SidebarContent /> : <SidebarContent />}
        </div>

        <div className="sidebar-background"></div>
      </div>
    </React.Fragment>
  );
};

Sidebar.propTypes = {
  type: PropTypes.string,
};

const mapStatetoProps = (state) => {
  return {
    layout: state.Layout,
  };
};
export default connect(
  mapStatetoProps,
  {}
)(withRouter(withTranslation()(Sidebar)));
