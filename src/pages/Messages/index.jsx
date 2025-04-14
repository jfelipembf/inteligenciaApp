import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Badge,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
  FormGroup,
  Label,
  InputGroup,
  InputGroupText,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Componentes
import Breadcrumbs from "../../components/Common/Breadcrumb";

// Dados de exemplo
const MESSAGES_DATA = [
  {
    id: 1,
    subject: "Dúvida sobre a prova de matemática",
    sender: "João Silva (Responsável)",
    recipient: "Roberto Santos (Professor)",
    date: "2025-04-12T10:30:00",
    status: "Não lida",
    priority: "Normal",
    content: "Olá professor, gostaria de saber se a prova de matemática vai incluir o conteúdo de geometria que foi passado na última aula.",
    lastMessage: "Olá professor, gostaria de saber se a prova de matemática vai incluir o conteúdo de geometria que foi passado na última aula.",
  },
  {
    id: 2,
    subject: "Solicitação de reunião",
    sender: "Maria Oliveira (Coordenadora)",
    recipient: "Todos os professores",
    date: "2025-04-11T14:15:00",
    status: "Lida",
    priority: "Alta",
    content: "Prezados professores, solicito a presença de todos para uma reunião extraordinária na próxima sexta-feira às 15h.",
    lastMessage: "Prezados professores, solicito a presença de todos para uma reunião extraordinária na próxima sexta-feira às 15h.",
  },
  {
    id: 3,
    subject: "Autorização para passeio escolar",
    sender: "Ana Souza (Secretaria)",
    recipient: "Responsáveis - 3º Ano A",
    date: "2025-04-10T09:45:00",
    status: "Lida",
    priority: "Alta",
    content: "Prezados responsáveis, solicitamos a autorização para o passeio escolar que ocorrerá no dia 20/04. Por favor, assinem o formulário anexo.",
    lastMessage: "Prezados responsáveis, solicitamos a autorização para o passeio escolar que ocorrerá no dia 20/04.",
  },
  {
    id: 4,
    subject: "Dúvida sobre material escolar",
    sender: "Carlos Ferreira (Responsável)",
    recipient: "Secretaria",
    date: "2025-04-09T16:20:00",
    status: "Respondida",
    priority: "Normal",
    content: "Gostaria de saber se é necessário comprar o livro de inglês para o próximo bimestre.",
    lastMessage: "Perfeito, aguardarei o e-mail. Muito obrigado!",
  },
  {
    id: 5,
    subject: "Aviso sobre alteração de horário",
    sender: "Pedro Almeida (Diretor)",
    recipient: "Toda a escola",
    date: "2025-04-08T11:00:00",
    status: "Lida",
    priority: "Normal",
    content: "Informamos que, devido a manutenção elétrica, as aulas do período da tarde serão encerradas às 16h na próxima segunda-feira.",
    lastMessage: "Informamos que, devido a manutenção elétrica, as aulas do período da tarde serão encerradas às 16h na próxima segunda-feira.",
  },
  {
    id: 6,
    subject: "Solicitação de material para feira de ciências",
    sender: "Juliana Lima (Professora)",
    recipient: "Responsáveis - 5º Ano B",
    date: "2025-04-07T13:30:00",
    status: "Não lida",
    priority: "Normal",
    content: "Para a feira de ciências, cada aluno deverá trazer os seguintes materiais: cartolina, cola, tesoura e material reciclável.",
    lastMessage: "Para a feira de ciências, cada aluno deverá trazer os seguintes materiais: cartolina, cola, tesoura e material reciclável.",
  },
  {
    id: 7,
    subject: "Confirmação de inscrição em atividade extracurricular",
    sender: "Secretaria",
    recipient: "Márcia Souza (Responsável)",
    date: "2025-04-06T10:15:00",
    status: "Lida",
    priority: "Baixa",
    content: "Confirmamos a inscrição do aluno João Souza na atividade extracurricular de xadrez às terças e quintas-feiras.",
    lastMessage: "Confirmamos a inscrição do aluno João Souza na atividade extracurricular de xadrez às terças e quintas-feiras.",
  },
  {
    id: 8,
    subject: "Lembrete: Entrega de trabalho",
    sender: "Roberto Santos (Professor)",
    recipient: "Alunos - 2º Ano B",
    date: "2025-04-05T09:00:00",
    status: "Lida",
    priority: "Alta",
    content: "Lembrem-se que o prazo para entrega do trabalho de história é amanhã. Não serão aceitos trabalhos após a data.",
    lastMessage: "Lembrem-se que o prazo para entrega do trabalho de história é amanhã. Não serão aceitos trabalhos após a data.",
  },
];

