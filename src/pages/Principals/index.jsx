import React, { useState, useMemo } from "react";
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
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import useFetchPrincipals from "../../hooks/useFetchPrincipals";
import TableContainer from "../../components/Common/TableContainer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Principals = () => {
  const navigate = useNavigate();
  const { principals, loading, error, refetch } = useFetchPrincipals();
  const [deleteModal, setDeleteModal] = useState(false);
  const [currentPrincipal, setCurrentPrincipal] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const onClickDelete = (principal) => {
    setCurrentPrincipal(principal);
    setDeleteModal(true);
  };

  const handleViewPrincipal = (id) => {
    navigate(`/principals/${id}`);
    toast.info("Carregando perfil do diretor...");
  };

  const handleDeletePrincipal = async () => {
    if (!currentPrincipal || !currentPrincipal.id) {
      setDeleteModal(false);
      return;
    }

    try {
      setIsDeleting(true);
      // Implementar a lógica de exclusão de diretor aqui
      // await deletePrincipal(currentPrincipal.id);

      // Simulação de exclusão bem-sucedida
      setTimeout(() => {
        setIsDeleting(false);
        setDeleteModal(false);
        setCurrentPrincipal(null);
        toast.success("Diretor excluído com sucesso!");
        refetch(); // Recarregar a lista de diretores
      }, 1000);
    } catch (err) {
      setIsDeleting(false);
      console.error("Erro ao excluir o diretor:", err);
      toast.error(
        "Erro ao excluir o diretor: " + (err.message || "Erro desconhecido")
      );
    }
  };

  // Definir colunas para a tabela
  const columns = useMemo(
    () => [
      {
        header: "Nome",
        accessorKey: "personalInfo.name",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <Link
              to="#"
              onClick={() => handleViewPrincipal(cellProps.row.original.id)}
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
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return cellProps.row.original.professionalInfo?.registration || "N/A";
        },
      },
      {
        header: "Status",
        accessorKey: "personalInfo.phone",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return cellProps.row.original.personalInfo?.phone || "N/A";
        },
      },
      {
        header: "Ações",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (cellProps) => {
          return (
            <ul className="list-unstyled hstack gap-1 mb-0">
              <li>
                <Button
                  color="soft-primary"
                  className="btn btn-sm btn-soft-primary"
                  onClick={() => handleViewPrincipal(cellProps.row.original.id)}
                >
                  <i className="mdi mdi-eye-outline" />
                </Button>
              </li>

              <li>
                <Button
                  color="soft-danger"
                  className="btn btn-sm btn-soft-danger"
                  onClick={() => onClickDelete(cellProps.row.original)}
                >
                  <i className="mdi mdi-delete-outline" />
                </Button>
              </li>
            </ul>
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
          <Breadcrumbs
            title="Diretores"
            breadcrumbItem="Visualizar Diretores"
          />

          <Row>
            <Col lg="12">
              <Card>
                <CardBody className="border-bottom">
                  <div className="d-flex align-items-center">
                    <h5 className="mb-0 card-title flex-grow-1">
                      Lista de Diretores
                    </h5>
                    <div className="flex-shrink-0">
                      <Link
                        to="#!"
                        onClick={refetch}
                        className="btn btn-light me-1"
                      >
                        <i className="mdi mdi-refresh"></i>
                      </Link>
                      <UncontrolledDropdown className="dropdown d-inline-block me-1">
                        <DropdownToggle
                          type="menu"
                          className="btn btn-success"
                          id="dropdownMenuButton1"
                        >
                          <i className="mdi mdi-dots-vertical"></i>
                        </DropdownToggle>
                        <DropdownMenu>
                          <li>
                            <DropdownItem href="#">Exportar PDF</DropdownItem>
                          </li>
                          <li>
                            <DropdownItem href="#">Exportar Excel</DropdownItem>
                          </li>
                          <li>
                            <DropdownItem href="#">Imprimir</DropdownItem>
                          </li>
                        </DropdownMenu>
                      </UncontrolledDropdown>
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
                      <p className="mt-2">Carregando diretores...</p>
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
                      data={Array.isArray(principals) ? principals : []}
                      isCustomPageSize={true}
                      isGlobalFilter={true}
                      isJobListGlobalFilter={false}
                      isPagination={true}
                      SearchPlaceholder="Pesquisar por nome ou email..."
                      tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline mt-4 border-top"
                      pagination="pagination"
                      paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
                    />
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Modal de Exclusão */}
          <Modal
            isOpen={deleteModal}
            toggle={() => setDeleteModal(false)}
            centered={true}
            size="sm"
          >
            <ModalHeader toggle={() => setDeleteModal(false)}>
              Confirmar Exclusão
            </ModalHeader>
            <ModalBody>
              <p>
                Tem certeza que deseja excluir o diretor "
                {currentPrincipal?.personalInfo?.name}"?
              </p>
              <p className="text-danger mb-0">
                Esta ação não pode ser desfeita.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                onClick={handleDeletePrincipal}
                disabled={isDeleting}
              >
                {isDeleting ? "Excluindo..." : "Sim, Excluir"}
              </Button>
              <Button color="secondary" onClick={() => setDeleteModal(false)}>
                Cancelar
              </Button>
            </ModalFooter>
          </Modal>

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

export default Principals;
