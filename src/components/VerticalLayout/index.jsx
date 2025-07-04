import PropTypes from "prop-types";
import React, { useEffect } from "react";
import withRouter from "../Common/withRouter";
import {
  changeLayout,
  changeLayoutMode,
  changeSidebarTheme,
  changeSidebarThemeImage,
  changeSidebarType,
  changeTopbarTheme,
  changeLayoutWidth,
  showRightSidebarAction,
} from "/src/store/actions";
import { useLocation } from "react-router-dom";
import useUser from "../../hooks/useUser";
import NotificationDropdown from "../CommonForBoth/TopbarDropdown/NotificationDropdown";
import useUserAvatar from "../../hooks/useUserAvatar";
import PersonCircle from "react-bootstrap-icons/dist/icons/person-circle";
import { useNavigate } from "react-router-dom";

// import { FiBell } from "react-icons/fi";

// Layout Related Components
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import RightSidebar from "../CommonForBoth/RightSidebar";
// import MenuLateralRosa from "../MenuLateralRosa";
import PinkSidebar from "../PinkSidebar";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";

const Layout = (props) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isHome = location.pathname === "/home";
  const navigate = useNavigate();

  const isLoginPage = location.pathname === "/login";

  // Funções para navegação segura
  const handleBack = () => {
    if (!isLoginPage) navigate(-1);
  };
  const handleForward = () => {
    if (!isLoginPage) navigate(1);
  };

  const { userDetails } = useUser();
  const avatarUrl = useUserAvatar(userDetails, userDetails?.schoolId);
  const userEmail = userDetails?.personalInfo.email || "";

  const selectLayoutProperties = createSelector(
    (state) => state.Layout,
    (layout) => ({
      isPreloader: layout.isPreloader,
      layoutModeType: layout.layoutModeType,
      leftSideBarThemeImage: layout.leftSideBarThemeImage,
      leftSideBarType: layout.leftSideBarType,
      layoutWidth: layout.layoutWidth,
      topbarTheme: layout.topbarTheme,
      showRightSidebar: layout.showRightSidebar,
      leftSideBarTheme: layout.leftSideBarTheme,
    })
  );

  const {
    isPreloader,
    leftSideBarThemeImage,
    layoutWidth,
    leftSideBarType,
    topbarTheme,
    showRightSidebar,
    leftSideBarTheme,
    layoutModeType,
  } = useSelector(selectLayoutProperties);

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const toggleMenuCallback = () => {
    if (leftSideBarType === "default") {
      dispatch(changeSidebarType("condensed", isMobile));
    } else if (leftSideBarType === "condensed") {
      dispatch(changeSidebarType("default", isMobile));
    }
  };

  //hides right sidebar on body click
  const hideRightbar = (event) => {
    var rightbar = document.getElementById("right-bar");
    //if clicked in inside right bar, then do nothing
    if (rightbar && rightbar.contains(event.target)) {
      return;
    } else {
      //if clicked in outside of rightbar then fire action for hide rightbar
      dispatch(showRightSidebarAction(false));
    }
  };

  /*
  layout  settings
  */

  useEffect(() => {
    //init body click event fot toggle rightbar
    document.body.addEventListener("click", hideRightbar, true);

    if (isPreloader === true) {
      document.getElementById("preloader").style.display = "block";
      document.getElementById("status").style.display = "block";

      setTimeout(function () {
        document.getElementById("preloader").style.display = "none";
        document.getElementById("status").style.display = "none";
      }, 2500);
    } else {
      document.getElementById("preloader").style.display = "none";
      document.getElementById("status").style.display = "none";
    }
  }, [isPreloader]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    dispatch(changeLayout("vertical"));
  }, [dispatch]);

  useEffect(() => {
    if (leftSideBarTheme) {
      dispatch(changeSidebarTheme(leftSideBarTheme));
    }
  }, [leftSideBarTheme, dispatch]);

  useEffect(() => {
    if (layoutModeType) {
      dispatch(changeLayoutMode(layoutModeType));
    }
  }, [layoutModeType, dispatch]);

  useEffect(() => {
    if (leftSideBarThemeImage) {
      dispatch(changeSidebarThemeImage(leftSideBarThemeImage));
    }
  }, [leftSideBarThemeImage, dispatch]);

  useEffect(() => {
    if (layoutWidth) {
      dispatch(changeLayoutWidth(layoutWidth));
    }
  }, [layoutWidth, dispatch]);

  useEffect(() => {
    if (leftSideBarType) {
      dispatch(changeSidebarType(leftSideBarType));
    }
  }, [leftSideBarType, dispatch]);

  useEffect(() => {
    if (topbarTheme) {
      dispatch(changeTopbarTheme(topbarTheme));
    }
  }, [topbarTheme, dispatch]);

  return (
    <React.Fragment>
      <div id="preloader">
        <div id="status">
          <div className="spinner-chase">
            <div className="chase-dot" />
            <div className="chase-dot" />
            <div className="chase-dot" />
            <div className="chase-dot" />
            <div className="chase-dot" />
            <div className="chase-dot" />
          </div>
        </div>
      </div>

      <div id="layout-wrapper">
        <div className="main-flex-wrapper">
          <PinkSidebar />
          <Sidebar />
          <div className="main-content-wrapper">
            <div className="main-content">
              <div className="welcome-bar">
                <div className="welcome-bar-top">
                  <div className="welcome-badge">
                    Bem vindo, ao Inteligência!
                  </div>
                  <div className="welcome-user-info">
                    <NotificationDropdown />
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        gap: 8,
                      }}
                      onClick={() => navigate("/profile")}
                      title="Ir para o perfil"
                    >
                      <div className="welcome-avatar">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt="Avatar do usuário"
                            className="welcome-avatar"
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <PersonCircle size={55} color="#f7f7fa" />
                        )}
                      </div>
                      <span className="welcome-email">{userEmail}</span>
                    </span>
                  </div>
                </div>
                {/* Botões de navegação abaixo, alinhados à esquerda */}
                {/* Fora do escopo por enquanto */}
                {/*
                <div
                  className="welcome-nav-btns d-flex flex-row align-items-center"
                  style={{ gap: 8, marginTop: 0 }}
                >
                  <button
                    onClick={handleBack}
                    className="btn btn-light"
                    title="Voltar"
                    disabled={isLoginPage}
                    style={{
                      color: isLoginPage ? "#ccc" : "#a18cd1",
                      cursor: isLoginPage ? "not-allowed" : "pointer",
                    }}
                  >
                    <i className="bx bx-chevron-left"></i>
                  </button>
                  <button
                    onClick={handleForward}
                    className="btn btn-light"
                    title="Avançar"
                    disabled={isLoginPage}
                    style={{
                      color: isLoginPage ? "#ccc" : "#a18cd1",
                      cursor: isLoginPage ? "not-allowed" : "pointer",
                    }}
                  >
                    <i className="bx bx-chevron-right"></i>
                  </button>
                </div>
                */}
              </div>
              <div className="main-content-scrollable">{props.children}</div>
            </div>
          </div>
        </div>
        {/* <Footer /> */}
      </div>
      {showRightSidebar ? <RightSidebar /> : null}
    </React.Fragment>
  );
};

Layout.propTypes = {
  changeLayoutWidth: PropTypes.func,
  changeSidebarTheme: PropTypes.func,
  changeSidebarThemeImage: PropTypes.func,
  changeSidebarType: PropTypes.func,
  changeTopbarTheme: PropTypes.func,
  // children: PropTypes.object,
  isPreloader: PropTypes.any,
  layoutWidth: PropTypes.any,
  leftSideBarTheme: PropTypes.any,
  leftSideBarThemeImage: PropTypes.any,
  leftSideBarType: PropTypes.any,
  location: PropTypes.object,
  showRightSidebar: PropTypes.any,
  topbarTheme: PropTypes.any,
};

export default withRouter(Layout);
