import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Button,
  Badge,
  Table,
} from "reactstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    image: "https://via.placeholder.com/500x300",
    notes: "Trazer projetos uma hora antes para montagem"
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
    image: "https://via.placeholder.com/500x300",
    notes: "Traje típico é opcional"
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
    image: "https://via.placeholder.com/500x300",
    notes: "Levar autorização dos pais e lanche"
  }
];

// Constantes para status de evento
const EVENT_STATUS_COLORS = {
  "Agendado": "primary",
  "Em andamento": "success",
  "Concluído": "info",
  "Cancelado": "danger"
};

const ViewEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carregar dados do evento
    setLoading(true);
    
    // Simulação de busca de dados
    setTimeout(() => {
      const eventData = SAMPLE_EVENTS.find(event => event.id === id);
      
      if (eventData) {
        setEvent(eventData);
      } else {
        toast.error("Evento não encontrado!");
        navigate("/events");
      }
      
      setLoading(false);
    }, 800);
  }, [id, navigate]);

  // Função para formatar data
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const handleEdit = () => {
    navigate(`/events/${id}/edit`);
    toast.info("Carregando formulário de edição...");
  };

  const handleDelete = () => {
    // Aqui você pode adicionar uma confirmação antes de excluir
    if (window.confirm("Tem certeza que deseja excluir este evento?")) {
      setLoading(true);
      
      // Simulação de exclusão
      setTimeout(() => {
        toast.success("Evento excluído com sucesso!");
        navigate("/events");
      }, 800);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Breadcrumb */}
          <Breadcrumbs title="Eventos" breadcrumbItem="Detalhes do Evento" />

          {loading ? (
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
              <p className="mt-2">Carregando detalhes do evento...</p>
            </div>
          ) : event ? (
            <>
              <Row>
                <Col lg={12}>
                  <Card>
                    <CardBody>
                      <div className="d-flex align-items-center mb-4">
                        <div className="flex-grow-1">
                          <CardTitle tag="h4">{event.name}</CardTitle>
                          <Badge color={EVENT_STATUS_COLORS[event.status] || "secondary"} className="font-size-12 ms-0">
                            {event.status}
                          </Badge>
                        </div>
                        <div className="flex-shrink-0">
                          <Button
                            color="primary"
                            className="btn-sm me-2"
                            onClick={handleEdit}
                          >
                            <i className="bx bx-edit align-middle me-1"></i> Editar
                          </Button>
                          <Button
                            color="danger"
                            className="btn-sm"
                            onClick={handleDelete}
                          >
                            <i className="bx bx-trash align-middle me-1"></i> Excluir
                          </Button>
                        </div>
                      </div>

                      <Row>
                        <Col md={8}>
                          <div className="table-responsive">
                            <Table className="table-borderless mb-0">
                              <tbody>
                                <tr>
                                  <th scope="row" style={{ width: "20%" }}>Data</th>
                                  <td>
                                    {formatDate(event.startDate) === formatDate(event.endDate)
                                      ? formatDate(event.startDate)
                                      : `${formatDate(event.startDate)} a ${formatDate(event.endDate)}`}
                                  </td>
                                </tr>
                                <tr>
                                  <th scope="row">Horário</th>
                                  <td>{event.startTime} - {event.endTime}</td>
                                </tr>
                                <tr>
                                  <th scope="row">Local</th>
                                  <td>{event.location}</td>
                                </tr>
                                <tr>
                                  <th scope="row">Valor</th>
                                  <td>{event.value}</td>
                                </tr>
                                <tr>
                                  <th scope="row">Turmas</th>
                                  <td>
                                    {event.classes.map((cls, index) => (
                                      <Badge 
                                        key={index} 
                                        color="light" 
                                        className="bg-light text-dark me-1 mb-1"
                                      >
                                        {cls}
                                      </Badge>
                                    ))}
                                  </td>
                                </tr>
                                {event.notes && (
                                  <tr>
                                    <th scope="row">Informações</th>
                                    <td>{event.notes}</td>
                                  </tr>
                                )}
                              </tbody>
                            </Table>
                          </div>
                        </Col>
                        <Col md={4}>
                          {event.image && (
                            <div className="text-center">
                              <img 
                                src={event.image} 
                                alt={event.name} 
                                className="img-fluid rounded" 
                                style={{ maxHeight: "250px" }}
                              />
                            </div>
                          )}
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              <Row>
                <Col lg={12}>
                  <div className="d-flex flex-wrap gap-2">
                    <Button
                      color="primary"
                      onClick={() => navigate("/events")}
                    >
                      <i className="bx bx-arrow-back align-middle me-1"></i> Voltar para Lista
                    </Button>
                    <Button
                      color="success"
                      onClick={() => window.print()}
                    >
                      <i className="bx bx-printer align-middle me-1"></i> Imprimir
                    </Button>
                  </div>
                </Col>
              </Row>
            </>
          ) : (
            <div className="text-center my-5">
              <div className="text-danger">
                <i className="bx bx-error-circle display-4"></i>
                <h4 className="mt-2">Evento não encontrado</h4>
                <p>O evento que você está procurando não existe ou foi removido.</p>
                <Button
                  color="primary"
                  onClick={() => navigate("/events")}
                >
                  Voltar para Lista de Eventos
                </Button>
              </div>
            </div>
          )}

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

export default ViewEvent;
