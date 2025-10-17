import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Input,
  Button,
  InputGroup,
  Badge,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SimpleBar from "simplebar-react";

// Componentes
import Breadcrumbs from "../../components/Common/Breadcrumb";

// CSS para o chat
import "./chat.css";

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
    content:
      "Olá professor, gostaria de saber se a prova de matemática vai incluir o conteúdo de geometria que foi passado na última aula.",
  },
  {
    id: 2,
    subject: "Solicitação de reunião",
    sender: "Maria Oliveira (Coordenadora)",
    recipient: "Todos os professores",
    date: "2025-04-11T14:15:00",
    status: "Lida",
    priority: "Alta",
    content:
      "Prezados professores, solicito a presença de todos para uma reunião extraordinária na próxima sexta-feira às 15h.",
  },
  {
    id: 3,
    subject: "Autorização para passeio escolar",
    sender: "Ana Souza (Secretaria)",
    recipient: "Responsáveis - 3º Ano A",
    date: "2025-04-10T09:45:00",
    status: "Lida",
    priority: "Alta",
    content:
      "Prezados responsáveis, solicitamos a autorização para o passeio escolar que ocorrerá no dia 20/04. Por favor, assinem o formulário anexo.",
  },
  {
    id: 4,
    subject: "Dúvida sobre material escolar",
    sender: "Carlos Ferreira (Responsável)",
    recipient: "Secretaria",
    date: "2025-04-09T16:20:00",
    status: "Respondida",
    priority: "Normal",
    content:
      "Gostaria de saber se é necessário comprar o livro de inglês para o próximo bimestre.",
  },
  {
    id: 5,
    subject: "Aviso sobre alteração de horário",
    sender: "Pedro Almeida (Diretor)",
    recipient: "Toda a escola",
    date: "2025-04-08T11:00:00",
    status: "Lida",
    priority: "Normal",
    content:
      "Informamos que, devido a manutenção elétrica, as aulas do período da tarde serão encerradas às 16h na próxima segunda-feira.",
  },
  {
    id: 6,
    subject: "Solicitação de material para feira de ciências",
    sender: "Juliana Lima (Professora)",
    recipient: "Responsáveis - 5º Ano B",
    date: "2025-04-07T13:30:00",
    status: "Não lida",
    priority: "Normal",
    content:
      "Para a feira de ciências, cada aluno deverá trazer os seguintes materiais: cartolina, cola, tesoura e material reciclável.",
  },
  {
    id: 7,
    subject: "Confirmação de inscrição em atividade extracurricular",
    sender: "Secretaria",
    recipient: "Márcia Souza (Responsável)",
    date: "2025-04-06T10:15:00",
    status: "Lida",
    priority: "Baixa",
    content:
      "Confirmamos a inscrição do aluno João Souza na atividade extracurricular de xadrez às terças e quintas-feiras.",
  },
  {
    id: 8,
    subject: "Lembrete: Entrega de trabalho",
    sender: "Roberto Santos (Professor)",
    recipient: "Alunos - 2º Ano B",
    date: "2025-04-05T09:00:00",
    status: "Lida",
    priority: "Alta",
    content:
      "Lembrem-se que o prazo para entrega do trabalho de história é amanhã. Não serão aceitos trabalhos após a data.",
  },
];

