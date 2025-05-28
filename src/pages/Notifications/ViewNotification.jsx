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
import useNotifications from "../../hooks/useNotifications"; // 1. Importe o hook

// Dados de exemplo para notificações
const SAMPLE_NOTIFICATIONS = [
  {
    id: "not001",
    title: "Reunião de Pais e Mestres",
    message:
      "Informamos que a reunião de pais e mestres ocorrerá no próximo sábado às 9h. Todos os responsáveis devem comparecer para acompanhar o desenvolvimento dos alunos. Serão discutidos os resultados do primeiro bimestre e as atividades previstas para o próximo período.",
    target: { type: "Turmas", value: ["1º Ano A", "1º Ano B"] },
    sentBy: "Maria Silva",
    sentDate: "2025-04-10T14:30:00",
    status: "Enviada",
    readCount: 42,
    totalRecipients: 60,
  },
  {
    id: "not002",
    title: "Alteração no Calendário Escolar",
    message:
      "Informamos que o dia 20/05 será feriado escolar devido ao dia do professor. As aulas serão repostas no dia 10/06, que seria um dia letivo normal. Por favor, ajustem suas agendas de acordo com esta alteração.",
    target: { type: "Escola", value: "Todos" },
    sentBy: "João Diretor",
    sentDate: "2025-04-05T10:15:00",
    status: "Enviada",
    readCount: 320,
    totalRecipients: 450,
  },
  {
    id: "not003",
    title: "Aula de Reforço de Matemática",
    message:
      "Haverá aula de reforço de matemática na próxima terça-feira às 14h. Os alunos que receberam indicação do professor devem comparecer. O conteúdo abordado será equações do segundo grau e geometria espacial.",
    target: { type: "Série", value: "3º Ano" },
    sentBy: "Carlos Matemática",
    sentDate: "2025-04-12T08:45:00",
    status: "Enviada",
    readCount: 28,
    totalRecipients: 40,
  },
  {
    id: "not004",
    title: "Aviso sobre Uniforme",
    message:
      "Lembramos que o uso do uniforme completo é obrigatório a partir de segunda-feira. Os alunos que não estiverem devidamente uniformizados serão notificados e, em caso de reincidência, os pais serão comunicados. O uniforme completo inclui camiseta da escola, calça ou saia da escola, e sapatos fechados.",
    target: { type: "Turno", value: "Matutino" },
    sentBy: "Ana Coordenadora",
    sentDate: "2025-04-08T16:20:00",
    status: "Enviada",
    readCount: 180,
    totalRecipients: 250,
  },
  {
    id: "not005",
    title: "Entrega de Boletins",
    message:
      "Os boletins do primeiro bimestre estarão disponíveis na secretaria a partir de amanhã. Favor comparecer para retirada entre 8h e 17h. É necessário apresentar documento de identificação.",
    target: { type: "Pessoa", value: "Maria Aluna" },
    sentBy: "Pedro Secretário",
    sentDate: "2025-04-13T11:30:00",
    status: "Enviada",
    readCount: 1,
    totalRecipients: 1,
  },
];

