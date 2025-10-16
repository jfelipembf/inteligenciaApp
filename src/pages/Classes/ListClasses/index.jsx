/* Importações principais do React e bibliotecas auxiliares*/
import React, { useState, useMemo, useCallback } from "react";

/*Componentes de reactstrap(estrutura e estilo)*/
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

/*Navegação e Breadcrumbs*/
import { Link, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import TableContainer from "../../../components/Common/TableContainer";
/*Contexto e Hooks personalizados*/
import { useClassContext } from "../../../contexts/ClassContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useDeleteClass from "../../../hooks/useDeleteClass";
import useUser from "../../../hooks/useUser";

/*Componente principal da página de listagem de turmas*/
const ListClasses = () => {
  const { userDetails } = useUser(true);
  const navigate = useNavigate();
  const { classes, loading, error, refetch } = useClassContext();
  /*Estados de controle da exclusão */
  const [deleteModal, setDeleteModal] = useState(false);
  const [currentClass, setCurrentClass] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteClass } = useDeleteClass(); /* Hook para exclusão de turma */

  /* Função para extrair texto de um valor */
  const getTextValue = (value) => {
    if (!value) return "";
    if (typeof value === "object" && value.label !== undefined)
      return value.label;
    if (typeof value === "object" && value.value !== undefined)
      return value.value;
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  /*Redireciona para detalhes da turma*/
  const handleViewClass = useCallback(
    (id) => {
      navigate(`/classes/${id}`);
      toast.info("Carregando detalhes da turma...");
    },
    [navigate]
  );

  /*Redireciona para a tela de edição da turma*/
  const handleEditClass = useCallback(
    (id) => {
      navigate(`/classes/${id}/edit`);
      toast.info("Carregando formulário de edição...");
    },
    [navigate]
  );

  /*Excecuta a exclusão da turma*/
  const onClickDelete = useCallback((classItem) => {
    setCurrentClass(classItem);
    setDeleteModal(true);
  }, []);

  const handleDeleteClass = async () => {
    if (!currentClass?.id) {
      setDeleteModal(false);
      return;
    }

    try {
      setIsDeleting(true);
      await deleteClass(currentClass.id, userDetails.schoolId);
      setIsDeleting(false);
      setDeleteModal(false);
      setCurrentClass(null);
      toast.success("Turma excluída com sucesso!");
      refetch(); /* Atualiza a lista de turmas */
    } catch (err) {
      setIsDeleting(false);
      toast.error(
        "Erro ao excluir a turma: " + (err.message || "Erro desconhecido")
      );
    }
  };

  /*Define cores para os badges de período*/
  const getPeriodColor = (period) =>
    ({
      Manhã: "primary",
      Tarde: "success",
      Noite: "info",
      Integral: "warning",
    }[period] || "secondary");

  /*Define cores para os badges de status*/
  const getStatusColor = (status) =>
    ({
      Ativo: "success",
      Inativo: "danger",
      Pendente: "warning",
    }[status] || "secondary");

  /*Colunas da tabela*/
  const columns = useMemo(
    () => [
      {
        header: "Série",
        accessorKey: "series",
        cell: (cellProps) => (
          <Link
            to="#"
            onClick={() => handleViewClass(cellProps.row.original.id)}
            className="text-body fw-bold"
          >
            {getTextValue(cellProps.row.original.series) || "N/A"}
          </Link>
        ),
      },
      {
        header: "Turma",
        accessorKey: "identifier",
        cell: (cellProps) => (
          <span>
            {getTextValue(cellProps.row.original.identifier) || "N/A"}
          </span>
        ),
      },
      {
        header: "Nível de Ensino",
        accessorKey: "educationLevel",
        cell: (cellProps) => (
          <span>
            {getTextValue(cellProps.row.original.educationLevel) || "N/A"}
          </span>
        ),
      },
      {
        header: "Período",
        accessorKey: "period",
        cell: (cellProps) => (
          <Badge
            color={getPeriodColor(getTextValue(cellProps.row.original.period))}
          >
            {getTextValue(cellProps.row.original.period) || "N/A"}
          </Badge>
        ),
      },
      {
        header: "Alunos",
        accessorKey: "studentCount",
        cell: (cellProps) => (
          <span>{cellProps.row.original.studentCount || 0}</span>
        ),
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (cellProps) => (
          <Badge
            color={getStatusColor(getTextValue(cellProps.row.original.status))}
          >
            {getTextValue(cellProps.row.original.status) || "N/A"}
          </Badge>
        ),
      },
      {
        header: "Ações",
        accessorKey: "actions",
        cell: (cellProps) => (
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
            {userDetails?.role !== "professor" && (
              <>
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
              </>
            )}
          </ul>
        ),
      },
    ],
    [handleViewClass, handleEditClass, onClickDelete]
  );

  /*Retorno do JSX*/
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Turmas" breadcrumbItem="Visualizar Turmas" />

          <Row>
            <Col lg="12">
              <Card>
                <CardBody className="border-bottom">
                  <div className="d-flex align-items-center">
                    <h5 className="mb-0 card-title flex-grow-1">
                      Lista de Turmas
                    </h5>
                    <div className="flex-shrink-0">
                      {userDetails?.role !== "professor" && (
                        <Link
                          to="/create-class"
                          className="btn btn-primary me-1"
                        >
                          <i className="bx bx-plus me-1"></i> Nova Turma
                        </Link>
                      )}
                      <Link
                        to="#!"
                        onClick={refetch}
                        className="btn btn-light me-1"
                      >
                        <i className="mdi mdi-refresh"></i>
                      </Link>
                      <UncontrolledDropdown className="dropdown d-inline-block me-1">
                        <DropdownToggle
                          type="button"
                          className="btn btn-success"
                          id="dropdownMenuButton1"
                        >
                          <i className="mdi mdi-dots-vertical"></i>
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem onClick={() => handleExport("pdf")}>
                            Exportar PDF
                          </DropdownItem>
                          <DropdownItem onClick={() => handleExport("excel")}>
                            Exportar Excel
                          </DropdownItem>
                          <DropdownItem onClick={() => handleExport("print")}>
                            Imprimir
                          </DropdownItem>
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
                      <p className="mt-2">Carregando turmas...</p>
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
                      data={Array.isArray(classes) ? classes : []}
                      isCustomPageSize={true}
                      isGlobalFilter={true}
                      isJobListGlobalFilter={false}
                    />
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Modal de Confirmação de Exclusão */}
          <Modal
            isOpen={deleteModal}
            toggle={() => setDeleteModal(false)}
            centered
          >
            <ModalHeader toggle={() => setDeleteModal(false)}>
              Confirmar Exclusão
            </ModalHeader>
            <ModalBody>
              <p>
                Tem certeza que deseja excluir a turma "
                {getTextValue(currentClass?.identifier)} -{" "}
                {getTextValue(currentClass?.series)}"?
              </p>
              <p className="text-danger mb-0">
                Esta ação não pode ser desfeita.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="light" onClick={() => setDeleteModal(false)}>
                Cancelar
              </Button>
              <Button
                color="danger"
                onClick={handleDeleteClass}
                disabled={isDeleting}
              >
                {isDeleting ? "Excluindo..." : "Excluir"}
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
      <ToastContainer />
    </React.Fragment>
  );
};

export default ListClasses;
