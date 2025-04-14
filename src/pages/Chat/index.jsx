import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Input,
  Button,
  InputGroup,
  Badge,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import { Link } from "react-router-dom";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";

// Componentes
import Breadcrumbs from "../../components/Common/Breadcrumb";

// Dados de exemplo para contatos
const CONTACTS = [
  {
    id: 1,
    name: "Roberto Santos",
    role: "Professor - Matemática",
    avatar: null,
    status: "online",
    unread: 0,
    lastMessage: "Vamos agendar a reunião para amanhã?",
    lastMessageTime: "10:30"
  },
  {
    id: 2,
    name: "Juliana Lima",
    role: "Professora - Português",
    avatar: null,
    status: "online",
    unread: 3,
    lastMessage: "Preciso conversar sobre o projeto de leitura",
    lastMessageTime: "09:45"
  },
  {
    id: 3,
    name: "Maria Oliveira",
    role: "Coordenadora",
    avatar: null,
    status: "offline",
    unread: 0,
    lastMessage: "A reunião foi confirmada para sexta-feira",
    lastMessageTime: "Ontem"
  },
  {
    id: 4,
    name: "Carlos Silva",
    role: "Responsável - Ana Silva",
    avatar: null,
    status: "online",
    unread: 2,
    lastMessage: "Gostaria de agendar uma reunião",
    lastMessageTime: "Ontem"
  },
  {
    id: 5,
    name: "Pedro Almeida",
    role: "Diretor",
    avatar: null,
    status: "offline",
    unread: 0,
    lastMessage: "Vamos discutir o calendário na próxima semana",
    lastMessageTime: "23/03"
  },
  {
    id: 6,
    name: "Ana Souza",
    role: "Secretaria",
    avatar: null,
    status: "online",
    unread: 0,
    lastMessage: "Os documentos estão prontos para retirada",
    lastMessageTime: "22/03"
  },
  {
    id: 7,
    name: "Turma 1º Ano A",
    role: "Grupo",
    avatar: null,
    status: "group",
    unread: 5,
    lastMessage: "Lembrete: Entrega do trabalho amanhã",
    lastMessageTime: "Hoje"
  },
  {
    id: 8,
    name: "Professores",
    role: "Grupo",
    avatar: null,
    status: "group",
    unread: 0,
    lastMessage: "Reunião pedagógica confirmada",
    lastMessageTime: "Hoje"
  }
];

