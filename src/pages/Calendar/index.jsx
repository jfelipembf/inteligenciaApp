import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";

import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";

//Import Breadcrumb
import Breadcrumbs from "/src/components/Common/Breadcrumb";

import {
  addNewEvent as onAddNewEvent,
  deleteEvent as onDeleteEvent,
  updateEvent as onUpdateEvent,
} from "/src/store/actions";

import DeleteModal from "./DeleteModal";
import GradesModal from "./AttendanceModal";

//redux
import { useDispatch } from "react-redux";

import { Draggable } from "@fullcalendar/interaction";
import allLocales from '@fullcalendar/core/locales-all';

const Calender = (props) => {
  //meta title
  document.title = "Calendário Escolar | Painel Escolar";

  const dispatch = useDispatch();

  // Dados fictícios para eventos de aulas de todos os anos e séries
  const initialEvents = [
    // 1º Ano - Ensino Fundamental
    {
      id: 1,
      title: "Português",
      start: new Date(),
      className: "bg-light border",
      professor: "Maria Silva",
      serie: "Fundamental",
      ano: "1º Ano",
      turma: "A",
      categoria: "Ensino Fundamental - 1º Ano"
    },
    {
      id: 2,
      title: "Matemática",
      start: new Date(new Date().setHours(new Date().getHours() + 2)),
      className: "bg-light border",
      professor: "João Santos",
      serie: "Fundamental",
      ano: "1º Ano",
      turma: "A",
      categoria: "Ensino Fundamental - 1º Ano"
    },
    {
      id: 3,
      title: "Ciências",
      start: new Date(new Date().setDate(new Date().getDate() + 1)),
      className: "bg-light border",
      professor: "Ana Oliveira",
      serie: "Fundamental",
      ano: "1º Ano",
      turma: "B",
      categoria: "Ensino Fundamental - 1º Ano"
    },
    {
      id: 4,
      title: "História",
      start: new Date(new Date().setDate(new Date().getDate() + 1)),
      className: "bg-light border",
      professor: "Carlos Mendes",
      serie: "Fundamental",
      ano: "1º Ano",
      turma: "B",
      end: new Date(new Date().setDate(new Date().getDate() + 1)).setHours(new Date().getHours() + 2),
      categoria: "Ensino Fundamental - 1º Ano"
    },
    {
      id: 20,
      title: "Geografia",
      start: new Date(new Date().setDate(new Date().getDate() + 2)),
      className: "bg-light border",
      professor: "Roberta Lima",
      serie: "Fundamental",
      ano: "1º Ano",
      turma: "C",
      categoria: "Ensino Fundamental - 1º Ano"
    },
    
    // 2º Ano - Ensino Fundamental
    {
      id: 5,
      title: "Português",
      start: new Date(new Date().setDate(new Date().getDate() + 2)),
      className: "bg-light border",
      professor: "Fernanda Costa",
      serie: "Fundamental",
      ano: "2º Ano",
      turma: "A",
      categoria: "Ensino Fundamental - 2º Ano"
    },
    {
      id: 6,
      title: "Matemática",
      start: new Date(new Date().setDate(new Date().getDate() + 2)).setHours(new Date().getHours() + 2),
      className: "bg-light border",
      professor: "Ricardo Souza",
      serie: "Fundamental",
      ano: "2º Ano",
      turma: "A",
      categoria: "Ensino Fundamental - 2º Ano"
    },
    {
      id: 7,
      title: "Geografia",
      start: new Date(new Date().setDate(new Date().getDate() + 3)),
      className: "bg-light border",
      professor: "Marcos Pereira",
      serie: "Fundamental",
      ano: "2º Ano",
      turma: "B",
      categoria: "Ensino Fundamental - 2º Ano"
    },
    
    // 3º Ano - Ensino Fundamental
    {
      id: 8,
      title: "Artes",
      start: new Date(new Date().setDate(new Date().getDate() + 4)),
      className: "bg-light border",
      professor: "Juliana Alves",
      serie: "Fundamental",
      ano: "3º Ano",
      turma: "A",
      categoria: "Ensino Fundamental - 3º Ano"
    },
    {
      id: 9,
      title: "Educação Física",
      start: new Date(new Date().setDate(new Date().getDate() + 5)),
      className: "bg-light border",
      professor: "Paulo Ferreira",
      serie: "Fundamental",
      ano: "3º Ano",
      turma: "B",
      categoria: "Ensino Fundamental - 3º Ano"
    },
    
    // 1º Ano - Ensino Médio
    {
      id: 10,
      title: "Física",
      start: new Date(new Date().setDate(new Date().getDate() + 1)),
      className: "bg-light border",
      professor: "Roberto Dias",
      serie: "Médio",
      ano: "1º Ano",
      turma: "A",
      categoria: "Ensino Médio - 1º Ano"
    },
    {
      id: 11,
      title: "Química",
      start: new Date(new Date().setDate(new Date().getDate() + 1)).setHours(new Date().getHours() + 3),
      className: "bg-light border",
      professor: "Camila Rocha",
      serie: "Médio",
      ano: "1º Ano",
      turma: "A",
      categoria: "Ensino Médio - 1º Ano"
    },
    
    // 2º Ano - Ensino Médio
    {
      id: 12,
      title: "Biologia",
      start: new Date(new Date().setDate(new Date().getDate() + 2)),
      className: "bg-light border",
      professor: "Luciana Martins",
      serie: "Médio",
      ano: "2º Ano",
      turma: "A",
      categoria: "Ensino Médio - 2º Ano"
    },
    {
      id: 13,
      title: "Literatura",
      start: new Date(new Date().setDate(new Date().getDate() + 3)),
      className: "bg-light border",
      professor: "Marcelo Gomes",
      serie: "Médio",
      ano: "2º Ano",
      turma: "A",
      categoria: "Ensino Médio - 2º Ano"
    },
    
    // 3º Ano - Ensino Médio
    {
      id: 14,
      title: "Redação",
      start: new Date(new Date().setDate(new Date().getDate() + 4)),
      className: "bg-light border",
      professor: "Daniela Castro",
      serie: "Médio",
      ano: "3º Ano",
      turma: "A",
      categoria: "Ensino Médio - 3º Ano"
    },
    {
      id: 15,
      title: "Matemática",
      start: new Date(new Date().setDate(new Date().getDate() + 5)),
      className: "bg-light border",
      professor: "André Moreira",
      serie: "Médio",
      ano: "3º Ano",
      turma: "A",
      categoria: "Ensino Médio - 3º Ano"
    },
    

  ];

  // Dados fictícios para categorias
  const initialCategories = [
    {
      id: 1,
      title: "Ensino Fundamental - 1º Ano",
      type: "bg-primary",
    },
    {
      id: 2,
      title: "Ensino Fundamental - 2º Ano",
      type: "bg-success",
    },
    {
      id: 3,
      title: "Ensino Fundamental - 3º Ano",
      type: "bg-info",
    },
    {
      id: 4,
      title: "Ensino Médio - 1º Ano",
      type: "bg-warning",
    },
    {
      id: 5,
      title: "Ensino Médio - 2º Ano",
      type: "bg-danger",
    },
    {
      id: 6,
      title: "Ensino Médio - 3º Ano",
      type: "bg-dark",
    },

  ];
  
  // Dados para os turnos
  const turnos = ["Manhã", "Tarde", "Noite"];
  
  // Dados para os horários de aula
  const horariosAula = {
    "Manhã": [
      "07:00 - 07:50",
      "07:50 - 08:40",
      "08:40 - 09:30",
      "09:50 - 10:40",
      "10:40 - 11:30"
    ],
    "Tarde": [
      "13:00 - 13:50",
      "13:50 - 14:40",
      "14:40 - 15:30",
      "15:50 - 16:40",
      "16:40 - 17:30"
    ],
    "Noite": [
      "18:30 - 19:20",
      "19:20 - 20:10",
      "20:10 - 21:00",
      "21:10 - 22:00"
    ]
  };
  
  // Dados para os dias da semana
  const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

  // Filtrar eventos escolares dos eventos iniciais
  const eventsWithoutSchoolEvents = initialEvents.filter(event => event.categoria !== "Eventos Escolares");
  
  const [events, setEvents] = useState(eventsWithoutSchoolEvents);
  const [categories, setCategories] = useState(initialCategories);
  const [filteredEvents, setFilteredEvents] = useState(eventsWithoutSchoolEvents);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTurma, setSelectedTurma] = useState(null);
  const [turmasDisponiveis, setTurmasDisponiveis] = useState([]);
  const [selectedTurno, setSelectedTurno] = useState("Manhã");
  const [horariosTurno, setHorariosTurno] = useState(horariosAula["Manhã"]);

  const [event, setEvent] = useState({});
  const [isEdit, setIsEdit] = useState(false);

  const categoryValidation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      title: (event && event.title) || '',
      category: (event && event.category) || '',
      professor: (event && event.professor) || '',
      turma: (event && event.turma) || '',
      serie: (event && event.serie) || '',
      ano: (event && event.ano) || '',
      categoria: (event && event.categoria) || '',
      turno: (event && event.turno) || selectedTurno,
      horario: (event && event.horario) || '',
      diaSemana: (event && event.diaSemana) || ''
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Por favor, insira o nome da aula"),
      category: Yup.string().required("Por favor, selecione uma categoria"),
      professor: Yup.string().required("Por favor, insira o nome do professor"),
      turma: Yup.string().required("Por favor, selecione uma turma"),
      turno: Yup.string().required("Por favor, selecione um turno"),
      horario: Yup.string().required("Por favor, selecione um horário"),
      diaSemana: Yup.string().required("Por favor, selecione um dia da semana"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updateEvent = {
          id: event.id,
          title: values.title,
          classNames: values.category + " text-white",
          start: event.start,
          professor: values.professor,
          turma: values.turma,
          serie: values.serie,
          ano: values.ano,
          categoria: values.categoria,
          turno: values.turno,
          horario: values.horario,
          diaSemana: values.diaSemana
        };
        // update event
        onUpdateEvent(updateEvent);
        categoryValidation.resetForm();
      } else {
        const newEvent = {
          id: Math.floor(Math.random() * 100),
          title: values["title"],
          start: selectedDay ? selectedDay.date : new Date(),
          className: values['category']
            ? values['category'] + " text-white"
            : "bg-primary text-white",
          professor: values.professor,
          turma: values.turma,
          serie: values.serie,
          ano: values.ano,
          categoria: values.categoria,
          turno: values.turno,
          horario: values.horario,
          diaSemana: values.diaSemana
        };
        // save new event
        onAddNewEvent(newEvent);
        categoryValidation.resetForm()
      }
      toggle();
    },
  });

  // Seletor para Redux - deve ser uma função
  const calendarEvents = events.filter(event => event.categoria !== "Eventos Escolares");
  const calendarCategories = categories.filter(cat => cat.title !== "Eventos Escolares");

  const [deleteId, setDeleteId] = useState();
  const [deleteModal, setDeleteModal] = useState(false);
  const [modalCategory, setModalCategory] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  
  // Estados para o modal de notas
  const [gradesModal, setGradesModal] = useState(false);
  const [selectedAula, setSelectedAula] = useState(null);

  // Não precisamos mais do Draggable

  useEffect(() => {
    if (!modalCategory && !isEmpty(event) && !!isEdit) {
      setTimeout(() => {
        setEvent({});
        setIsEdit(false);
      }, 500);
    }
  }, [modalCategory, event]);

  /**
   * Handling the modal state
   */
  const toggle = () => {
    if (modalCategory) {
      setModalCategory(false);
      setEvent(null);
      setIsEdit(false);
    } else {
      setModalCategory(true);
    }
  }


  /**
   * Handling click on event on calendar
   */
  const handleEventClick = (arg) => {
    const event = arg.event;
    setEvent({
      id: event.id,
      title: event.title,
      start: event.start,
      className: event.classNames,
      category: event.classNames[0],
      event_category: event.classNames[0],
      professor: event.extendedProps.professor,
      turma: event.extendedProps.turma,
      categoria: event.extendedProps.categoria,
      serie: event.extendedProps.serie,
      ano: event.extendedProps.ano
    });
    setDeleteId(event.id)
    setIsEdit(true);
    setModalCategory(true)
    toggle();
  };

  /**
   * On delete event
   */
  const handleDeleteEvent = () => {
    if (deleteId) {
      onDeleteEvent(deleteId);
    }
    setDeleteModal(false);
  };


  // Função para filtrar eventos por categoria e turma
  const filtrarEventos = (categoria, turma) => {
    if (!categoria) {
      // Excluir eventos da categoria "Eventos Escolares"
      setFilteredEvents(events.filter(event => event.categoria !== "Eventos Escolares"));
      setTurmasDisponiveis([]);
      setSelectedTurma(null);
      return;
    }

    // Filtrar eventos pela categoria selecionada (excluindo "Eventos Escolares")
    const eventosFiltrados = events.filter(event => event.categoria === categoria && event.categoria !== "Eventos Escolares");
    
    // Obter turmas disponíveis para esta categoria
    const turmasUnicas = [...new Set(eventosFiltrados.map(event => event.turma))].filter(Boolean);
    setTurmasDisponiveis(turmasUnicas.sort());
    
    // Se uma turma for selecionada, filtrar por ela também
    if (turma) {
      setFilteredEvents(eventosFiltrados.filter(event => event.turma === turma));
    } else {
      setFilteredEvents(eventosFiltrados);
      // Se tiver turmas disponíveis, selecionar a primeira por padrão
      if (turmasUnicas.length > 0) {
        setSelectedTurma(turmasUnicas[0]);
        setFilteredEvents(eventosFiltrados.filter(event => event.turma === turmasUnicas[0]));
      }
    }
  };

  // Manipular clique em uma categoria
  const handleCategoriaClick = (categoria) => {
    if (selectedCategory === categoria) {
      // Se clicar na mesma categoria, limpa o filtro
      setSelectedCategory(null);
      filtrarEventos(null, null);
    } else {
      setSelectedCategory(categoria);
      filtrarEventos(categoria, null);
    }
  };

  // Manipular clique em uma turma
  const handleTurmaClick = (turma) => {
    setSelectedTurma(turma);
    filtrarEventos(selectedCategory, turma);
  };
  
  // Manipular mudança de turno
  const handleTurnoChange = (turno) => {
    setSelectedTurno(turno);
    setHorariosTurno(horariosAula[turno]);
  };
  
  // Função para abrir o modal de notas
  const toggleGradesModal = (evento) => {
    if (gradesModal) {
      setGradesModal(false);
      setSelectedAula(null);
    } else {
      setSelectedAula(evento);
      setGradesModal(true);
    }
  };

  // Configurar o idioma local para português
  const ptBrLocal = allLocales.find(locale => locale.code === 'pt-br');
  const [isLocal, setIsLocal] = useState(ptBrLocal);
  const handleChangeLocals = (value) => {
    setIsLocal(value);
  };

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteEvent}
        onCloseClick={() => setDeleteModal(false)}
      />
      {selectedAula && (
        <GradesModal
          isOpen={gradesModal}
          toggle={toggleGradesModal}
          turma={selectedAula.turma || ""}
          categoria={selectedAula.categoria || ""}
          aula={selectedAula.title || ""}
          professor={selectedAula.professor || ""}
          horario={selectedAula.horario || horariosTurno[0] || ""}
          diaSemana={selectedAula.diaSemana || diasSemana[0] || ""}
        />
      )}
      <div className="page-content">
        <Container fluid={true}>
          {/* Render Breadcrumb */}
          <Breadcrumbs title="Calendário" breadcrumbItem="Calendário de Aulas" />
          <Row>
            <Col className="col-12">
              <Card>
                <CardBody>
                  <div className="mb-4">
                    <h4 className="card-title mb-0">Calendário Escolar</h4>
                  </div>
                  
                  <Row>
                    <Col xl={3} lg={4}>
                      <Card className="border shadow-none">
                        <CardBody className="p-4">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="font-size-16 mb-0">Séries</h5>
                          </div>
                          
                          <div>
                            {calendarCategories &&
                              (calendarCategories || []).map((category) => (
                                <div
                                  className={`${selectedCategory === category.title ? 'bg-primary text-white' : 'bg-light text-dark'} border p-2 mb-3 rounded`}
                                  key={"cat-" + category.id}
                                  onClick={() => handleCategoriaClick(category.title)}
                                  style={{ cursor: 'pointer' }}
                                >
                                  <i className="mdi mdi-school font-size-11 me-2" />
                                  {category.title}
                                </div>
                              ))}
                          </div>
                          
                          {/* Lista de turmas disponíveis */}
                          {selectedCategory && turmasDisponiveis.length > 0 && (
                            <div className="mt-4">
                              <h5 className="font-size-16 mb-3">Turmas</h5>
                              {turmasDisponiveis.map((turma, index) => (
                                <div 
                                  key={index}
                                  className={`${selectedTurma === turma ? 'bg-primary text-white' : 'bg-light text-dark'} border p-2 mb-2 rounded`}
                                  onClick={() => {
                                    handleTurmaClick(turma);
                                    // Criar um objeto de aula fictício para o modal de presença
                                    const aulaFicticia = {
                                      title: "Lista de Presença",
                                      turma: turma,
                                      categoria: selectedCategory,
                                      professor: "Professor da Turma",
                                      horario: horariosTurno[0],
                                      diaSemana: diasSemana[0]
                                    };
                                    toggleGradesModal(aulaFicticia);
                                  }}
                                  style={{ cursor: 'pointer' }}
                                >
                                  <i className="mdi mdi-account-group font-size-11 me-2" />
                                  Turma {turma}
                                </div>
                              ))}
                            </div>
                          )}

                        </CardBody>
                      </Card>
                    </Col>

                    <Col className="col-xl-9 col-lg-8">
                  {/* fullcalendar control */}
                      <Card className="border shadow-none">
                        <CardBody className="p-4">
                      {/* Abas de turmas quando uma categoria é selecionada */}
                      {selectedCategory && turmasDisponiveis.length > 0 && (
                        <div className="mb-4">
                          <h5 className="font-size-16 mb-3">Turmas</h5>
                          <Nav tabs className="nav-tabs-custom">
                            {turmasDisponiveis.map((turma, index) => (
                              <NavItem key={index}>
                                <NavLink
                                  className={selectedTurma === turma ? "active" : ""}
                                  onClick={() => handleTurmaClick(turma)}
                                  style={{ cursor: 'pointer' }}
                                >
                                  Turma {turma}
                                </NavLink>
                              </NavItem>
                            ))}
                          </Nav>
                        </div>
                      )}
                      
                      {/* Abas para os turnos */}
                      <div className="mb-4">
                        <Nav tabs className="nav-tabs-custom">
                          {turnos.map((turno, index) => (
                            <NavItem key={index}>
                              <NavLink
                                className={selectedTurno === turno ? "active" : ""}
                                onClick={() => handleTurnoChange(turno)}
                                style={{ cursor: 'pointer' }}
                              >
                                {turno}
                              </NavLink>
                            </NavItem>
                          ))}
                        </Nav>
                      </div>
                      
                      {/* Grade de horários com dias da semana */}
                      <div className="table-responsive">
                        <table className="table table-bordered" style={{ tableLayout: 'fixed', width: '100%' }}>
                          <thead>
                            <tr>
                              <th style={{ width: '15%' }}>Horário</th>
                              {diasSemana.map((dia, index) => (
                                <th key={index} style={{ width: '12%' }}>{dia}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {horariosTurno.map((horario, indexHorario) => (
                              <tr key={indexHorario}>
                                <td className="text-center fw-bold" style={{ width: '15%' }}>{horario}</td>
                                {diasSemana.map((dia, indexDia) => {
                                  // Filtrar eventos para este dia e horário
                                  const eventosHorario = filteredEvents.filter(evento => {
                                    // Aqui seria necessário uma lógica real para verificar o dia e horário
                                    // Esta é uma simplificação para demonstração
                                    return (indexDia === (evento.id % 7)) && (indexHorario === (evento.id % 5));
                                  });
                                  
                                  return (
                                    <td key={indexDia} className="position-relative" style={{ height: '120px', verticalAlign: 'top', width: '12%' }}>
                                      {eventosHorario.length > 0 ? (
                                        eventosHorario.map((evento, i) => (
                                          <div 
                                            key={i} 
                                            className={`${evento.className} p-2 mb-1 rounded border d-flex flex-column`}
                                            onClick={() => {
                                              // Adicionar horário e dia da semana ao evento
                                              const eventoComHorario = {
                                                ...evento,
                                                horario: horario,
                                                diaSemana: dia
                                              };
                                              toggleGradesModal(eventoComHorario);
                                            }}
                                            style={{ cursor: 'pointer', height: '100px', overflow: 'hidden' }}
                                          >
                                            <div className="fw-bold" style={{ fontSize: '16px' }}>{evento.title.split(' ').map(word => word.substring(0, 3)).join(' ')}</div>
                                            {evento.professor && (
                                              <div><small style={{ fontSize: '10px' }}>Prof: {evento.professor}</small></div>
                                            )}
                                            <div className="mt-auto d-flex justify-content-end">
                                              <Button
                                                color="light"
                                                size="sm"
                                                className="btn-sm"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleEventClick({ event: evento });
                                                }}
                                                style={{ padding: '4px 8px' }}
                                              >
                                                <i className="mdi mdi-pencil font-size-14"></i>
                                              </Button>
                                            </div>
                                          </div>
                                        ))
                                      ) : (
                                        <div 
                                          className="text-center d-flex align-items-center justify-content-center text-muted" 
                                          onClick={() => {
                                            // Abrir modal para adicionar aula neste horário e dia
                                            const date = new Date();
                                            setSelectedDay({ date });
                                            toggle();
                                          }}
                                          style={{ cursor: 'pointer', height: '100px' }}
                                        >
                                          <i className="mdi mdi-plus-circle-outline"></i>
                                        </div>
                                      )}
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                        </CardBody>
                      </Card>
                      <Modal
                        isOpen={modalCategory}
                        className={props.className}
                        centered
                      >
                        <ModalHeader toggle={toggle} className="bg-primary text-white">
                          <i className="mdi mdi-calendar-edit me-2"></i>
                          {!!isEdit ? "Editar Aula" : "Adicionar Aula"}
                        </ModalHeader>
                        <ModalBody className="p-4">
                          <Form
                            onSubmit={(e) => {
                              e.preventDefault();
                              categoryValidation.handleSubmit();
                              return false;
                            }}
                          >
                            <Row>
                              <Col className="col-12">
                            <div className="mb-3">
                              <Label>Nome da Aula</Label>
                              <div className="input-group">
                                <span className="input-group-text bg-primary text-white">
                                  <i className="mdi mdi-book-open-variant"></i>
                                </span>
                                <Input
                                  name="title"
                                  type="text"
                                  placeholder="Insira o nome da aula"
                                  onChange={categoryValidation.handleChange}
                                  onBlur={categoryValidation.handleBlur}
                                  value={categoryValidation.values.title || ""}
                                  invalid={
                                    categoryValidation.touched.title && categoryValidation.errors.title ? true : false
                                  }
                                />
                                {categoryValidation.touched.title && categoryValidation.errors.title ? (
                                  <FormFeedback type="invalid">{categoryValidation.errors.title}</FormFeedback>
                                ) : null}
                              </div>
                            </div>
                              </Col>
                              <Col className="col-12">
                                <div className="mb-3">
                                  <Label>Professor</Label>
                                  <div className="input-group">
                                    <span className="input-group-text bg-primary text-white">
                                      <i className="mdi mdi-account"></i>
                                    </span>
                                    <Input
                                      name="professor"
                                      type="text"
                                      placeholder="Insira o nome do professor"
                                      onChange={categoryValidation.handleChange}
                                      onBlur={categoryValidation.handleBlur}
                                      value={categoryValidation.values.professor || ""}
                                      invalid={
                                        categoryValidation.touched.professor && categoryValidation.errors.professor ? true : false
                                      }
                                    />
                                    {categoryValidation.touched.professor && categoryValidation.errors.professor ? (
                                      <FormFeedback type="invalid">{categoryValidation.errors.professor}</FormFeedback>
                                    ) : null}
                                  </div>
                                </div>
                              </Col>
                              
                              <Col className="col-12">
                                <div className="mb-3">
                                  <Label>Categoria</Label>
                                  <div className="input-group">
                                    <span className="input-group-text bg-primary text-white">
                                      <i className="mdi mdi-tag-multiple"></i>
                                    </span>
                                    <Input
                                      type="select"
                                      name="categoria"
                                      placeholder="Selecione a categoria"
                                      onChange={(e) => {
                                        categoryValidation.handleChange(e);
                                        const selectedCategory = e.target.value;
                                        // Atualizar os valores de série e ano com base na categoria selecionada
                                        if (selectedCategory.includes("Fundamental")) {
                                          categoryValidation.setFieldValue("serie", "Fundamental");
                                          const ano = selectedCategory.split(" - ")[1];
                                          categoryValidation.setFieldValue("ano", ano);
                                        } else if (selectedCategory.includes("Médio")) {
                                          categoryValidation.setFieldValue("serie", "Médio");
                                          const ano = selectedCategory.split(" - ")[1];
                                          categoryValidation.setFieldValue("ano", ano);
                                        }
                                      }}
                                      onBlur={categoryValidation.handleBlur}
                                      value={categoryValidation.values.categoria || ""}
                                      invalid={
                                        categoryValidation.touched.categoria && categoryValidation.errors.categoria ? true : false
                                      }
                                    >
                                      <option value="">Selecione a categoria</option>
                                      {categories.map((category, i) => (
                                        <option key={i} value={category.title}>
                                          {category.title}
                                        </option>
                                      ))}
                                    </Input>
                                    {categoryValidation.touched.categoria && categoryValidation.errors.categoria ? (
                                      <FormFeedback type="invalid">{categoryValidation.errors.categoria}</FormFeedback>
                                    ) : null}
                                  </div>
                                </div>
                              </Col>
                              
                              <Col className="col-12">
                                <div className="mb-3">
                                  <Label>Turma</Label>
                                  <div className="input-group">
                                    <span className="input-group-text bg-primary text-white">
                                      <i className="mdi mdi-account-group"></i>
                                    </span>
                                    <Input
                                      type="select"
                                      name="turma"
                                      placeholder="Selecione a turma"
                                      onChange={categoryValidation.handleChange}
                                      onBlur={categoryValidation.handleBlur}
                                      value={categoryValidation.values.turma || ""}
                                      invalid={
                                        categoryValidation.touched.turma && categoryValidation.errors.turma ? true : false
                                      }
                                    >
                                      <option value="">Selecione a turma</option>
                                      <option value="A">Turma A</option>
                                      <option value="B">Turma B</option>
                                      <option value="C">Turma C</option>
                                    </Input>
                                    {categoryValidation.touched.turma && categoryValidation.errors.turma ? (
                                      <FormFeedback type="invalid">{categoryValidation.errors.turma}</FormFeedback>
                                    ) : null}
                                  </div>
                                </div>
                              </Col>
                              
                              <Col className="col-12">
                                <div className="mb-3">
                                  <Label>Estilo</Label>
                                  <div className="input-group">
                                    <span className="input-group-text bg-primary text-white">
                                      <i className="mdi mdi-palette"></i>
                                    </span>
                                    <Input
                                      type="select"
                                      name="category"
                                      placeholder="Selecione o estilo"
                                      onChange={categoryValidation.handleChange}
                                      onBlur={categoryValidation.handleBlur}
                                      value={categoryValidation.values.category || ""}
                                      invalid={
                                        categoryValidation.touched.category && categoryValidation.errors.category ? true : false
                                      }
                                    >
                                      <option value="">Selecione o estilo</option>
                                      <option value="bg-light border">Padrão</option>
                                      <option value="bg-primary text-white">Azul</option>
                                      <option value="bg-success text-white">Verde</option>
                                      <option value="bg-info text-white">Ciano</option>
                                      <option value="bg-warning text-white">Amarelo</option>
                                      <option value="bg-danger text-white">Vermelho</option>
                                      <option value="bg-dark text-white">Preto</option>
                                    </Input>
                                    {categoryValidation.touched.category && categoryValidation.errors.category ? (
                                      <FormFeedback type="invalid">{categoryValidation.errors.category}</FormFeedback>
                                    ) : null}
                                  </div>
                                </div>
                              </Col>
                              
                              <Col className="col-12">
                                <div className="mb-3">
                                  <Label>Turno</Label>
                                  <div className="input-group">
                                    <span className="input-group-text bg-primary text-white">
                                      <i className="mdi mdi-clock-outline"></i>
                                    </span>
                                    <Input
                                      type="select"
                                      name="turno"
                                      placeholder="Selecione o turno"
                                      onChange={(e) => {
                                        categoryValidation.handleChange(e);
                                        // Atualizar horários disponíveis com base no turno selecionado
                                        const turno = e.target.value;
                                        setHorariosTurno(horariosAula[turno] || []);
                                      }}
                                      onBlur={categoryValidation.handleBlur}
                                      value={categoryValidation.values.turno || ""}
                                      invalid={
                                        categoryValidation.touched.turno && categoryValidation.errors.turno ? true : false
                                      }
                                    >
                                      <option value="">Selecione o turno</option>
                                      {turnos.map((turno, index) => (
                                        <option key={index} value={turno}>
                                          {turno}
                                        </option>
                                      ))}
                                    </Input>
                                    {categoryValidation.touched.turno && categoryValidation.errors.turno ? (
                                      <FormFeedback type="invalid">{categoryValidation.errors.turno}</FormFeedback>
                                    ) : null}
                                  </div>
                                </div>
                              </Col>
                              
                              <Col className="col-12">
                                <div className="mb-3">
                                  <Label>Horário</Label>
                                  <div className="input-group">
                                    <span className="input-group-text bg-primary text-white">
                                      <i className="mdi mdi-clock"></i>
                                    </span>
                                    <Input
                                      type="select"
                                      name="horario"
                                      placeholder="Selecione o horário"
                                      onChange={categoryValidation.handleChange}
                                      onBlur={categoryValidation.handleBlur}
                                      value={categoryValidation.values.horario || ""}
                                      invalid={
                                        categoryValidation.touched.horario && categoryValidation.errors.horario ? true : false
                                      }
                                    >
                                      <option value="">Selecione o horário</option>
                                      {horariosTurno.map((horario, index) => (
                                        <option key={index} value={horario}>
                                          {horario}
                                        </option>
                                      ))}
                                    </Input>
                                    {categoryValidation.touched.horario && categoryValidation.errors.horario ? (
                                      <FormFeedback type="invalid">{categoryValidation.errors.horario}</FormFeedback>
                                    ) : null}
                                  </div>
                                </div>
                              </Col>
                              
                              <Col className="col-12">
                                <div className="mb-3">
                                  <Label>Dia da Semana</Label>
                                  <div className="input-group">
                                    <span className="input-group-text bg-primary text-white">
                                      <i className="mdi mdi-calendar-week"></i>
                                    </span>
                                    <Input
                                      type="select"
                                      name="diaSemana"
                                      placeholder="Selecione o dia da semana"
                                      onChange={categoryValidation.handleChange}
                                      onBlur={categoryValidation.handleBlur}
                                      value={categoryValidation.values.diaSemana || ""}
                                      invalid={
                                        categoryValidation.touched.diaSemana && categoryValidation.errors.diaSemana ? true : false
                                      }
                                    >
                                      <option value="">Selecione o dia</option>
                                      {diasSemana.map((dia, index) => (
                                        <option key={index} value={dia}>
                                          {dia}
                                        </option>
                                      ))}
                                    </Input>
                                    {categoryValidation.touched.diaSemana && categoryValidation.errors.diaSemana ? (
                                      <FormFeedback type="invalid">{categoryValidation.errors.diaSemana}</FormFeedback>
                                    ) : null}
                                  </div>
                                </div>
                              </Col>
                        </Row>

                            <Row className="mt-2">
                              <Col className="col-6">
                            {isEdit &&
                              <button type="button" className="btn btn-danger btn-rounded" id="btn-delete-event" onClick={() => { toggle(); setDeleteModal(true) }}>
                                <i className="mdi mdi-trash-can-outline me-1"></i> Excluir
                              </button>
                            }
                              </Col>

                              <Col className="col-6 text-end">
                            <button
                              type="button"
                              className="btn btn-light btn-rounded me-2"
                              onClick={toggle}
                            >
                              <i className="mdi mdi-close me-1"></i> Cancelar
                            </button>
                            <button
                              type="submit"
                              className="btn btn-success btn-rounded"
                              id="btn-save-event"
                            >
                              <i className="mdi mdi-content-save me-1"></i> Salvar
                            </button>
                          </Col>
                        </Row>
                          </Form>
                        </ModalBody>
                      </Modal>
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

Calender.propTypes = {
  className: PropTypes.string,
};

export default Calender;
