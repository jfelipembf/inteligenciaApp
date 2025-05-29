import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  ButtonGroup,
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
    receivedNotifications,
    sentNotifications,
    loading,
    error,
    fetchReceivedNotifications,
    fetchSentNotifications,
    resetReceivedNotifications,
    resetSentNotifications,
    hasMoreSent,
    hasMoreReceived,
    fetchNotificationById,
  } = useNotificationsContext();

  const [deleteModal, setDeleteModal] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [view, setView] = useState("sent"); // "sent" ou "received"

  useEffect(() => {
    if (view === "sent") {
      resetSentNotifications();
      fetchSentNotifications(true);
    } else {
      resetReceivedNotifications();
      fetchReceivedNotifications(true);
    }
    // eslint-disable-next-line
  }, [view]);

  // Função para formatar data no padrão BR (dd/mm/yyyy)
  const formatDate = (notification) => {
    // Se schedule existe e tem date, use schedule.date
    if (notification.schedule && notification.schedule.date) {
      const [year, month, day] = notification.schedule.date.split("-");
      return `${day}/${month}/${year}`;
    }

    // Se não, use createdAt (pode ser Firestore Timestamp, Date ou string)
    let dateObj = null;
    if (notification.createdAt) {
      if (typeof notification.createdAt.toDate === "function") {
        // Firestore Timestamp
        dateObj = notification.createdAt.toDate();
      } else if (notification.createdAt instanceof Date) {
        dateObj = notification.createdAt;
      } else if (typeof notification.createdAt === "string") {
        // Tenta converter string para Date
        dateObj = new Date(notification.createdAt);
        if (isNaN(dateObj.getTime())) {
          // Extrai apenas a parte da data do formato "23 de maio de 2025 às 18:03:00 UTC-3"
          const match = notification.createdAt.match(
            /(\d{1,2}) de (\w+) de (\d{4})/
          );
          if (match) {
            const [, day, monthName, year] = match;
            const months = {
              janeiro: "01",
              fevereiro: "02",
              março: "03",
              abril: "04",
              maio: "05",
              junho: "06",
              julho: "07",
              agosto: "08",
              setembro: "09",
              outubro: "10",
              novembro: "11",
              dezembro: "12",
            };
            const month = months[monthName.toLowerCase()] || "01";
            return `${day.padStart(2, "0")}/${month}/${year}`;
          }
          return "N/A";
        }
      }
    }
    if (dateObj) {
      const day = String(dateObj.getDate()).padStart(2, "0");
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const year = dateObj.getFullYear();
      return `${day}/${month}/${year}`;
    }
    return "N/A";
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

  // Função para obter a descrição do destinatário
  const getRecipientDescription = (notification) => {
    if (!notification) return "N/A";
    switch (notification.type) {
      case "class":
        return notification.class?.label || "Turma não informada";
      case "turn":
        if (notification.turn === "morning" || notification.turn === "Manhã")
          return "Turno da Manhã";
        if (notification.turn === "afternoon" || notification.turn === "Tarde")
          return "Turno da Tarde";
        if (notification.turn === "night" || notification.turn === "Noite")
          return "Turno da Noite";
        // Capitaliza se vier como "manha", "tarde", "noite"
        if (
          ["manha", "tarde", "noite"].includes(
            (notification.turn || "").toLowerCase()
          )
        ) {
          const capitalized =
            notification.turn.charAt(0).toUpperCase() +
            notification.turn.slice(1).toLowerCase();
          return `Turno da ${capitalized}`;
        }
        return `Turno: ${notification.turn || "não informado"}`;
      case "school":
        return "Toda a escola";
      case "individual":
        return notification.individual?.label || "Destinatário individual";
      default:
        return "N/A";
    }
  };

  // Configuração das colunas da tabela
  const sentColumns = useMemo(
    () => [
      {
        header: "Título",
        accessorKey: "title",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => (
          <Link
            to={`/notifications/${cellProps.row.original.id}`}
            className="text-body fw-bold"
          >
            {getTextValue(cellProps.row.original.title) || "N/A"}
          </Link>
        ),
      },
      {
        header: "Destinatários",
        accessorKey: "target",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (cellProps) => getRecipientDescription(cellProps.row.original),
      },

      {
        header: "Data de Envio",
        accessorKey: "sentDate",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => formatDate(cellProps.row.original),
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
        cell: (cellProps) => (
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
        ),
      },
    ],
    []
  );

  // Colunas para recebidas (sem destinatário nem status)
  const receivedColumns = useMemo(
    () => [
      {
        header: "Título",
        accessorKey: "title",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => (
          <Link
            to={`/notifications/${cellProps.row.original.id}`}
            className="text-body fw-bold"
          >
            {getTextValue(cellProps.row.original.title) || "N/A"}
          </Link>
        ),
      },
      {
        header: "Mensagem",
        accessorKey: "message",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (cellProps) => getTextValue(cellProps.row.original.message),
      },
      {
        header: "Enviada por",
        accessorKey: "sentBy",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) =>
          getTextValue(cellProps.row.original.sentBy) || "N/A",
      },
      {
        header: "Data de Envio",
        accessorKey: "sentDate",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => formatDate(cellProps.row.original),
      },
      {
        header: "Ações",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (cellProps) => (
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
          </ul>
        ),
      },
    ],
    []
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
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
                      <ButtonGroup className="me-2">
                        <Button
                          color={view === "sent" ? "primary" : "light"}
                          onClick={() => setView("sent")}
                        >
                          Ver Enviadas
                        </Button>
                        <Button
                          color={view === "received" ? "primary" : "light"}
                          onClick={() => setView("received")}
                        >
                          Ver Recebidas
                        </Button>
                      </ButtonGroup>
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
                          if (view === "sent") {
                            resetSentNotifications();
                            fetchSentNotifications(true);
                          } else {
                            resetReceivedNotifications();
                            fetchReceivedNotifications(true);
                          }
                          toast.success("Notificações atualizadas!");
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
                      columns={view === "sent" ? sentColumns : receivedColumns}
                      data={
                        view === "sent"
                          ? sentNotifications
                          : receivedNotifications
                      }
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
