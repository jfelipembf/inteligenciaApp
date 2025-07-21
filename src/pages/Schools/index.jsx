import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Spinner,
  Table,
} from "reactstrap";
import Breadcrumb from "../../components/Common/Breadcrumb";
import { getFirebaseBackend } from "../../helpers/firebase_helper";
import TableContainer from "../../components/Common/TableContainer";
import { Link, useNavigate, useLocation } from "react-router-dom";
import classnames from "classnames";
import axios from "axios";
import useSchools from "../../hooks/useSchools";

// Adicione estes estilos CSS no topo do arquivo
const checkboxStyle = {
  ".form-check-input:checked": {
    backgroundColor: "#556ee6",
    borderColor: "#556ee6",
  },
  ".form-check-input:focus": {
    borderColor: "#556ee6",
    boxShadow: "0 0 0 0.15rem rgba(85, 110, 230, 0.25)",
  },
};

const Schools = () => {
  document.title = "Escolas | InteliTec";
  const navigate = useNavigate();
  const location = useLocation();

  // Usar o hook para buscar escolas
  const { schools, loading, error } = useSchools();

  const [modal, setModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedSchools, setSelectedSchools] = useState([]);
  const [activeTab, setActiveTab] = useState("1");

  const isCreatingSchool = location.pathname === "/schools/new";

  const toggle = () => setModal(!modal);

  const handleSelectSchool = React.useCallback((schoolId) => {
    setSelectedSchools((prev) => {
      const isSelected = prev.includes(schoolId);
      return isSelected
        ? prev.filter((id) => id !== schoolId)
        : [...prev, schoolId];
    });
  }, []);

  const handleSelectAll = React.useCallback(
    (checked) => {
      if (checked) {
        const allIds = schools.map((school) => school.id);
        setSelectedSchools(allIds);
      } else {
        setSelectedSchools([]);
      }
    },
    [schools]
  );

  const columns = useMemo(
    () => [
      {
        header: "Nome da Escola",
        accessorKey: "name",
        cell: (cellProps) => {
          const schoolName =
            cellProps.row.original.name || "Nome não disponível";
          return (
            <div className="d-flex align-items-center">
              <div className="font-size-14 mb-1">
                <Link to="#" className="text-dark">
                  {schoolName}
                </Link>
              </div>
            </div>
          );
        },
      },
      {
        header: "Cidade/UF",
        cell: (cellProps) => {
          const addressInfo = cellProps.row.original.addressInfo;
          if (!addressInfo) return "-";
          return `${addressInfo.city}/${addressInfo.state}`;
        },
      },
      {
        header: "Detalhes",
        cell: (cellProps) => {
          const schoolId = cellProps.row.original.id;
          return (
            <Button
              type="button"
              color="primary"
              className="btn-sm"
              onClick={() => {
                navigate(`/schools/${schoolId}`);
              }}
            >
              Ver Detalhes
            </Button>
          );
        },
      },
    ],
    [schools, selectedSchools, handleSelectAll, handleSelectSchool, navigate]
  );

  if (loading) {
    return (
      <div className="page-content">
        <Container fluid>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "70vh",
            }}
          >
            <Spinner
              style={{ width: "3rem", height: "3rem" }}
              color="primary"
            />
            <p className="mt-3 text-muted">Carregando dados...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content">
        <Container fluid>
          <div className="text-center my-4 text-danger">
            <i className="bx bx-error-circle display-4"></i>
            <p className="mt-2">Erro ao carregar dados: {error}</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <style>
            {`
              .form-check-input:checked {
                background-color: #556ee6 !important;
                border-color: #556ee6 !important;
              }
              .form-check-input:focus {
                border-color: #556ee6;
                box-shadow: 0 0 0 0.15rem rgba(85, 110, 230, 0.25);
              }
            `}
          </style>
          <Breadcrumb title="InteliTec" breadcrumbItem="Escolas" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div className="d-flex flex-wrap align-items-center justify-content-between mb-4">
                    <h5 className="card-title me-2">Escolas</h5>
                    {selectedSchools.length > 0 && (
                      <div className="d-flex align-items-center">
                        <span className="me-3">
                          {selectedSchools.length} escola(s) selecionada(s)
                        </span>
                        <Button color="primary" size="sm" className="me-2">
                          <i className="bx bx-export me-1"></i> Exportar
                        </Button>
                        <Button color="danger" size="sm">
                          <i className="bx bx-trash me-1"></i> Excluir
                        </Button>
                      </div>
                    )}
                  </div>
                  <TableContainer
                    columns={columns}
                    data={schools}
                    isGlobalFilter={true}
                    customPageSize={10}
                    className="custom-header-css"
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Schools;
