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
import { useNotificationsContext } from "../../contexts/NotificationsContext";

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
  const { fetchNotificationById, error } = useNotificationsContext(); // 2. Use o método do hook

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

                          <div className="text-muted small mt-1">
                            <div>
                              <strong>Enviado por:</strong>{" "}
                              {notification.sentBy.label}
                            </div>
                            <div>
                              <strong>Destinatário:</strong>{" "}
                              {getRecipientDescription(notification)}
                            </div>
                            <div>
                              <strong>Data:</strong> {formatDate(notification)}
                            </div>
                          </div>
                          <Badge
                            color={getStatusBadgeColor(notification.status)}
                            className="font-size-12 ms-0 mt-2"
                          >
                            {notification.status}
                          </Badge>
                        </div>
                      </div>

                      <Row>
                        <Col md={8}>
                          <div className="table-responsive">
                            {/*<Table className="table-borderless mb-0">
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
                            </Table>*/}
                          </div>
                        </Col>
                        {/*<Col md={4}>
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
                        </Col>*/}
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
                  <div className="d-flex justify-content-end flex-wrap gap-2 pb-4">
                    <Button
                      color="primary"
                      onClick={() => navigate("/notifications")}
                    >
                      <i className="bx bx-arrow-left align-middle me-1"></i>{" "}
                      Voltar para Lista
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
