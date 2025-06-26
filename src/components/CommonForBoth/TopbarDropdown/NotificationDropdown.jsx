import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  Row,
  Col,
  Button,
} from "reactstrap";
import SimpleBar from "simplebar-react";
import { withTranslation } from "react-i18next";
import useUserUnreadAlerts from "../../../hooks/useUnreadAlerts";

const NotificationDropdown = (props) => {
  const [menu, setMenu] = useState(false);
  const { alerts, loading, markAlertAsRead } = useUserUnreadAlerts();

  // Remove alert da lista ao marcar como lido
  const handleMarkAsRead = async (alertId) => {
    await markAlertAsRead(alertId);
    // O hook deve atualizar a lista automaticamente após marcar como lido
  };

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="dropdown d-inline-block"
        tag="li"
      >
        <DropdownToggle
          className="btn header-item noti-icon position-relative"
          tag="button"
          id="page-header-notifications-dropdown"
        >
          <i
            className={`bx bx-bell${
              alerts && alerts.length > 0 ? " bx-tada" : ""
            } text-primary`}
          />
          {alerts && alerts.length > 0 && (
            <span className="badge bg-danger rounded-pill">
              {alerts.length}
            </span>
          )}
        </DropdownToggle>

        <DropdownMenu className="dropdown-menu dropdown-menu-lg p-0 dropdown-menu-end">
          <div className="p-3">
            <Row className="align-items-center">
              <Col>
                <h6 className="m-0"> {props.t("Notifications")} </h6>
              </Col>
              <div className="col-auto">
                <Link to="/notifications" className="small">
                  {props.t("View All")}
                </Link>
              </div>
            </Row>
          </div>

          <SimpleBar style={{ height: "230px" }}>
            {loading ? (
              <div className="text-center py-4">Carregando...</div>
            ) : alerts && alerts.length > 0 ? (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="text-reset notification-item d-flex align-items-start justify-content-between px-3 py-2"
                >
                  <div className="flex-grow-1">
                    <h6 className="mt-0 mb-1">
                      {alert.title || "Notificação"}
                    </h6>
                    <div className="font-size-12 text-muted">
                      <p className="mb-1">{alert.message}</p>
                      {/* Exiba data/hora se desejar */}
                    </div>
                  </div>
                  <Button
                    close
                    aria-label="Fechar"
                    onClick={() => handleMarkAsRead(alert.id)}
                    style={{ fontSize: 16, marginLeft: 8 }}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted">
                Sem novas notificações
              </div>
            )}
          </SimpleBar>
          <div className="p-2 border-top d-grid">
            <Link
              className="btn btn-sm btn-link font-size-14 btn-block text-center"
              to="/notifications"
            >
              <i className="mdi mdi-arrow-right-circle me-1"></i>
              {props.t("View all")}
            </Link>
          </div>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default withTranslation()(NotificationDropdown);

NotificationDropdown.propTypes = {
  t: PropTypes.any,
};
