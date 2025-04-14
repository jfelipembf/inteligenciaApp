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
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import TableContainer from "../../../components/Common/TableContainer";
import useFetchClasses from "../../../hooks/useFetchClasses";
import { EDUCATION_LEVELS, ALL_SCHOOL_YEARS, SCHOOL_YEAR_STATUS } from "../../../constants/schoolYear";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Constantes para período
const PERIOD_OPTIONS = [
  { value: "Manhã", label: "Manhã", color: "primary" },
  { value: "Tarde", label: "Tarde", color: "success" },
  { value: "Noite", label: "Noite", color: "info" },
  { value: "Integral", label: "Integral", color: "warning" },
];

// Constantes para status
const CLASS_STATUS_OPTIONS = [
  { value: "Ativo", label: "Ativo", color: "success" },
  { value: "Inativo", label: "Inativo", color: "danger" },
  { value: "Pendente", label: "Pendente", color: "warning" },
];

const ListClasses = () => {
  const navigate = useNavigate();
  const { classes, loading, error, refetch } = useFetchClasses();
  const [deleteModal, setDeleteModal] = useState(false);
  const [currentClass, setCurrentClass] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Função para extrair texto de um valor, lidando com objetos
  const getTextValue = (value) => {
    if (value === null || value === undefined) return "";
    
    // Se for um objeto com propriedade label (react-select)
    if (typeof value === "object" && value.label !== undefined) {
      return value.label;
    }
    
    // Se for um objeto com propriedade value (react-select)
    if (typeof value === "object" && value.value !== undefined) {
      return value.value;
    }
    
    // Se for outro tipo de objeto, converta para string
    if (typeof value === "object") {
      return JSON.stringify(value);
    }
    
    return String(value);
  };

  const onClickDelete = (classItem) => {
    setCurrentClass(classItem);
    setDeleteModal(true);
  };

  const handleViewClass = (id) => {
    navigate(`/classes/${id}`);
    toast.info("Carregando detalhes da turma...");
  };

  const handleEditClass = (id) => {
    navigate(`/classes/${id}/edit`);
    toast.info("Carregando formulário de edição...");
  };

  const handleDeleteClass = async () => {
    if (!currentClass || !currentClass.id) {
      setDeleteModal(false);
      return;
    }

    try {
      setIsDeleting(true);
      // Implementar a lógica de exclusão de turma aqui
      // await deleteClass(currentClass.id);
      
      // Simulação de exclusão bem-sucedida
      setTimeout(() => {
        setIsDeleting(false);
        setDeleteModal(false);
        setCurrentClass(null);
        toast.success("Turma excluída com sucesso!");
        refetch(); // Recarregar a lista de turmas
      }, 1000);
    } catch (err) {
      setIsDeleting(false);
      console.error("Erro ao excluir a turma:", err);
      toast.error("Erro ao excluir a turma: " + (err.message || "Erro desconhecido"));
    }
  };

  // Função para obter a cor do período
  const getPeriodColor = (period) => {
    const periodMap = {
      "Manhã": "primary",
      "Tarde": "success",
      "Noite": "info",
      "Integral": "warning"
    };
    
    return periodMap[period] || "secondary";
  };

  // Função para obter a cor do status
  const getStatusColor = (status) => {
    const statusMap = {
      "Ativo": "success",
      "Inativo": "danger",
      "Pendente": "warning"
    };
    
    return statusMap[status] || "secondary";
  };

  // Definir colunas para a tabela
  const columns = useMemo(
    () => [
      {
        header: "Série",
        accessorKey: "series",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          const series = cellProps.row.original.series;
          const seriesText = series ? getTextValue(series) : "N/A";
          return (
            <Link 
              to="#" 
              onClick={() => handleViewClass(cellProps.row.original.id)}
              className="text-body fw-bold"
            >
              {seriesText}
            </Link>
          );
        }
      },
      {
        header: "Turma",
        accessorKey: "identifier",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          const identifier = cellProps.row.original.identifier;
          const identifierText = identifier ? getTextValue(identifier) : "N/A";
          return (
            <span>
              {identifierText}
            </span>
          );
        }
      },
      {
        header: "Nível de Ensino",
        accessorKey: "educationLevel",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          const educationLevel = cellProps.row.original.educationLevel;
          const educationLevelText = educationLevel ? getTextValue(educationLevel) : "N/A";
          return (
            <span>
              {educationLevelText}
            </span>
          );
        }
      },
      {
        header: "Período",
        accessorKey: "period",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          const period = cellProps.row.original.period;
          const periodText = period ? getTextValue(period) : "N/A";
          const periodColor = getPeriodColor(periodText);
          
          return (
            <Badge
              color={periodColor}
            >
              {periodText}
            </Badge>
          );
        }
      },
      {
        header: "Alunos",
        accessorKey: "studentCount",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <span>
              {cellProps.row.original.studentCount || 0}
            </span>
          );
        }
      },
      {
        header: "Status",
        accessorKey: "status",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          const status = getTextValue(cellProps.row.original.status);
          const statusColor = getStatusColor(status);
          
          return (
            <Badge
              color={statusColor}
            >
              {status || "N/A"}
            </Badge>
          );
        }
      },
      {
        header: "Ações",
        accessorKey: "actions",
        disableSortBy: true,
        enableColumnFilter: false,
        enableSorting: false,
        cell: (cellProps) => {
          return (
            <ul className="list-unstyled hstack gap-1 mb-0">
              <li>
                <Button
                  color="soft-primary"
                  className="btn btn-sm btn-soft-primary"
                  onClick={() => handleViewClass(cellProps.row.original.id)}
                >
                  <i className="mdi mdi-eye-outline" />
                </Button>
              </li>

              <li>
                <Button
                  color="soft-info"
                  className="btn btn-sm btn-soft-info"
                  onClick={() => handleEditClass(cellProps.row.original.id)}
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
    [handleViewClass, handleEditClass, onClickDelete]
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Breadcrumb */}
          <Breadcrumbs title="Turmas" breadcrumbItem="Visualizar Turmas" />

          <Row>
            <Col lg="12">
              <Card>
                <CardBody className="border-bottom">
                  <div className="d-flex align-items-center">
                    <h5 className="mb-0 card-title flex-grow-1">Lista de Turmas</h5>
                    <div className="flex-shrink-0">
                      <Link
                        to="/create-class"
                        className="btn btn-primary me-1"
                      >
                        <i className="bx bx-plus me-1"></i> Nova Turma
                      </Link>
                      <Link to="#!" onClick={refetch} className="btn btn-light me-1">
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
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Carregando...</span>
                      </div>
                      <p className="mt-2">Carregando turmas...</p>
                    </div>
                  ) : error ? (
                    <div className="text-center my-4 text-danger">
                      <i className="bx bx-error-circle display-4"></i>
                      <p className="mt-2">Erro ao carregar dados: {error}</p>
                      <Button color="primary" onClick={refetch} className="mt-2">
                        <i className="bx bx-refresh me-1"></i> Tentar Novamente
                      </Button>
                    </div>
                  ) : (
                    <TableContainer
                      columns={columns}
                      data={Array.isArray(classes) ? classes : []}
                      isCustomPageSize={true}
                      isGlobalFilter={true}
                      isJobListGlobalFilter={false}
                      isPagination={true}
                      SearchPlaceholder="Pesquisar por série, turma..."
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
          <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)} centered={true} size="sm">
            <ModalHeader toggle={() => setDeleteModal(false)}>Confirmar Exclusão</ModalHeader>
            <ModalBody>
              <p>Tem certeza que deseja excluir a turma "{getTextValue(currentClass?.identifier)} - {getTextValue(currentClass?.series)}"?</p>
              <p className="text-danger mb-0">Esta ação não pode ser desfeita.</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onClick={handleDeleteClass} disabled={isDeleting}>
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

export default ListClasses;