// Histórico de mensagens simulado para cada conversa
const CHAT_HISTORY = {
  1: [
    {
      id: 1,
      sender: "João Silva (Responsável)",
      content:
        "Olá professor, gostaria de saber se a prova de matemática vai incluir o conteúdo de geometria que foi passado na última aula.",
      timestamp: "2025-04-12T10:30:00",
      isMe: false,
    },
  ],
  2: [
    {
      id: 1,
      sender: "Maria Oliveira (Coordenadora)",
      content:
        "Prezados professores, solicito a presença de todos para uma reunião extraordinária na próxima sexta-feira às 15h.",
      timestamp: "2025-04-11T14:15:00",
      isMe: false,
    },
    {
      id: 2,
      sender: "Você",
      content:
        "Olá Maria, estarei presente na reunião. Poderia me informar a pauta?",
      timestamp: "2025-04-11T15:20:00",
      isMe: true,
    },
    {
      id: 3,
      sender: "Maria Oliveira (Coordenadora)",
      content:
        "Claro! Vamos discutir o planejamento do próximo bimestre e as atividades extracurriculares.",
      timestamp: "2025-04-11T16:05:00",
      isMe: false,
    },
  ],
  3: [
    {
      id: 1,
      sender: "Ana Souza (Secretaria)",
      content:
        "Prezados responsáveis, solicitamos a autorização para o passeio escolar que ocorrerá no dia 20/04. Por favor, assinem o formulário anexo.",
      timestamp: "2025-04-10T09:45:00",
      isMe: false,
    },
  ],
  4: [
    {
      id: 1,
      sender: "Carlos Ferreira (Responsável)",
      content:
        "Gostaria de saber se é necessário comprar o livro de inglês para o próximo bimestre.",
      timestamp: "2025-04-09T16:20:00",
      isMe: false,
    },
    {
      id: 2,
      sender: "Você",
      content:
        "Olá Carlos, sim, o livro de inglês será utilizado a partir da segunda semana do próximo bimestre.",
      timestamp: "2025-04-09T17:30:00",
      isMe: true,
    },
    {
      id: 3,
      sender: "Carlos Ferreira (Responsável)",
      content: "Obrigado pela informação. Onde posso adquirir o livro?",
      timestamp: "2025-04-09T18:15:00",
      isMe: false,
    },
    {
      id: 4,
      sender: "Você",
      content:
        "O livro pode ser adquirido na livraria do bairro ou pela internet. Enviarei as informações detalhadas por e-mail ainda hoje.",
      timestamp: "2025-04-09T18:30:00",
      isMe: true,
    },
    {
      id: 5,
      sender: "Carlos Ferreira (Responsável)",
      content: "Perfeito, aguardarei o e-mail. Muito obrigado!",
      timestamp: "2025-04-09T18:35:00",
      isMe: false,
    },
  ],
};

