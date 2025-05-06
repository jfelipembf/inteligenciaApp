import React, { useState, useMemo, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Input,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Form,
  FormGroup,
  Label,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useTeachersContext } from "../../contexts/TeachersContext";
import TableContainer from "../../components/Common/TableContainer";
import { STUDENT_STATUS_OPTIONS } from "../../constants";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Constantes para status de professor
const TEACHER_STATUS_OPTIONS = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
  { value: "Afastado", label: "Afastado" },
  { value: "Férias", label: "Férias" },
];

// Constantes para especialidades de professores (exemplo)
const SPECIALIZATION_OPTIONS = [
  { value: "Matemática", label: "Matemática" },
  { value: "Português", label: "Português" },
  { value: "Ciências", label: "Ciências" },
  { value: "História", label: "História" },
  { value: "Geografia", label: "Geografia" },
  { value: "Educação Física", label: "Educação Física" },
  { value: "Artes", label: "Artes" },
  { value: "Inglês", label: "Inglês" },
];

const Teachers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { teachers, loading, error, refetch } = useTeachersContext();
  const [deleteModal, setDeleteModal] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Função para extrair texto de um valor, lidando com objetos
  const getTextValue = (value) => {
    if (value === null || value === undefined) return "";
    if (typeof value === "object") {
      // Se for um objeto do react-select, use o label
      if (value.label !== undefined) return value.label;
      // Se for outro tipo de objeto, converta para string
      return JSON.stringify(value);
    }
    return String(value);
  };

  const onClickDelete = (teacher) => {
    setCurrentTeacher(teacher);
    setDeleteModal(true);
  };

  const handleViewTeacher = (id) => {
    navigate(`/teachers/${id}`);
    toast.info("Carregando perfil do professor...");
  };

  const handleEditTeacher = (id) => {
    navigate(`/edit-teacher/${id}`);
    toast.info("Carregando formulário de edição...");
  };

  const handleDeleteTeacher = async () => {
    if (!currentTeacher || !currentTeacher.id) {
      setDeleteModal(false);
      return;
    }

    try {
      setIsDeleting(true);
      // Implementar a lógica de exclusão de professor aqui
      // await deleteTeacher(currentTeacher.id);

      // Simulação de exclusão bem-sucedida
      setTimeout(() => {
        setIsDeleting(false);
        setDeleteModal(false);
        setCurrentTeacher(null);
        toast.success("Professor excluído com sucesso!");
        refetch(); // Recarregar a lista de professores
      }, 1000);
    } catch (err) {
      setIsDeleting(false);
      console.error("Erro ao excluir o professor:", err);
      toast.error(
        "Erro ao excluir o professor: " + (err.message || "Erro desconhecido")
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
              onClick={() => handleViewTeacher(cellProps.row.original.id)}
              className="text-body fw-bold"
            >
              {getTextValue(cellProps.row.original.personalInfo?.name) || "N/A"}
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
          return (
            getTextValue(
              cellProps.row.original.professionalInfo?.registration
            ) || "N/A"
          );
        },
      },
      {
        header: "Especialidade",
        accessorKey: "professionalInfo.specialization",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          const specialization = getTextValue(
            cellProps.row.original.professionalInfo?.specialization
          );
          return (
            <Badge color="info" className="badge-soft-info">
              {specialization || "N/A"}
            </Badge>
          );
        },
      },
      {
        header: "Departamento",
        accessorKey: "professionalInfo.department",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            getTextValue(cellProps.row.original.professionalInfo?.department) ||
            "N/A"
          );
        },
      },
      {
        header: "Status",
        accessorKey: "status",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          // Determinar status do professor (aleatório para demonstração)
          const id = cellProps.row.original.id || "";
          const statusIndex =
            id.length > 0
              ? id.charCodeAt(0) % TEACHER_STATUS_OPTIONS.length
              : 0;
          const status = TEACHER_STATUS_OPTIONS[statusIndex].value;
          const isActive = status === "Ativo";

          return (
            <Badge color={isActive ? "success" : "warning"}>{status}</Badge>
          );
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
                  onClick={() => handleViewTeacher(cellProps.row.original.id)}
                >
                  <i className="mdi mdi-eye-outline" />
                </Button>
              </li>

              <li>
                <Button
                  color="soft-info"
                  className="btn btn-sm btn-soft-info"
                  onClick={() => handleEditTeacher(cellProps.row.original.id)}
                >
                  <i className="mdi mdi-pencil-outline" />
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
            title="Professores"
            breadcrumbItem="Visualizar Professores"
          />

          <Row>
            <Col lg="12">
              <Card>
                <CardBody className="border-bottom">
                  <div className="d-flex align-items-center">
                    <h5 className="mb-0 card-title flex-grow-1">
                      Lista de Professores
                    </h5>
                    <div className="flex-shrink-0">
                      <Link to="/add-teacher" className="btn btn-primary me-1">
                        <i className="bx bx-plus me-1"></i> Novo Professor
                      </Link>
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
                      <p className="mt-2">Carregando professores...</p>
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
                      data={Array.isArray(teachers) ? teachers : []}
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
                Tem certeza que deseja excluir o professor "
                {getTextValue(currentTeacher?.personalInfo?.name)}"?
              </p>
              <p className="text-danger mb-0">
                Esta ação não pode ser desfeita.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                onClick={handleDeleteTeacher}
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

export default Teachers;
