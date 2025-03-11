import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "/src/components/Common/Breadcrumb";

import GradesModal from "./AttendanceModal";

import { initialEvents, initialCategories, turnos, horariosAula, diasSemana } from "./mockData";

const Calender = (props) => {
  //meta title
  document.title = "Calendário Escolar | Painel Escolar";

  const [events, setEvents] = useState(initialEvents);
  const [categories, setCategories] = useState(initialCategories);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTurma, setSelectedTurma] = useState(null);
  const [turmasDisponiveis, setTurmasDisponiveis] = useState([]);
  const [selectedTurno, setSelectedTurno] = useState("Manhã");
  const [horariosTurno, setHorariosTurno] = useState(horariosAula["Manhã"]);

  const [selectedAula, setSelectedAula] = useState(null);

  // Estados para o modal de notas
  const [gradesModal, setGradesModal] = useState(false);

  useEffect(() => {
    // Inicializar os eventos filtrados com todos os eventos (excluindo eventos escolares)
    setFilteredEvents(events.filter(event => event.categoria !== "Eventos Escolares"));
  }, [events]);

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

  return (
    <React.Fragment>
      <GradesModal
        isOpen={gradesModal}
        toggle={toggleGradesModal}
        aula={selectedAula}
      />
      <div className="page-content">
        <Container fluid={true}>
          {/* Render Breadcrumb */}
          <Breadcrumbs title="Calendário" breadcrumbItem="Calendário de Aulas" />
          <Row>
            <Col xl={12} lg={12} className="mb-4">
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <label className="mb-0 me-2">Selecione a Série:</label>
                </div>
                <div style={{ minWidth: "250px" }}>
                  <select
                    className="form-select"
                    value={selectedCategory || ""}
                    onChange={(e) => handleCategoriaClick(e.target.value)}
                  >
                    <option value="">Todas as Séries</option>
                    {categories &&
                      (categories || []).map((category) => (
                        <option 
                          key={"cat-" + category.id} 
                          value={category.title}
                        >
                          {category.title}
                        </option>
                      ))}
                  </select>
                </div>
                {selectedCategory && turmasDisponiveis.length > 0 && (
                  <div className="ms-4 d-flex align-items-center">
                    <label className="mb-0 me-2">Turma:</label>
                    <select
                      className="form-select"
                      style={{ minWidth: "150px" }}
                      value={selectedTurma || ""}
                      onChange={(e) => handleTurmaClick(e.target.value)}
                    >
                      <option value="">Todas as Turmas</option>
                      {turmasDisponiveis.map((turma, index) => (
                        <option key={index} value={turma}>
                          Turma {turma}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </Col>
            
            <Col className="col-12">
              <Card>
                <CardBody>
                  <div className="mb-4">
                    <h4 className="card-title mb-0">Calendário Escolar</h4>
                  </div>
                  
                  <Row>
                    <Col className="col-12">
                      {/* fullcalendar control */}
                      <Card className="border shadow-none">
                        <CardBody className="p-4">
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
                                                style={{ height: '100px', overflow: 'hidden' }}
                                              >
                                                <div className="fw-bold" style={{ fontSize: '12px' }}>{evento.title}</div>
                                                {evento.professor && (
                                                  <div><small style={{ fontSize: '9px' }}>Prof: {evento.professor}</small></div>
                                                )}
                                                <div className="mt-auto d-flex justify-content-end">
                                                  <Button
                                                    color="light"
                                                    size="sm"
                                                    className="btn-sm"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      // Adicionar horário e dia da semana ao evento
                                                      const eventoComHorario = {
                                                        ...evento,
                                                        horario: horario,
                                                        diaSemana: dia
                                                      };
                                                      toggleGradesModal(eventoComHorario);
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
                                              style={{ height: '100px' }}
                                            >
                                              {/* Célula vazia */}
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
