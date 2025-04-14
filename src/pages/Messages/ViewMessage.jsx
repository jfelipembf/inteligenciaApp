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
  Alert,
} from "reactstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Componentes
import Breadcrumbs from "../../components/Common/Breadcrumb";

// Dados de exemplo - os mesmos da página de listagem
const MESSAGES_DATA = [
  {
    id: 1,
    subject: "Dúvida sobre a prova de matemática",
    sender: "João Silva (Responsável)",
    recipient: "Roberto Santos (Professor)",
    date: "2025-04-12T10:30:00",
    status: "Não lida",
    priority: "Normal",
    content: "Olá professor, gostaria de saber se a prova de matemática vai incluir o conteúdo de geometria que foi passado na última aula."
  },
  {
    id: 2,
    subject: "Solicitação de reunião",
    sender: "Maria Oliveira (Coordenadora)",
    recipient: "Todos os professores",
    date: "2025-04-11T14:15:00",
    status: "Lida",
    priority: "Alta",
    content: "Prezados professores, solicito a presença de todos para uma reunião extraordinária na próxima sexta-feira às 15h."
  },
  {
    id: 3,
    subject: "Autorização para passeio escolar",
    sender: "Ana Souza (Secretaria)",
    recipient: "Responsáveis - 3º Ano A",
    date: "2025-04-10T09:45:00",
    status: "Lida",
    priority: "Alta",
    content: "Prezados responsáveis, solicitamos a autorização para o passeio escolar que ocorrerá no dia 20/04. Por favor, assinem o formulário anexo."
  },
  {
    id: 4,
    subject: "Dúvida sobre material escolar",
    sender: "Carlos Ferreira (Responsável)",
    recipient: "Secretaria",
    date: "2025-04-09T16:20:00",
    status: "Respondida",
    priority: "Normal",
    content: "Gostaria de saber se é necessário comprar o livro de inglês para o próximo bimestre."
  },
  {
    id: 5,
    subject: "Aviso sobre alteração de horário",
    sender: "Pedro Almeida (Diretor)",
    recipient: "Toda a escola",
    date: "2025-04-08T11:00:00",
    status: "Lida",
    priority: "Normal",
    content: "Informamos que, devido a manutenção elétrica, as aulas do período da tarde serão encerradas às 16h na próxima segunda-feira."
  },
  {
    id: 6,
    subject: "Solicitação de material para feira de ciências",
    sender: "Juliana Lima (Professora)",
    recipient: "Responsáveis - 5º Ano B",
    date: "2025-04-07T13:30:00",
    status: "Não lida",
    priority: "Normal",
    content: "Para a feira de ciências, cada aluno deverá trazer os seguintes materiais: cartolina, cola, tesoura e material reciclável."
  },
  {
    id: 7,
    subject: "Confirmação de inscrição em atividade extracurricular",
    sender: "Secretaria",
    recipient: "Márcia Souza (Responsável)",
    date: "2025-04-06T10:15:00",
    status: "Lida",
    priority: "Baixa",
    content: "Confirmamos a inscrição do aluno João Souza na atividade extracurricular de xadrez às terças e quintas-feiras."
  },
  {
    id: 8,
    subject: "Lembrete: Entrega de trabalho",
    sender: "Roberto Santos (Professor)",
    recipient: "Alunos - 2º Ano B",
    date: "2025-04-05T09:00:00",
    status: "Lida",
    priority: "Alta",
    content: "Lembrem-se que o prazo para entrega do trabalho de história é amanhã. Não serão aceitos trabalhos após a data."
  }
];