const ReplyMessage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const messageId = parseInt(id);

  const [contact, setContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [attachments, setAttachments] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Carregar os dados do contato e histórico de mensagens
  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      const originalMessage = MESSAGES_DATA.find((msg) => msg.id === messageId);

      if (originalMessage) {
        setContact(originalMessage);

        // Carregar histórico de mensagens ou criar um novo com apenas a mensagem original
        const history = CHAT_HISTORY[messageId] || [
          {
            id: 1,
            sender: originalMessage.sender,
            content: originalMessage.content,
            timestamp: originalMessage.date,
            isMe: false,
          },
        ];

        setMessages(history);
      } else {
        toast.error("Conversa não encontrada!");
        navigate("/messages");
      }

      setLoading(false);
    }, 500);
  }, [messageId, navigate]);

  // Rolar para a última mensagem quando as mensagens mudam
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Formatar data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Formatar data completa
  const formatFullDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Verificar se a data é de hoje
  const isToday = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Obter o dia da mensagem
  const getMessageDay = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (isToday(dateString)) {
      return "Hoje";
    } else if (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    ) {
      return "Ontem";
    } else {
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
  };

  // Agrupar mensagens por dia
  const groupMessagesByDay = (messages) => {
    const groups = {};

    messages.forEach((message) => {
      const day = getMessageDay(message.timestamp);
      if (!groups[day]) {
        groups[day] = [];
      }
      groups[day].push(message);
    });

    return Object.entries(groups).map(([day, messages]) => ({
      day,
      messages,
    }));
  };

  // Enviar nova mensagem
  const handleSendMessage = () => {
    if (newMessage.trim() === "" && attachments.length === 0) return;

    const newMsg = {
      id: messages.length + 1,
      sender: "Você",
      content: newMessage,
      timestamp: new Date().toISOString(),
      isMe: true,
      attachments: [...attachments],
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");
    setAttachments([]);

    toast.success("Mensagem enviada com sucesso!");
  };

  // Lidar com tecla Enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Lidar com upload de arquivos
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments([...attachments, ...files]);
  };

  // Remover anexo
  const removeAttachment = (index) => {
    const updatedAttachments = [...attachments];
    updatedAttachments.splice(index, 1);
    setAttachments(updatedAttachments);
  };

  // Toggle dropdown
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Formatar nome para avatar
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Comunicação" breadcrumbItem="Conversa" />

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody className="p-0">
                  {loading ? (
                    <div className="text-center p-5">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Carregando...</span>
                      </div>
                      <p className="mt-2">Carregando conversa...</p>
                    </div>
                  ) : contact ? (
                    <div className="chat-wrapper">
                      {/* Cabeçalho do chat */}
                      <div className="p-3 border-bottom chat-header">
                        <Row className="align-items-center">
                          <Col>
                            <div className="d-flex align-items-center">
                              <div className="me-3">
                                <div className="avatar-xs">
                                  <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                    {getInitials(contact.sender)}
                                  </span>
                                </div>
                              </div>
                              <div className="flex-grow-1">
                                <h5 className="font-size-15 mb-1">
                                  {contact.sender}
                                </h5>
                                <p className="text-muted mb-0">
                                  {contact.status === "Não lida" ? (
                                    <Badge color="danger" className="me-1">
                                      Não lida
                                    </Badge>
                                  ) : contact.status === "Respondida" ? (
                                    <Badge color="success" className="me-1">
                                      Respondida
                                    </Badge>
                                  ) : (
                                    <Badge color="info" className="me-1">
                                      Lida
                                    </Badge>
                                  )}
                                  {contact.priority === "Alta" ? (
                                    <Badge color="danger">
                                      Prioridade Alta
                                    </Badge>
                                  ) : contact.priority === "Baixa" ? (
                                    <Badge color="warning">
                                      Prioridade Baixa
                                    </Badge>
                                  ) : (
                                    <Badge color="secondary">
                                      Prioridade Normal
                                    </Badge>
                                  )}
                                </p>
                              </div>
                            </div>
                          </Col>
                          <Col xs="auto">
                            <div className="d-flex gap-2">
                              <Button
                                color="light"
                                size="sm"
                                onClick={() => {
                                  toast.success(
                                    "Mensagem marcada como importante!"
                                  );
                                }}
                                title="Marcar como importante"
                              >
                                <i className="mdi mdi-star-outline"></i>
                              </Button>
                              <Button
                                color="light"
                                size="sm"
                                onClick={() => {
                                  navigate(`/messages/forward/${messageId}`);
                                }}
                                title="Encaminhar mensagem"
                              >
                                <i className="mdi mdi-share-variant-outline"></i>
                              </Button>
                              <Button
                                color="light"
                                size="sm"
                                onClick={() => {
                                  toast.success(
                                    "Conversa finalizada com sucesso!"
                                  );
                                  setTimeout(() => navigate("/messages"), 1500);
                                }}
                                title="Finalizar conversa"
                              >
                                <i className="mdi mdi-check-circle-outline"></i>
                              </Button>
                              <Dropdown
                                isOpen={dropdownOpen}
                                toggle={toggleDropdown}
                              >
                                <DropdownToggle color="light" size="sm">
                                  <i className="mdi mdi-dots-vertical"></i>
                                </DropdownToggle>
                                <DropdownMenu end>
                                  <DropdownItem
                                    onClick={() => navigate("/messages")}
                                  >
                                    <i className="mdi mdi-arrow-left-circle-outline me-2"></i>
                                    Voltar para mensagens
                                  </DropdownItem>
                                  <DropdownItem divider />
                                  <DropdownItem
                                    onClick={() => {
                                      toast.error("Mensagem excluída!");
                                      setTimeout(
                                        () => navigate("/messages"),
                                        1500
                                      );
                                    }}
                                  >
                                    <i className="mdi mdi-delete-outline me-2"></i>
                                    Excluir conversa
                                  </DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                            </div>
                          </Col>
                        </Row>
                      </div>

                      {/* Área de mensagens */}
                      <SimpleBar
                        style={{ height: "calc(100vh - 320px)" }}
                        className="chat-conversation p-3"
                      >
                        {groupMessagesByDay(messages).map(
                          (group, groupIndex) => (
                            <div key={groupIndex}>
                              <div className="chat-day-title">
                                <span className="title">{group.day}</span>
                              </div>

                              {group.messages.map((msg, msgIndex) => (
                                <div
                                  key={msgIndex}
                                  className={`chat-message ${
                                    msg.isMe
                                      ? "chat-message-right"
                                      : "chat-message-left"
                                  } mb-3`}
                                >
                                  {!msg.isMe && (
                                    <div className="avatar-xs me-2">
                                      <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                        {getInitials(msg.sender)}
                                      </span>
                                    </div>
                                  )}

                                  <div className="conversation-content">
                                    {!msg.isMe && (
                                      <div className="sender-name mb-1 font-size-11 text-muted">
                                        {msg.sender}
                                      </div>
                                    )}

                                    <div
                                      className={`message-bubble p-2 ${
                                        msg.isMe
                                          ? "bg-primary text-white"
                                          : "bg-light"
                                      }`}
                                    >
                                      <div className="message-text mb-1">
                                        {msg.content}
                                      </div>

                                      {msg.attachments &&
                                        msg.attachments.length > 0 && (
                                          <div className="message-attachments mt-2 mb-1">
                                            {msg.attachments.map(
                                              (file, fileIndex) => (
                                                <div
                                                  key={fileIndex}
                                                  className="attachment-item"
                                                >
                                                  <i className="mdi mdi-file-document-outline me-1"></i>
                                                  <span>{file.name}</span>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        )}

                                      <div
                                        className={`message-time font-size-10 ${
                                          msg.isMe
                                            ? "text-white-50"
                                            : "text-muted"
                                        }`}
                                      >
                                        {formatDate(msg.timestamp)}
                                        {msg.isMe && (
                                          <i className="mdi mdi-check-all ms-1"></i>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )
                        )}
                        <div ref={messagesEndRef} />
                      </SimpleBar>

                      {/* Área de anexos */}
                      {attachments.length > 0 && (
                        <div className="chat-attachments border-top border-bottom p-2">
                          <div className="d-flex flex-wrap gap-2">
                            {attachments.map((file, index) => (
                              <div key={index} className="attachment-preview">
                                <div className="attachment-box">
                                  <i className="mdi mdi-file-document-outline font-size-24"></i>
                                  <span className="attachment-name">
                                    {file.name.length > 15
                                      ? file.name.substring(0, 12) + "..."
                                      : file.name}
                                  </span>
                                  <button
                                    type="button"
                                    className="btn-close attachment-remove"
                                    onClick={() => removeAttachment(index)}
                                  ></button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Área de entrada de mensagem */}
                      <div className="chat-input-section p-3 border-top">
                        <Row>
                          <Col>
                            <InputGroup>
                              <Button
                                color="light"
                                onClick={() => fileInputRef.current.click()}
                              >
                                <i className="mdi mdi-paperclip"></i>
                                <input
                                  type="file"
                                  ref={fileInputRef}
                                  style={{ display: "none" }}
                                  multiple
                                  onChange={handleFileChange}
                                />
                              </Button>
                              <Input
                                type="textarea"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Digite uma mensagem..."
                                className="form-control chat-input"
                                rows="1"
                              />
                              <Button
                                color="primary"
                                onClick={handleSendMessage}
                                disabled={
                                  newMessage.trim() === "" &&
                                  attachments.length === 0
                                }
                              >
                                <i className="mdi mdi-send"></i>
                              </Button>
                            </InputGroup>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-5">
                      <div className="avatar-lg mx-auto mb-4">
                        <div className="avatar-title bg-light text-primary rounded-circle">
                          <i className="mdi mdi-chat-processing font-size-24"></i>
                        </div>
                      </div>
                      <h4>Conversa não encontrada</h4>
                      <p className="text-muted">
                        A conversa que você está procurando não existe ou foi
                        excluída.
                      </p>
                      <Button
                        color="primary"
                        onClick={() => navigate("/messages")}
                      >
                        <i className="bx bx-arrow-back me-1"></i> Voltar para
                        mensagens
                      </Button>
                    </div>
                  )}
                </CardBody>
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

export default ReplyMessage;
