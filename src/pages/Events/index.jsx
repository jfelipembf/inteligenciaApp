import React, { useState, useMemo, useEffect } from "react";
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
import TableContainer from "../../components/Common/TableContainer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useFetchEvents from "../../hooks/useFetchEvents";
import useUpdateEventStatuses from "../../hooks/useUpdateEventStatuses";

// Constantes para status de evento
const EVENT_STATUS_OPTIONS = [
  { value: "Agendado", label: "Agendado", color: "primary" },
  { value: "Em andamento", label: "Em andamento", color: "success" },
  { value: "Concluído", label: "Concluído", color: "info" },
  { value: "Cancelado", label: "Cancelado", color: "danger" },
];

// Dados de exemplo para eventos
const SAMPLE_EVENTS = [
  {
    id: "evt001",
    name: "Feira de Ciências",
    startDate: "2025-05-15",
    endDate: "2025-05-15",
    startTime: "09:00",
    endTime: "17:00",
    classes: ["1º Ano A", "1º Ano B", "2º Ano A"],
    location: "Pátio da Escola",
    value: "Gratuito",
    status: "Agendado",
    image: "https://via.placeholder.com/150",
    notes: "Trazer projetos uma hora antes para montagem",
  },
  {
    id: "evt002",
    name: "Festa Junina",
    startDate: "2025-06-20",
    endDate: "2025-06-20",
    startTime: "18:00",
    endTime: "22:00",
    classes: ["Todas as turmas"],
    location: "Quadra Poliesportiva",
    value: "R$ 10,00",
    status: "Agendado",
    image: "https://via.placeholder.com/150",
    notes: "Traje típico é opcional",
  },
  {
    id: "evt003",
    name: "Excursão ao Museu",
    startDate: "2025-04-30",
    endDate: "2025-04-30",
    startTime: "08:00",
    endTime: "14:00",
    classes: ["3º Ano A", "3º Ano B"],
    location: "Museu de História Natural",
    value: "R$ 25,00",
    status: "Agendado",
    image: "https://via.placeholder.com/150",
    notes: "Levar autorização dos pais e lanche",
  },
];

