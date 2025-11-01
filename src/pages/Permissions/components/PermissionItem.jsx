import { Badge, Row, Col } from "reactstrap";
import PropTypes from "prop-types";

const PermissionItem = ({ permission }) => {
  if (!permission) {
    return null;
  }

  return (
    <div className="border rounded p-3 mb-2 permission-item">
      <Row className="align-items-center">
        <Col md={6}>
          <div>
            <h6 className="mb-1 text-primary">{permission.name || "N/A"}</h6>
            {permission.description && (
              <p className="mb-0 text-muted small">{permission.description}</p>
            )}
          </div>
        </Col>
        <Col md={3}>
          <div className="text-muted small">
            <span className="fw-bold">Ação:</span>{" "}
            <Badge color="info" className="ms-1">
              {permission.action || "N/A"}
            </Badge>
          </div>
        </Col>
        <Col md={3} className="text-end">
          <Badge color="secondary" className="ms-1">
            {permission.module || "N/A"}
          </Badge>
        </Col>
      </Row>
    </div>
  );
};

PermissionItem.propTypes = {
  permission: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    module: PropTypes.string,
    action: PropTypes.string,
  }),
};

export default PermissionItem;