const Messages = () => {
  const [messages, setMessages] = useState(MESSAGES_DATA);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    dateFrom: "",
    dateTo: "",
    search: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  // Função para formatar a data
  const formatDate = (dateString) => {
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("pt-BR", options);
  };

  // Função para formatar a data no estilo WhatsApp
  const formatChatDate = (dateString) => {
    const messageDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Se for hoje, mostra apenas a hora
    if (messageDate.toDateString() === today.toDateString()) {
      return messageDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    }

    // Se for ontem, mostra "Ontem"
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Ontem";
    }

    // Se for esta semana, mostra o dia da semana
    const diff = (today.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24);
    if (diff < 7) {
      return messageDate.toLocaleDateString("pt-BR", { weekday: "short" });
    }

    // Caso contrário, mostra a data
    return messageDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" });
  };

  // Função para aplicar filtros
  const applyFilters = () => {
    let filteredMessages = [...MESSAGES_DATA];

    // Filtro por status
    if (filters.status) {
      filteredMessages = filteredMessages.filter((message) => message.status === filters.status);
    }

    // Filtro por prioridade
    if (filters.priority) {
      filteredMessages = filteredMessages.filter((message) => message.priority === filters.priority);
    }

    // Filtro por data (de)
    if (filters.dateFrom) {
      const dateFrom = new Date(filters.dateFrom);
      filteredMessages = filteredMessages.filter((message) => new Date(message.date) >= dateFrom);
    }

    // Filtro por data (até)
    if (filters.dateTo) {
      const dateTo = new Date(filters.dateTo);
      dateTo.setHours(23, 59, 59, 999); // Definir para o final do dia
      filteredMessages = filteredMessages.filter((message) => new Date(message.date) <= dateTo);
    }

    // Filtro por texto (busca)
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredMessages = filteredMessages.filter(
        (message) =>
          message.subject.toLowerCase().includes(searchTerm) ||
          message.sender.toLowerCase().includes(searchTerm) ||
          message.recipient.toLowerCase().includes(searchTerm) ||
          message.content.toLowerCase().includes(searchTerm)
      );
    }

    setMessages(filteredMessages);
  };

  // Aplicar filtros quando eles mudarem
  useEffect(() => {
    applyFilters();
  }, [filters]);

  // Função para limpar filtros
  const clearFilters = () => {
    setFilters({
      status: "",
      priority: "",
      dateFrom: "",
      dateTo: "",
      search: "",
    });
  };

  // Função para lidar com mudanças nos filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  // Função para excluir mensagem
  const handleDeleteMessage = (id) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
    toast.success("Mensagem excluída com sucesso!");
  };

  // Função para marcar como lida/não lida
  const handleToggleReadStatus = (id) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === id) {
          const newStatus = msg.status === "Não lida" ? "Lida" : "Não lida";
          return { ...msg, status: newStatus };
        }
        return msg;
      })
    );
  };

  // Função para obter iniciais do nome para o avatar
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // Função para truncar texto
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Breadcrumbs */}
          <Breadcrumbs title="Comunicação" breadcrumbItem="Mensagens" />

          <Row>
            <Col lg={12}>
              <Card className="overflow-hidden">
                <div className="chat-app-container">
                  {/* Cabeçalho */}
                  <div className="chat-app-header">
                    <div className="d-flex align-items-center justify-content-between p-3">
                      <h4 className="mb-0 font-size-18">Mensagens</h4>
                      <div className="d-flex gap-2">
                        <Button
                          color="primary"
                          onClick={() => navigate("/messages/create")}
                          className="d-flex align-items-center"
                        >
                          <i className="mdi mdi-plus me-1"></i> Nova
                        </Button>
                        <Button
                          color="light"
                          onClick={() => setShowFilters(!showFilters)}
                          className="d-flex align-items-center"
                        >
                          <i className="mdi mdi-filter-outline me-1"></i> Filtros
                        </Button>
                      </div>
                    </div>

                    {/* Barra de pesquisa */}
                    <div className="p-3 border-top border-bottom">
                      <InputGroup>
                        <InputGroupText className="bg-light border-0">
                          <i className="bx bx-search"></i>
                        </InputGroupText>
                        <Input
                          type="text"
                          name="search"
                          id="searchFilter"
                          placeholder="Buscar mensagens..."
                          value={filters.search}
                          onChange={handleFilterChange}
                          className="border-0 bg-light"
                        />
                      </InputGroup>
                    </div>

                    {/* Área de filtros (colapsável) */}
                    {showFilters && (
                      <div className="p-3 border-bottom bg-light">
                        <Row>
                          <Col md={3}>
                            <FormGroup>
                              <Label for="statusFilter">Status</Label>
                              <Input
                                type="select"
                                name="status"
                                id="statusFilter"
                                value={filters.status}
                                onChange={handleFilterChange}
                                className="form-select"
                              >
                                <option value="">Todos</option>
                                <option value="Não lida">Não lidas</option>
                                <option value="Lida">Lidas</option>
                                <option value="Respondida">Respondidas</option>
                              </Input>
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup>
                              <Label for="priorityFilter">Prioridade</Label>
                              <Input
                                type="select"
                                name="priority"
                                id="priorityFilter"
                                value={filters.priority}
                                onChange={handleFilterChange}
                                className="form-select"
                              >
                                <option value="">Todas</option>
                                <option value="Alta">Alta</option>
                                <option value="Normal">Normal</option>
                                <option value="Baixa">Baixa</option>
                              </Input>
                            </FormGroup>
                          </Col>
                          <Col md={2}>
                            <FormGroup>
                              <Label for="dateFromFilter">Data De</Label>
                              <Input
                                type="date"
                                name="dateFrom"
                                id="dateFromFilter"
                                value={filters.dateFrom}
                                onChange={handleFilterChange}
                              />
                            </FormGroup>
                          </Col>
                          <Col md={2}>
                            <FormGroup>
                              <Label for="dateToFilter">Data Até</Label>
                              <Input
                                type="date"
                                name="dateTo"
                                id="dateToFilter"
                                value={filters.dateTo}
                                onChange={handleFilterChange}
                              />
                            </FormGroup>
                          </Col>
                          <Col md={2} className="d-flex align-items-end">
                            <Button
                              color="secondary"
                              outline
                              onClick={clearFilters}
                              className="w-100"
                            >
                              <i className="bx bx-reset me-1"></i> Limpar
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    )}
                  </div>

                  {/* Lista de conversas */}
                  <div className="chat-message-list">
                    {messages.length > 0 ? (
                      <div className="chat-conversation-list">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`chat-conversation-item ${message.status === "Não lida" ? "unread" : ""} ${
                              message.priority === "Alta" ? "high-priority" : ""
                            }`}
                            onClick={() => navigate(`/messages/${message.id}`)}
                          >
                            <div className="chat-avatar">
                              <div className="avatar-circle">
                                {getInitials(message.sender)}
                              </div>
                              {message.status === "Não lida" && <span className="status-indicator"></span>}
                            </div>
                            
                            <div className="chat-content">
                              <div className="chat-header">
                                <h6 className="chat-name">{message.sender}</h6>
                                <div className="chat-time">
                                  {formatChatDate(message.date)}
                                  {message.status === "Não lida" && (
                                    <Badge color="danger" pill className="ms-2">
                                      1
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="chat-message">
                                <div className="chat-subject">
                                  {message.priority === "Alta" && (
                                    <i className="mdi mdi-alert-circle-outline text-danger me-1" title="Prioridade Alta"></i>
                                  )}
                                  {message.subject}
                                </div>
                                <p className="chat-preview">{truncateText(message.lastMessage, 60)}</p>
                              </div>
                            </div>
                            
                            <div className="chat-actions">
                              <UncontrolledDropdown
                                onClick={(e) => e.stopPropagation()}
                                direction="start"
                              >
                                <DropdownToggle tag="a" className="chat-action-toggle">
                                  <i className="bx bx-dots-vertical-rounded"></i>
                                </DropdownToggle>
                                <DropdownMenu>
                                  <DropdownItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleReadStatus(message.id);
                                      toast.success(
                                        message.status === "Não lida"
                                          ? "Mensagem marcada como lida!"
                                          : "Mensagem marcada como não lida!"
                                      );
                                    }}
                                  >
                                    <i
                                      className={`${
                                        message.status === "Não lida"
                                          ? "mdi mdi-email-open-outline"
                                          : "mdi mdi-email-outline"
                                      } me-2`}
                                    ></i>
                                    {message.status === "Não lida" ? "Marcar como lida" : "Marcar como não lida"}
                                  </DropdownItem>
                                  <DropdownItem divider />
                                  <DropdownItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteMessage(message.id);
                                    }}
                                  >
                                    <i className="mdi mdi-delete-outline me-2"></i>
                                    Excluir
                                  </DropdownItem>
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="chat-empty-state">
                        <i className="mdi mdi-chat-remove-outline chat-empty-icon"></i>
                        <h4>Nenhuma mensagem encontrada</h4>
                        <p className="text-muted">
                          Não foram encontradas mensagens com os filtros aplicados.
                        </p>
                        <Button color="primary" onClick={clearFilters}>
                          <i className="bx bx-reset me-1"></i> Limpar filtros
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

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

export default Messages;