const ViewNotification = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const { fetchNotificationById, error } = useNotifications(); // 2. Use o método do hook

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchNotificationById(id).then((data) => {
      if (!isMounted) return;
      if (data) {
        setNotification(data);
      } else {
        toast.error("Notificação não encontrada!");
        navigate("/notifications");
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [id, navigate, fetchNotificationById]);

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
    switch (status) {
      case "Enviada":
        return "success";
      case "Agendada":
        return "primary";
      case "Falha":
        return "danger";
      default:
        return "secondary";
    }
  };

  const handleDelete = () => {
    // Aqui você pode adicionar uma confirmação antes de excluir
    if (window.confirm("Tem certeza que deseja excluir esta notificação?")) {
      setLoading(true);

      // Simulação de exclusão
      setTimeout(() => {
        toast.success("Notificação excluída com sucesso!");
        navigate("/notifications");
      }, 800);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Breadcrumb */}
          <Breadcrumbs
            title="Comunicação"
            breadcrumbItem="Detalhes da Notificação"
          />

          {loading ? (
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
              <p className="mt-2">Carregando detalhes da notificação...</p>
            </div>
          ) : notification ? (
            <>
              <Row>
                <Col lg={12}>
                  <Card>
                    <CardBody>
                      <div className="d-flex align-items-center mb-4">
                        <div className="flex-grow-1">
                          <CardTitle tag="h4">{notification.title}</CardTitle>
                          <Badge
                            color={getStatusBadgeColor(notification.status)}
                            className="font-size-12 ms-0"
                          >
                            {notification.status}
                          </Badge>
                        </div>
                        <div className="flex-shrink-0">
                          <Button
                            color="danger"
                            className="btn-sm"
                            onClick={handleDelete}
                          >
                            <i className="bx bx-trash-alt align-middle me-1"></i>{" "}
                            Excluir
                          </Button>
                        </div>
                      </div>

                      <Row>
                        <Col md={8}>
                          <div className="table-responsive">
                            <Table className="table-borderless mb-0">
                              <tbody>
                                <tr>
                                  <th scope="row" style={{ width: "20%" }}>
                                    Enviada por
                                  </th>
                                  <td>{notification.sentBy}</td>
                                </tr>
                                <tr>
                                  <th scope="row">Data de Envio</th>
                                  <td>{formatDate(notification.sentDate)}</td>
                                </tr>
                                <tr>
                                  <th scope="row">Destinatários</th>
                                  <td>
                                    {getTargetDescription(notification.target)}
                                  </td>
                                </tr>
                                <tr>
                                  <th scope="row">Leitura</th>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <div className="me-2">
                                        {notification.readCount} de{" "}
                                        {notification.totalRecipients} (
                                        {Math.round(
                                          (notification.readCount /
                                            notification.totalRecipients) *
                                            100
                                        )}
                                        %)
                                      </div>
                                      <div
                                        className="progress"
                                        style={{
                                          width: "150px",
                                          height: "6px",
                                        }}
                                      >
                                        <div
                                          className="progress-bar bg-success"
                                          role="progressbar"
                                          style={{
                                            width: `${
                                              (notification.readCount /
                                                notification.totalRecipients) *
                                              100
                                            }%`,
                                          }}
                                          aria-valuenow={
                                            (notification.readCount /
                                              notification.totalRecipients) *
                                            100
                                          }
                                          aria-valuemin="0"
                                          aria-valuemax="100"
                                        ></div>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </Table>
                          </div>
                        </Col>
                        <Col md={4}>
                          <Card className="bg-light border">
                            <CardBody>
                              <h5 className="card-title mb-3">Estatísticas</h5>
                              <div className="d-flex justify-content-between mb-2">
                                <span>Total de destinatários:</span>
                                <span className="fw-bold">
                                  {notification.totalRecipients}
                                </span>
                              </div>
                              <div className="d-flex justify-content-between mb-2">
                                <span>Leram a mensagem:</span>
                                <span className="fw-bold text-success">
                                  {notification.readCount}
                                </span>
                              </div>
                              <div className="d-flex justify-content-between">
                                <span>Não leram:</span>
                                <span className="fw-bold text-danger">
                                  {notification.totalRecipients -
                                    notification.readCount}
                                </span>
                              </div>
                            </CardBody>
                          </Card>
                        </Col>
                      </Row>

                      <Row className="mt-3">
                        <Col md={12}>
                          <Card className="border">
                            <CardBody>
                              <h5 className="card-title mb-3">Mensagem</h5>
                              <p style={{ whiteSpace: "pre-line" }}>
                                {notification.message}
                              </p>
                            </CardBody>
                          </Card>
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
                      onClick={() => navigate("/notifications")}
                    >
                      <i className="bx bx-arrow-left align-middle me-1"></i>{" "}
                      Voltar para Lista
                    </Button>
                    <Button
                      color="success"
                      onClick={() => navigate("/notifications/create")}
                    >
                      <i className="bx bx-plus align-middle me-1"></i> Nova
                      Notificação
                    </Button>
                    <Button color="info" onClick={() => window.print()}>
                      <i className="bx bx-printer align-middle me-1"></i>{" "}
                      Imprimir
                    </Button>
                  </div>
                </Col>
              </Row>
            </>
          ) : (
            <div className="text-center my-5">
              <div className="text-danger">
                <i className="bx bx-error-circle display-4"></i>
                <h4 className="mt-2">Notificação não encontrada</h4>
                <p>
                  A notificação que você está procurando não existe ou foi
                  removida.
                </p>
                <Button
                  color="primary"
                  onClick={() => navigate("/notifications")}
                >
                  Voltar para Lista de Notificações
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

export default ViewNotification;