// Dados de exemplo para mensagens
const CHAT_MESSAGES = {
  2: [
    {
      id: 1,
      sender: "me",
      content: "Olá Juliana, tudo bem?",
      time: "09:30",
      date: "Hoje"
    },
    {
      id: 2,
      sender: "other",
      content: "Olá! Tudo ótimo e com você?",
      time: "09:32",
      date: "Hoje"
    },
    {
      id: 3,
      sender: "me",
      content: "Estou bem, obrigado! Queria falar sobre o projeto de leitura para o 2º ano.",
      time: "09:35",
      date: "Hoje"
    },
    {
      id: 4,
      sender: "other",
      content: "Claro! Tenho algumas ideias para compartilhar.",
      time: "09:36",
      date: "Hoje"
    },
    {
      id: 5,
      sender: "other",
      content: "Podemos incluir uma atividade de dramatização dos livros lidos.",
      time: "09:37",
      date: "Hoje"
    },
    {
      id: 6,
      sender: "other",
      content: "E também pensei em fazer um mural com resenhas dos alunos.",
      time: "09:38",
      date: "Hoje"
    },
    {
      id: 7,
      sender: "me",
      content: "Excelentes ideias! Podemos implementar ambas.",
      time: "09:40",
      date: "Hoje"
    },
    {
      id: 8,
      sender: "me",
      content: "Quando podemos nos reunir para planejar melhor?",
      time: "09:41",
      date: "Hoje"
    },
    {
      id: 9,
      sender: "other",
      content: "Que tal amanhã depois da aula? Por volta das 15h?",
      time: "09:43",
      date: "Hoje"
    },
    {
      id: 10,
      sender: "other",
      content: "Podemos usar a sala dos professores.",
      time: "09:44",
      date: "Hoje"
    },
    {
      id: 11,
      sender: "other",
      content: "Preciso conversar sobre o projeto de leitura",
      time: "09:45",
      date: "Hoje"
    }
  ],
  7: [
    {
      id: 1,
      sender: "me",
      content: "Olá turma! Tudo bem com vocês?",
      time: "08:30",
      date: "Hoje"
    },
    {
      id: 2,
      sender: "other",
      name: "Ana Silva",
      content: "Tudo bem, professor!",
      time: "08:32",
      date: "Hoje"
    },
    {
      id: 3,
      sender: "other",
      name: "João Souza",
      content: "Bom dia!",
      time: "08:33",
      date: "Hoje"
    },
    {
      id: 4,
      sender: "me",
      content: "Gostaria de lembrar a todos sobre a entrega do trabalho de ciências amanhã.",
      time: "08:35",
      date: "Hoje"
    },
    {
      id: 5,
      sender: "me",
      content: "Não esqueçam que deve conter introdução, desenvolvimento e conclusão.",
      time: "08:36",
      date: "Hoje"
    },
    {
      id: 6,
      sender: "other",
      name: "Maria Oliveira",
      content: "Professor, podemos entregar em dupla?",
      time: "08:40",
      date: "Hoje"
    },
    {
      id: 7,
      sender: "me",
      content: "Sim, Maria. Trabalhos em dupla são permitidos.",
      time: "08:42",
      date: "Hoje"
    },
    {
      id: 8,
      sender: "other",
      name: "Pedro Santos",
      content: "Qual o tamanho mínimo do trabalho?",
      time: "08:45",
      date: "Hoje"
    },
    {
      id: 9,
      sender: "me",
      content: "O trabalho deve ter no mínimo 3 páginas, Pedro.",
      time: "08:47",
      date: "Hoje"
    },
    {
      id: 10,
      sender: "me",
      content: "Alguma outra dúvida sobre o trabalho?",
      time: "08:50",
      date: "Hoje"
    },
    {
      id: 11,
      sender: "other",
      name: "Ana Silva",
      content: "Podemos incluir imagens?",
      time: "08:52",
      date: "Hoje"
    },
    {
      id: 12,
      sender: "me",
      content: "Sim, Ana. Imagens são bem-vindas e contam como conteúdo.",
      time: "08:55",
      date: "Hoje"
    },
    {
      id: 13,
      sender: "me",
      content: "Lembrete: Entrega do trabalho amanhã",
      time: "09:00",
      date: "Hoje"
    }
  ]
};