const Events = () => {
  const navigate = useNavigate();
  const { events, loading, error, refetch } = useFetchEvents();
  const { updateEventStatuses, loading: updatingStatuses } =
    useUpdateEventStatuses();
  const [deleteModal, setDeleteModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRefresh = async () => {
    try {
      await refetch();
    } catch (err) {
      console.error("Erro ao atualizar eventos:", err);
      toast.error("Erro ao atualizar eventos.");
    }
  };

  useEffect(() => {
    const checkAndUpdateStatuses = async () => {
      try {
        // Verifica e atualiza os status dos eventos
        const updatedEvents = events.map((event) => {
          const now = new Date();
          const startDate = new Date(event.startDate);
          const endDate = new Date(event.endDate);

          let newStatus = event.status;

          if (now >= startDate && now <= endDate) {
            newStatus = "Em andamento";
          } else if (now > endDate) {
            newStatus = "Concluído";
          }

          return { ...event, status: newStatus };
        });

        // Filtra apenas os eventos que tiveram o status alterado
        const eventsToUpdate = updatedEvents.filter(
          (event, index) => event.status !== events[index].status
        );

        // Atualiza os eventos no banco de dados
        if (eventsToUpdate.length > 0) {
          console.log("Atualizando status dos eventos...");
          await updateEventStatuses(eventsToUpdate);

          toast.success("Status dos eventos atualizados!");
          refetch(); // Atualiza a lista de eventos na página
        }
      } catch (err) {
        console.error("Erro ao verificar e atualizar status dos eventos:", err);
        toast.error("Erro ao atualizar status dos eventos.");
      }
    };

    if (events.length > 0) {
      checkAndUpdateStatuses();
    }
  }, [events, updateEventStatuses, refetch]); // Adicione `events` como dependência

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

  const onClickDelete = (event) => {
    setCurrentEvent(event);
    setDeleteModal(true);
  };

  const handleViewEvent = (id) => {
    navigate(`/events/${id}`);
    toast.info("Carregando detalhes do evento...");
  };

  const handleEditEvent = (id) => {
    navigate(`/events/${id}/edit`);
    toast.info("Carregando formulário de edição...");
  };

  const handleDeleteEvent = async () => {
    if (!currentEvent || !currentEvent.id) {
      setDeleteModal(false);
      return;
    }

    try {
      setIsDeleting(true);
      // Simulação de exclusão bem-sucedida
      setTimeout(() => {
        setEvents(events.filter((event) => event.id !== currentEvent.id));
        setIsDeleting(false);
        setDeleteModal(false);
        setCurrentEvent(null);
        toast.success("Evento excluído com sucesso!");
      }, 1000);
    } catch (err) {
      setIsDeleting(false);
      console.error("Erro ao excluir o evento:", err);
      toast.error(
        "Erro ao excluir o evento: " + (err.message || "Erro desconhecido")
      );
    }
  };

  // Função para formatar data
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  // Definir colunas para a tabela
  const columns = useMemo(
    () => [
      {
        header: "Nome do Evento",
        accessorKey: "name",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <Link
              to="#"
              onClick={() => handleViewEvent(cellProps.row.original.id)}
              className="text-body fw-bold"
            >
              {cellProps.row.original.name || "N/A"}
            </Link>
          );
        },
      },
      {
        header: "Data",
        accessorKey: "startDate",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          const startDate = formatDate(cellProps.row.original.startDate);
          const endDate = formatDate(cellProps.row.original.endDate);

          return startDate === endDate
            ? startDate
            : `${startDate} a ${endDate}`;
        },
      },
      {
        header: "Horário",
        accessorKey: "startTime",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return `${cellProps.row.original.startTime || "N/A"} - ${
            cellProps.row.original.endTime || "N/A"
          }`;
        },
      },
      {
        header: "Local",
        accessorKey: "location",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return cellProps.row.original.location || "N/A";
        },
      },
      {
        header: "Valor",
        accessorKey: "value",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return cellProps.row.original.value || "N/A";
        },
      },
      {
        header: "Status",
        accessorKey: "status",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          const status = cellProps.row.original.status;
          const statusObj =
            EVENT_STATUS_OPTIONS.find((s) => s.value === status) ||
            EVENT_STATUS_OPTIONS[0]; // Default to first status if not found

          return <Badge color={statusObj.color}>{status || "N/A"}</Badge>;
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
                  onClick={() => handleViewEvent(cellProps.row.original.id)}
                >
                  <i className="mdi mdi-eye-outline" />
                </Button>
              </li>

              <li>
                <Button
                  color="soft-info"
                  className="btn btn-sm btn-soft-info"
                  onClick={() => handleEditEvent(cellProps.row.original.id)}
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
    [events, navigate]
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Breadcrumb */}
          <Breadcrumbs title="Eventos" breadcrumbItem="Visualizar Eventos" />

          <Row>
            <Col lg="12">
              <Card>
                <CardBody className="border-bottom">
                  <div className="d-flex align-items-center">
                    <h5 className="mb-0 card-title flex-grow-1">
                      Lista de Eventos
                    </h5>
                    <div className="flex-shrink-0">
                      <Link
                        to="/events/create"
                        className="btn btn-primary me-1"
                      >
                        <i className="bx bx-plus me-1"></i> Novo Evento
                      </Link>
                      <Button
                        color="light"
                        className="me-1"
                        onClick={handleRefresh}
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
                    <div className="text-center my-4">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Carregando...</span>
                      </div>
                      <p className="mt-2">Carregando eventos...</p>
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
                      data={events}
                      isCustomPageSize={true}
                      isGlobalFilter={true}
                      isJobListGlobalFilter={false}
                      isPagination={true}
                      SearchPlaceholder="Pesquisar por nome, local..."
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
                Tem certeza que deseja excluir o evento "{currentEvent?.name}"?
              </p>
              <p className="text-danger mb-0">
                Esta ação não pode ser desfeita.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                onClick={handleDeleteEvent}
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

export default Events;