const ViewMessage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento da mensagem
    setLoading(true);
    
    setTimeout(() => {
      const foundMessage = MESSAGES_DATA.find(msg => msg.id === parseInt(id));
      
      if (foundMessage) {
        // Atualizar status para "Lida" se estiver como "Não lida"
        if (foundMessage.status === "Não lida") {
          foundMessage.status = "Lida";
          toast.info("Mensagem marcada como lida");
        }
        
        setMessage(foundMessage);
      }
      
      setLoading(false);
    }, 500);
  }, [id]);

  // Função para formatar a data
  const formatDate = (dateString) => {
    const options = { 
      day: "2-digit", 
      month: "2-digit", 
      year: "numeric", 
      hour: "2-digit", 
      minute: "2-digit" 
    };
    return new Date(dateString).toLocaleDateString("pt-BR", options);
  };

  // Função para obter a cor do badge de prioridade
  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case "Alta":
        return "danger";
      case "Normal":
        return "info";
      case "Baixa":
        return "success";
      default:
        return "secondary";
    }
  };

  // Função para obter a cor do badge de status
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Não lida":
        return "warning";
      case "Lida":
        return "success";
      case "Respondida":
        return "info";
      default:
        return "secondary";
    }
  };

  // Função para excluir mensagem
  const handleDeleteMessage = () => {
    if (window.confirm("Tem certeza que deseja excluir esta mensagem?")) {
      // Em um sistema real, faria uma chamada à API
      toast.success("Mensagem excluída com sucesso!");
      
      // Redirecionar para a lista de mensagens após excluir
      setTimeout(() => {
        navigate("/messages");
      }, 1500);
    }
  };

  // Função para marcar como importante
  const handleMarkAsImportant = () => {
    toast.success("Mensagem marcada como importante!");
  };

  // Função para responder a todos
  const handleReplyAll = () => {
    navigate(`/messages/reply/${id}?replyAll=true`);
  };

  // Função para encaminhar
  const handleForward = () => {
    navigate(`/messages/forward/${id}`);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs 
            title="Comunicação" 
            breadcrumbItem="Visualizar Mensagem" 
          />

          {loading ? (
            <Row>
              <Col lg={12}>
                <Card>
                  <CardBody className="text-center p-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Carregando...</span>
                    </div>
                    <p className="mt-2">Carregando mensagem...</p>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          ) : message ? (
            <Row>
              <Col lg={8}>
                <Card>
                  <CardBody>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div>
                        <Link to="/messages" className="btn btn-outline-secondary me-2">
                          <i className="bx bx-arrow-left font-size-16 align-middle me-1"></i> Voltar
                        </Link>
                        <Link to={`/messages/reply/${message.id}`} className="btn btn-primary">
                          <i className="mdi mdi-reply font-size-16 align-middle me-1"></i> Responder
                        </Link>
                      </div>
                      <div>
                        <Button color="danger" outline onClick={handleDeleteMessage}>
                          <i className="mdi mdi-delete-outline font-size-16 align-middle me-1"></i> Excluir
                        </Button>
                      </div>
                    </div>

                    <div className="border-bottom pb-3 mb-4">
                      <h4 className="font-size-18">{message.subject}</h4>
                      <div className="d-flex flex-wrap gap-2 mt-2">
                        <Badge color={getPriorityBadgeColor(message.priority)} className="rounded-pill">
                          Prioridade: {message.priority}
                        </Badge>
                        <Badge color={getStatusBadgeColor(message.status)} className="rounded-pill">
                          {message.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="d-flex mb-4">
                      <div className="flex-grow-1">
                        <div className="d-flex">
                          <div className="flex-shrink-0 me-3">
                            <div className="avatar-xs">
                              <span className="avatar-title rounded-circle bg-primary text-white">
                                {message.sender.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <h5 className="font-size-14 mt-1 mb-0">{message.sender}</h5>
                            <small className="text-muted">
                              Para: {message.recipient}
                            </small>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <small className="text-muted">{formatDate(message.date)}</small>
                      </div>
                    </div>

                    <div className="message-content border-top pt-4">
                      <div className="mt-3" style={{ whiteSpace: "pre-line" }}>
                        {message.content}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>

              <Col lg={4}>
                <Card>
                  <CardBody>
                    <CardTitle className="mb-4">
                      Ações Rápidas
                    </CardTitle>
                    <div className="d-grid gap-2">
                      <Button color="primary" className="text-start" onClick={() => navigate(`/messages/reply/${message.id}`)}>
                        <i className="mdi mdi-reply font-size-16 align-middle me-1"></i> Responder
                      </Button>
                      <Button color="info" outline className="text-start" onClick={handleReplyAll}>
                        <i className="mdi mdi-reply-all font-size-16 align-middle me-1"></i> Responder a Todos
                      </Button>
                      <Button color="success" outline className="text-start" onClick={handleForward}>
                        <i className="mdi mdi-share font-size-16 align-middle me-1"></i> Encaminhar
                      </Button>
                      <Button color="warning" outline className="text-start" onClick={handleMarkAsImportant}>
                        <i className="mdi mdi-star-outline font-size-16 align-middle me-1"></i> Marcar como Importante
                      </Button>
                      <Button color="danger" outline className="text-start" onClick={handleDeleteMessage}>
                        <i className="mdi mdi-delete-outline font-size-16 align-middle me-1"></i> Excluir
                      </Button>
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody>
                    <CardTitle className="mb-4">
                      Informações Adicionais
                    </CardTitle>
                    <div className="table-responsive">
                      <table className="table table-bordered table-striped mb-0">
                        <tbody>
                          <tr>
                            <th scope="row" style={{ width: "35%" }}>Remetente</th>
                            <td>{message.sender}</td>
                          </tr>
                          <tr>
                            <th scope="row">Destinatário</th>
                            <td>{message.recipient}</td>
                          </tr>
                          <tr>
                            <th scope="row">Data</th>
                            <td>{formatDate(message.date)}</td>
                          </tr>
                          <tr>
                            <th scope="row">Prioridade</th>
                            <td>
                              <Badge color={getPriorityBadgeColor(message.priority)} className="rounded-pill">
                                {message.priority}
                              </Badge>
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">Status</th>
                            <td>
                              <Badge color={getStatusBadgeColor(message.status)} className="rounded-pill">
                                {message.status}
                              </Badge>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          ) : (
            <Row>
              <Col lg={12}>
                <Alert color="danger">
                  <h4 className="alert-heading">Mensagem não encontrada!</h4>
                  <p>A mensagem que você está procurando não existe ou foi excluída.</p>
                  <hr />
                  <p className="mb-0">
                    <Link to="/messages" className="alert-link">
                      Voltar para a lista de mensagens
                    </Link>
                  </p>
                </Alert>
              </Col>
            </Row>
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ViewMessage;
