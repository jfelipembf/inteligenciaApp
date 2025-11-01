import React, { useEffect, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Spinner,
  Alert,
  Input,
  InputGroup,
} from "reactstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { usePermissions } from "../../hooks/permissions/permissions.jsx";
import PermissionModule from "./components/PermissionModule";

const Permissions = () => {
  document.title = "Permissões | InteliTec";

  const {
    permissions,
    permissionsByModule,
    loading,
    error,
    loadAllPermissions,
  } = usePermissions();

  const [searchTerm, setSearchTerm] = React.useState("");
  const [hasLoaded, setHasLoaded] = React.useState(false);

  useEffect(() => {
    if (!hasLoaded && !loading && permissions.length === 0) {
      setHasLoaded(true);
      loadAllPermissions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasLoaded, loading, permissions.length]);

  const filteredPermissionsByModule = useMemo(() => {
    if (!searchTerm.trim()) {
      return permissionsByModule;
    }

    const filtered = {};
    const searchLower = searchTerm.toLowerCase();

    Object.keys(permissionsByModule).forEach((module) => {
      const modulePermissions = permissionsByModule[module].filter(
        (permission) => {
          const name = (permission.name || "").toLowerCase();
          const description = (permission.description || "").toLowerCase();
          const action = (permission.action || "").toLowerCase();
          const moduleName = (permission.module || "").toLowerCase();

          return (
            name.includes(searchLower) ||
            description.includes(searchLower) ||
            action.includes(searchLower) ||
            moduleName.includes(searchLower)
          );
        }
      );

      if (modulePermissions.length > 0) {
        filtered[module] = modulePermissions;
      }
    });

    return filtered;
  }, [permissionsByModule, searchTerm]);

  const totalFiltered = useMemo(() => {
    return Object.values(filteredPermissionsByModule).reduce(
      (sum, perms) => sum + perms.length,
      0
    );
  }, [filteredPermissionsByModule]);

  const sortedModules = useMemo(() => {
    return Object.keys(filteredPermissionsByModule).sort();
  }, [filteredPermissionsByModule]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Permissões"
            breadcrumbItem="Lista de Permissões"
          />

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <CardTitle tag="h4" className="mb-0">
                      Permissões do Sistema
                    </CardTitle>
                    <div className="d-flex align-items-center gap-2">
                      <span className="text-muted">
                        {loading ? (
                          <Spinner size="sm" color="primary" />
                        ) : (
                          `${totalFiltered} permissão${
                            totalFiltered !== 1 ? "ões" : ""
                          }`
                        )}
                      </span>
                    </div>
                  </div>

                  <Row className="mb-4">
                    <Col md={6}>
                      <InputGroup>
                        <Input
                          type="text"
                          placeholder="Buscar permissões por nome, descrição, ação ou módulo..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="form-control"
                        />
                      </InputGroup>
                    </Col>
                  </Row>

                  {loading && (
                    <div className="text-center py-5">
                      <Spinner color="primary" />
                      <p className="mt-2 text-muted">
                        Carregando permissões...
                      </p>
                    </div>
                  )}

                  {error && (
                    <Alert color="danger" className="mb-4">
                      <strong>Erro:</strong> {error}
                      <br />
                      <button
                        className="btn btn-sm btn-outline-danger mt-2"
                        onClick={loadAllPermissions}
                      >
                        Tentar novamente
                      </button>
                    </Alert>
                  )}

                  {!loading && !error && (
                    <>
                      {sortedModules.length === 0 ? (
                        <Alert color="info" className="text-center">
                          {searchTerm.trim()
                            ? "Nenhuma permissão encontrada com o termo buscado."
                            : "Nenhuma permissão cadastrada no sistema."}
                        </Alert>
                      ) : (
                        <div>
                          {sortedModules.map((module, index) => (
                            <PermissionModule
                              key={module}
                              moduleName={module}
                              permissions={filteredPermissionsByModule[module]}
                              defaultOpen={index === 0}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>

          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Permissions;