const Chat = () => {
  const [contacts, setContacts] = useState(CONTACTS);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, unread, groups
  
  const messagesEndRef = useRef(null);
  
  // Filtrar contatos com base no termo de busca e filtro selecionado
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         contact.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    if (filter === "unread") return matchesSearch && contact.unread > 0;
    if (filter === "groups") return matchesSearch && contact.status === "group";
    
    return matchesSearch;
  });
  
  // Carregar mensagens quando um contato é selecionado
  useEffect(() => {
    if (activeContact) {
      const contactMessages = CHAT_MESSAGES[activeContact.id] || [];
      setMessages(contactMessages);
      
      // Marcar mensagens como lidas
      if (activeContact.unread > 0) {
        setContacts(prevContacts => 
          prevContacts.map(contact => 
            contact.id === activeContact.id 
              ? { ...contact, unread: 0 } 
              : contact
          )
        );
      }
    }
  }, [activeContact]);
  
  // Rolar para a última mensagem quando as mensagens mudam
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  // Enviar nova mensagem
  const handleSendMessage = () => {
    if (newMessage.trim() === "" || !activeContact) return;
    
    const newMsg = {
      id: messages.length + 1,
      sender: "me",
      content: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: "Hoje"
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage("");
  };
  
  // Formatar nome do contato para avatar
  const getInitials = (name) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };
  
  // Renderizar avatar do contato
  const renderAvatar = (contact) => {
    if (contact.avatar) {
      return <img src={contact.avatar} alt={contact.name} className="rounded-circle" width="42" />;
    }
    
    let bgColor = "bg-primary";
    if (contact.status === "group") {
      bgColor = "bg-info";
    }
    
    return (
      <div className={`avatar-xs ${bgColor} rounded-circle text-white`}>
        <span className="avatar-title">{getInitials(contact.name)}</span>
      </div>
    );
  };
  
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Comunicação" breadcrumbItem="Chat" />
          
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody className="p-0">
                  <Row className="g-0">
                    {/* Lista de contatos */}
                    <Col lg={3} className="border-end">
                      <div className="p-3 border-bottom">
                        <div className="d-flex align-items-center">
                          <div className="flex-grow-1">
                            <h5 className="font-size-16 mb-0">Mensagens</h5>
                          </div>
                          <div className="flex-shrink-0">
                            <UncontrolledDropdown>
                              <DropdownToggle tag="a" className="text-muted">
                                <i className="bx bx-dots-vertical-rounded font-size-20"></i>
                              </DropdownToggle>
                              <DropdownMenu>
                                <DropdownItem href="#">Nova mensagem</DropdownItem>
                                <DropdownItem href="#">Arquivar todas</DropdownItem>
                                <DropdownItem href="#">Marcar todas como lidas</DropdownItem>
                              </DropdownMenu>
                            </UncontrolledDropdown>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 border-bottom">
                        <div className="search-box">
                          <Input
                            type="text"
                            className="form-control bg-light border-0"
                            placeholder="Buscar contatos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                          <i className="bx bx-search font-size-16"></i>
                        </div>
                      </div>
                      
                      <div className="p-3 border-bottom">
                        <Nav pills className="nav-pills-custom">
                          <NavItem>
                            <NavLink
                              className={filter === "all" ? "active" : ""}
                              onClick={() => setFilter("all")}
                            >
                              Todos
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink
                              className={filter === "unread" ? "active" : ""}
                              onClick={() => setFilter("unread")}
                            >
                              Não lidas
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink
                              className={filter === "groups" ? "active" : ""}
                              onClick={() => setFilter("groups")}
                            >
                              Grupos
                            </NavLink>
                          </NavItem>
                        </Nav>
                      </div>
                      
                      <SimpleBar style={{ height: "calc(100vh - 350px)" }}>
                        <div className="p-3">
                          {filteredContacts.map((contact) => (
                            <div
                              key={contact.id}
                              className={`d-flex align-items-center p-2 rounded ${
                                activeContact?.id === contact.id ? "bg-light" : ""
                              } cursor-pointer`}
                              onClick={() => setActiveContact(contact)}
                            >
                              <div className="position-relative">
                                {renderAvatar(contact)}
                                {contact.status === "online" && (
                                  <span className="user-status online"></span>
                                )}
                              </div>
                              <div className="flex-grow-1 overflow-hidden ms-2">
                                <h5 className="font-size-14 mb-0 text-truncate">
                                  {contact.name}
                                  {contact.unread > 0 && (
                                    <Badge color="danger" className="float-end rounded-pill">
                                      {contact.unread}
                                    </Badge>
                                  )}
                                </h5>
                                <p className="font-size-13 text-muted mb-0 text-truncate">
                                  {contact.lastMessage}
                                </p>
                              </div>
                              <div className="flex-shrink-0 ms-3">
                                <span className="font-size-11 text-muted">
                                  {contact.lastMessageTime}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </SimpleBar>
                    </Col>
                    
                    {/* Área de chat */}
                    <Col lg={9}>
                      {activeContact ? (
                        <div className="d-flex flex-column h-100">
                          {/* Cabeçalho do chat */}
                          <div className="p-3 border-bottom">
                            <div className="d-flex align-items-center">
                              <div className="d-flex align-items-center">
                                {renderAvatar(activeContact)}
                                <div className="ms-2">
                                  <h5 className="font-size-15 mb-0">{activeContact.name}</h5>
                                  <p className="font-size-13 text-muted mb-0">
                                    {activeContact.status === "online" ? (
                                      <span className="text-success">Online</span>
                                    ) : activeContact.status === "group" ? (
                                      <span>Grupo</span>
                                    ) : (
                                      <span>Offline</span>
                                    )}
                                    <span className="mx-1">•</span>
                                    <span>{activeContact.role}</span>
                                  </p>
                                </div>
                              </div>
                              <div className="flex-grow-1"></div>
                              <div>
                                <UncontrolledDropdown>
                                  <DropdownToggle tag="a" className="text-muted">
                                    <i className="bx bx-dots-vertical-rounded font-size-20"></i>
                                  </DropdownToggle>
                                  <DropdownMenu>
                                    <DropdownItem href="#">Ver perfil</DropdownItem>
                                    <DropdownItem href="#">Arquivar conversa</DropdownItem>
                                    <DropdownItem href="#">Silenciar notificações</DropdownItem>
                                    <DropdownItem href="#" className="text-danger">Excluir conversa</DropdownItem>
                                  </DropdownMenu>
                                </UncontrolledDropdown>
                              </div>
                            </div>
                          </div>
                          
                          {/* Mensagens */}
                          <SimpleBar style={{ height: "calc(100vh - 350px)" }} className="p-3 chat-conversation">
                            {messages.map((msg, index) => {
                              const isFirstMessageOfDate = index === 0 || messages[index - 1].date !== msg.date;
                              
                              return (
                                <React.Fragment key={msg.id}>
                                  {isFirstMessageOfDate && (
                                    <div className="chat-day-title">
                                      <span className="title">{msg.date}</span>
                                    </div>
                                  )}
                                  
                                  <div className={`d-flex ${msg.sender === "me" ? "justify-content-end" : ""} mb-4`}>
                                    {msg.sender !== "me" && activeContact.status === "group" && msg.name && (
                                      <div className="avatar-xs me-2 align-self-end">
                                        <span className="avatar-title rounded-circle bg-secondary text-white">
                                          {getInitials(msg.name)}
                                        </span>
                                      </div>
                                    )}
                                    
                                    <div className={`${msg.sender === "me" ? "chat-send" : "chat-receive"}`}>
                                      {msg.sender !== "me" && activeContact.status === "group" && msg.name && (
                                        <p className="chat-user-name mb-1">{msg.name}</p>
                                      )}
                                      <div className={`p-3 rounded ${msg.sender === "me" ? "bg-primary text-white" : "bg-light"}`}>
                                        <p className="mb-0">{msg.content}</p>
                                      </div>
                                      <p className="chat-time mb-0 text-muted">
                                        <i className="bx bx-time-five align-middle me-1"></i> {msg.time}
                                      </p>
                                    </div>
                                  </div>
                                </React.Fragment>
                              );
                            })}
                            <div ref={messagesEndRef} />
                          </SimpleBar>
                          
                          {/* Área de entrada de mensagem */}
                          <div className="p-3 border-top">
                            <div className="d-flex align-items-center">
                              <div className="flex-grow-1">
                                <InputGroup>
                                  <Input
                                    type="text"
                                    className="form-control bg-light border-0"
                                    placeholder="Digite sua mensagem..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => {
                                      if (e.key === "Enter") {
                                        handleSendMessage();
                                      }
                                    }}
                                  />
                                  <Button color="primary" onClick={handleSendMessage}>
                                    <i className="mdi mdi-send"></i>
                                  </Button>
                                </InputGroup>
                              </div>
                              <div className="flex-shrink-0 ms-2">
                                <Button color="light" type="button">
                                  <i className="bx bx-paperclip"></i>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="d-flex flex-column justify-content-center align-items-center h-100 p-4">
                          <div className="text-center">
                            <div className="avatar-lg mx-auto mb-4">
                              <div className="avatar-title bg-light text-primary rounded-circle">
                                <i className="bx bx-message-dots font-size-24"></i>
                              </div>
                            </div>
                            <h4>Bem-vindo ao Chat</h4>
                            <p className="text-muted mb-4">
                              Selecione um contato para iniciar uma conversa ou criar uma nova mensagem.
                            </p>
                            <Button color="primary">
                              <i className="bx bx-message-square-dots me-1"></i> Nova Mensagem
                            </Button>
                          </div>
                        </div>
                      )}
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Chat;
