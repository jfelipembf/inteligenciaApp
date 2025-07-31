import React, { useState, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Input,
  Table,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/Common/Breadcrumb";
import useFetchCoordinators from "../../hooks/useFetchCoordinators";
import TableContainer from "../../components/Common/TableContainer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Coordinators = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { coordinators, loading, error, refetch } = useFetchCoordinators();

  // Filtrar coordenadores com base no termo de pesquisa
  const filteredCoordinators = useMemo(() => {
    return coordinators.filter(
      (coordinator) =>
        coordinator.personalInfo?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        coordinator.professionalInfo?.registration
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        coordinator.professionalInfo?.department
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }, [coordinators, searchTerm]);

  // Definir colunas para a tabela
  const columns = useMemo(
    () => [
      {
        header: "Nome",
        accessorKey: "personalInfo.name",
        cell: (cellProps) => {
          return (
            <Link
              to={`/coordinators/${cellProps.row.original.id}`}
              className="text-body fw-bold"
            >
              {cellProps.row.original.personalInfo?.name || "N/A"}
            </Link>
          );
        },
      },
      {
        header: "Registro",
        accessorKey: "professionalInfo.registration",
        cell: (cellProps) => {
          return cellProps.row.original.professionalInfo?.registration || "N/A";
        },
      },
      {
        header: "Status",
        accessorKey: "professionalInfo.department",
        cell: (cellProps) => {
          return cellProps.row.original.professionalInfo?.department || "N/A";
        },
      },
      {
        header: "Ações",
        cell: (cellProps) => {
          return (
            <div className="d-flex align-items-center gap-2">
              <Button
                color="soft-primary"
                className="btn btn-sm btn-soft-primary"
                onClick={() =>
                  navigate(`/coordinators/${cellProps.row.original.id}`)
                }
              >
                <i className="mdi mdi-eye-outline" />
              </Button>
              <UncontrolledDropdown>
                <DropdownToggle
                  type="button"
                  className="btn btn-sm btn-soft-secondary"
                >
                  <i className="mdi mdi-dots-vertical" />
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem
                    onClick={() =>
                      toast.info(
                        `Exportar dados de ${cellProps.row.original.personalInfo?.name}`
                      )
                    }
                  >
                    Exportar Dados
                  </DropdownItem>
                  <DropdownItem
                    onClick={() =>
                      toast.warning(
                        `Excluir ${cellProps.row.original.personalInfo?.name}`
                      )
                    }
                  >
                    Excluir
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
          );
        },
      },
    ],
    [navigate]
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Breadcrumb */}
          <Breadcrumb title="Dashboard" breadcrumbItem="Coordenadores" />

          <Row>
            <Col lg="12">
              <Card>
                <CardBody className="border-bottom">
                  <div className="d-flex align-items-center justify-content-between">
                    <h5 className="mb-0 card-title">Lista de Coordenadores</h5>
                    <div className="d-flex gap-2">
                      <Button
                        color="light"
                        onClick={refetch}
                        className="btn btn-light"
                      >
                        <i className="mdi mdi-refresh"></i>
                      </Button>
                    </div>
                  </div>
                </CardBody>
                <CardBody>
                  {loading ? (
                    <div className="text-center my-4">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Carregando...</span>
                      </div>
                      <p className="mt-2">Carregando coordenadores...</p>
                    </div>
                  ) : error ? (
                    <div className="text-center my-4 text-danger">
                      <i className="bx bx-error-circle display-4"></i>
                      <p className="mt-2">Erro ao carregar dados: {error}</p>
                      <Button
                        color="primary"
                        onClick={refetch}
                        className="mt-2"
                      >
                        <i className="bx bx-refresh me-1"></i> Tentar Novamente
                      </Button>
                    </div>
                  ) : (
                    <TableContainer
                      columns={columns}
                      data={filteredCoordinators}
                      isCustomPageSize={true}
                      isGlobalFilter={true}
                      isJobListGlobalFilter={false}
                      isPagination={true}
                      SearchPlaceholder="Pesquisar por nome ou registro..."
                      tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline mt-4 border-top"
                      pagination="pagination"
                      paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
                    />
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Toast Container */}
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

export default Coordinators;
