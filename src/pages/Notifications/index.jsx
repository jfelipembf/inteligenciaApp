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
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TableContainer from "../../components/Common/TableContainer";
import { useNotificationsContext } from "../../contexts/NotificationsContext";

// Função utilitária para extrair texto de valores que podem ser objetos
const getTextValue = (value) => {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") {
    if (value.label !== undefined) return value.label;
    return JSON.stringify(value);
  }
  return String(value);
};

// Constantes para status de notificação
const NOTIFICATION_STATUS_OPTIONS = [
  { value: "Enviada", label: "Enviada", color: "success" },
  { value: "Agendada", label: "Agendada", color: "primary" },
  { value: "Falha", label: "Falha", color: "danger" },
];

// Dados de exemplo para notificações
const SAMPLE_NOTIFICATIONS = [
  {
    id: "not001",
    title: "Reunião de Pais e Mestres",
    message:
      "Informamos que a reunião de pais e mestres ocorrerá no próximo sábado às 9h.",
    target: { type: "Turmas", value: ["1º Ano A", "1º Ano B"] },
    sentBy: "Maria Silva",
    sentDate: "2025-04-10T14:30:00",
    status: "Enviada",
  },
  {
    id: "not002",
    title: "Alteração no Calendário Escolar",
    message:
      "Informamos que o dia 20/05 será feriado escolar devido ao dia do professor.",
    target: { type: "Escola", value: "Todos" },
    sentBy: "João Diretor",
    sentDate: "2025-04-05T10:15:00",
    status: "Enviada",
  },
  {
    id: "not003",
    title: "Aula de Reforço de Matemática",
    message:
      "Haverá aula de reforço de matemática na próxima terça-feira às 14h.",
    target: { type: "Série", value: "3º Ano" },
    sentBy: "Carlos Matemática",
    sentDate: "2025-04-12T08:45:00",
    status: "Enviada",
  },
  {
    id: "not004",
    title: "Aviso sobre Uniforme",
    message:
      "Lembramos que o uso do uniforme completo é obrigatório a partir de segunda-feira.",
    target: { type: "Turno", value: "Matutino" },
    sentBy: "Ana Coordenadora",
    sentDate: "2025-04-08T16:20:00",
    status: "Enviada",
  },
  {
    id: "not005",
    title: "Entrega de Boletins",
    message:
      "Os boletins do primeiro bimestre estarão disponíveis na secretaria a partir de amanhã.",
    target: { type: "Pessoa", value: "Maria Aluna" },
    sentBy: "Pedro Secretário",
    sentDate: "2025-04-13T11:30:00",
    status: "Agendada",
  },
];

const NotificationsList = () => {
  const navigate = useNavigate();
  const {
    receivedNotifications: notifications,
    loading,
    error,

    fetchReceivedNotifications: fetchNotifications,
    resetReceivedNotifications: resetNotifications,
    sentNotifications,

    hasMoreSent,
    hasMoreReceived,
    fetchSentNotifications,

    resetSentNotifications,

    fetchNotificationById,
  } = useNotificationsContext();

  const [deleteModal, setDeleteModal] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    resetNotifications();
    fetchNotifications(true);
  }, []);

  // Função para formatar data
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR");
  };

  // Função para obter a descrição do público-alvo
  const getTargetDescription = (target) => {
    if (!target) return "N/A";

    switch (target.type) {
      case "Pessoa":
        return `Pessoa: ${target.value}`;
      case "Turmas":
        return `Turmas: ${
          Array.isArray(target.value) ? target.value.join(", ") : target.value
        }`;
      case "Turno":
        return `Turno: ${target.value}`;
      case "Série":
        return `Série: ${target.value}`;
      case "Escola":
        return "Toda a Escola";
      default:
        return target.value || "N/A";
    }
  };

  // Função para obter a cor do badge de status
  const getStatusBadgeColor = (status) => {
    const statusOption = NOTIFICATION_STATUS_OPTIONS.find(
      (option) => option.value === status
    );
    return statusOption ? statusOption.color : "secondary";
  };

  const onClickDelete = (notification) => {
    setNotificationToDelete(notification);
    setDeleteModal(true);
  };

  const handleViewNotification = (id) => {
    navigate(`/notifications/${id}`);
    toast.info("Carregando detalhes da notificação...");
  };

  // Função para excluir notificação
  const handleDeleteNotification = () => {
    if (!notificationToDelete || !notificationToDelete.id) {
      setDeleteModal(false);
      return;
    }

    try {
      setIsDeleting(true);

      // Simulação de exclusão
      setTimeout(() => {
        setNotificationList(
          notifications.filter((item) => item.id !== notificationToDelete.id)
        );
        setDeleteModal(false);
        setNotificationToDelete(null);
        setIsDeleting(false);
        toast.success("Notificação excluída com sucesso!");
      }, 800);
    } catch (err) {
      setIsDeleting(false);
      console.error("Erro ao excluir a notificação:", err);
      toast.error(
        "Erro ao excluir a notificação: " + (err.message || "Erro desconhecido")
      );
    }
  };

  // Configuração das colunas da tabela
  const columns = useMemo(
    () => [
      {
        header: "Título",
        accessorKey: "title",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <Link
              to={`/notifications/${cellProps.row.original.id}`}
              className="text-body fw-bold"
            >
              {getTextValue(cellProps.row.original.title) || "N/A"}
            </Link>
          );
        },
      },
      {
        header: "Destinatários",
        accessorKey: "target",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (cellProps) => {
          return getTargetDescription(cellProps.row.original.target);
        },
      },
      {
        header: "Enviada por",
        accessorKey: "sentBy",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return getTextValue(cellProps.row.original.sentBy) || "N/A";
        },
      },
      {
        header: "Data de Envio",
        accessorKey: "sentDate",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return formatDate(cellProps.row.original.sentDate);
        },
      },
      {
        header: "Status",
        accessorKey: "status",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          const status = getTextValue(cellProps.row.original.status);
          return (
            <Badge
              color={getStatusBadgeColor(status)}
              className={`badge-soft-${getStatusBadgeColor(
                status
              )} font-size-12`}
            >
              {status || "N/A"}
            </Badge>
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
                  onClick={() =>
                    handleViewNotification(cellProps.row.original.id)
                  }
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
    []
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Breadcrumb */}
          <Breadcrumbs title="Comunicação" breadcrumbItem="Notificações" />

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody className="border-bottom">
                  <div className="d-flex align-items-center">
                    <h5 className="mb-0 card-title flex-grow-1">
                      Lista de Notificações
                    </h5>
                    <div className="flex-shrink-0">
                      <Button
                        color="primary"
                        className="btn btn-primary me-1"
                        onClick={() => navigate("/notifications/create")}
                      >
                        <i className="bx bx-plus me-1"></i> Nova Notificação
                      </Button>
                      <Button
                        color="light"
                        className="me-1"
                        onClick={() => {
                          setLoading(true);
                          setTimeout(() => {
                            setLoading(false);
                            toast.success("Notificações atualizadas!");
                          }, 500);
                        }}
                      >
                        <i className="mdi mdi-refresh"></i>
                      </Button>
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
                    <div className="text-center my-5">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Carregando...</span>
                      </div>
                      <p className="mt-2">Carregando notificações...</p>
                    </div>
                  ) : error ? (
                    <div className="text-center my-4 text-danger">
                      <i className="bx bx-error-circle display-4"></i>
                      <p className="mt-2">Erro ao carregar dados: {error}</p>
                      <Button
                        color="primary"
                        onClick={() => setError(null)}
                        className="mt-2"
                      >
                        <i className="bx bx-refresh me-1"></i> Tentar Novamente
                      </Button>
                    </div>
                  ) : (
                    <TableContainer
                      columns={columns}
                      data={notifications}
                      isCustomPageSize={true}
                      isGlobalFilter={true}
                      isJobListGlobalFilter={false}
                      isPagination={true}
                      SearchPlaceholder="Pesquisar por título, destinatário..."
                      tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline mt-4 border-top"
                      pagination="pagination"
                      paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
                    />
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Modal de confirmação de exclusão */}
          <Modal
            isOpen={deleteModal}
            toggle={() => setDeleteModal(!deleteModal)}
            centered={true}
            size="sm"
          >
            <ModalHeader toggle={() => setDeleteModal(!deleteModal)}>
              Confirmar Exclusão
            </ModalHeader>
            <ModalBody>
              <p>
                Tem certeza que deseja excluir a notificação "
                {notificationToDelete?.title}"?
              </p>
              <p className="text-danger mb-0">
                Esta ação não pode ser desfeita.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                onClick={handleDeleteNotification}
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

export default NotificationsList;
