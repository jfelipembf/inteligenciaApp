import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "/src/components/Common/Breadcrumb";

import { useClassContext } from "../../contexts/ClassContext";
import useFetchLessons from "../../hooks/useFetchLessons";

const Calendar = () => {
  const diasSemana = [
    { label: "Segunda", value: "segunda" },
    { label: "Terça", value: "terca" },
    { label: "Quarta", value: "quarta" },
    { label: "Quinta", value: "quinta" },
    { label: "Sexta", value: "sexta" },
    { label: "Sábado", value: "sabado" },
  ];

  // Estados
  const [selectedTurma, setSelectedTurma] = useState(null);
  const [turmasDisponiveis, setTurmasDisponiveis] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [horariosTurno, setHorariosTurno] = useState([]);

  // Hooks para buscar dados
  const { classes, loading: loadingClasses } = useClassContext();
  const { lessons, loading: loadingLessons } = useFetchLessons(
    selectedTurma?.id
  );

  // Atualizar turmas disponíveis ao carregar as classes
  useEffect(() => {
    if (classes) {
      setTurmasDisponiveis(classes);
    }
  }, [classes]);

  // Atualizar aulas ao carregar as aulas da turma selecionada
  useEffect(() => {
    if (lessons) {
      setAulas(lessons);

      // Gerar horários dinamicamente
      const horarios = gerarHorarios(lessons);
      setHorariosTurno(horarios);
    }
  }, [lessons]);

  // Função para gerar os horários dinamicamente
  const gerarHorarios = (aulas) => {
    if (!aulas || aulas.length === 0) return [];

    // Obter o menor horário de início e o maior horário de término
    const minStartTime = aulas.reduce(
      (min, aula) => (aula.startTime < min ? aula.startTime : min),
      aulas[0].startTime
    );
    const maxEndTime = aulas.reduce(
      (max, aula) => (aula.endTime > max ? aula.endTime : max),
      aulas[0].endTime
    );

    const horarios = [];
    let currentTime = minStartTime;

    while (currentTime < maxEndTime) {
      // Encontre a aula correspondente ao horário atual
      const aulaAtual = aulas.find((aula) => aula.startTime === currentTime);

      // Determine o próximo horário com base em aula.endTime ou use um intervalo padrão
      const nextTime = aulaAtual
        ? aulaAtual.endTime
        : adicionarMinutos(currentTime, 60);

      // Adicione o intervalo ao array de horários
      horarios.push(`${currentTime} - ${nextTime}`);

      // Atualize o horário atual para o próximo
      currentTime = nextTime;
    }

    return horarios;
  };

  // Função auxiliar para adicionar minutos a um horário
  const adicionarMinutos = (horario, minutos) => {
    const [hora, minuto] = horario.split(":").map(Number);
    const date = new Date();
    date.setHours(hora, minuto + minutos);
    const novaHora = date.getHours().toString().padStart(2, "0");
    const novoMinuto = date.getMinutes().toString().padStart(2, "0");
    return `${novaHora}:${novoMinuto}`;
  };

  // Manipular mudança de turma
  const handleTurmaChange = (turmaId) => {
    const turma = turmasDisponiveis.find((t) => t.id === turmaId);
    setSelectedTurma(turma);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          {/* Breadcrumb */}
          <Breadcrumbs
            title="Calendário"
            breadcrumbItem="Calendário de Aulas"
          />

          <Row>
            <Col xl={12} lg={12} className="mb-4">
              <div className="d-flex align-items-center">
                <label className="me-3">Selecione a Turma:</label>
                <select
                  className="form-select"
                  style={{ minWidth: "250px" }}
                  value={selectedTurma?.id || ""}
                  onChange={(e) => handleTurmaChange(e.target.value)}
                >
                  <option value="">Selecione uma turma</option>
                  {turmasDisponiveis.map((turma) => (
                    <option key={turma.id} value={turma.id}>
                      {turma.className}
                    </option>
                  ))}
                </select>
              </div>
            </Col>

            <Col className="col-12">
              <Card>
                <CardBody>
                  <div className="mb-4">
                    <h4 className="card-title mb-0">Calendário Escolar</h4>
                  </div>

                  {/* Grade de horários com dias da semana */}
                  <div className="table-responsive">
                    <table
                      className="table table-bordered"
                      style={{ tableLayout: "fixed", width: "100%" }}
                    >
                      <thead>
                        <tr>
                          <th style={{ width: "15%" }}>Horário</th>
                          {diasSemana.map((dia, index) => (
                            <th key={index} style={{ width: "12%" }}>
                              {dia.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {horariosTurno.map((horario, indexHorario) => (
                          <tr key={indexHorario}>
                            <td
                              className="text-center fw-bold"
                              style={{ width: "15%" }}
                            >
                              {horario}
                            </td>
                            {diasSemana.map((dia, indexDia) => {
                              const eventosHorario = aulas.filter((aula) => {
                                const [horarioInicio, horarioFim] =
                                  horario.split(" - ");

                                const diaCorresponde = aula.daysOfWeek.some(
                                  (d) =>
                                    d.value.toLowerCase() ===
                                    dia.value.toLowerCase()
                                );

                                const horarioCorresponde =
                                  aula.startTime >= horarioInicio &&
                                  aula.startTime < horarioFim;

                                return diaCorresponde && horarioCorresponde;
                              });

                              return (
                                <td
                                  key={indexDia}
                                  className="position-relative"
                                  style={{
                                    height: "120px",
                                    verticalAlign: "top",
                                    width: "12%",
                                  }}
                                >
                                  {eventosHorario.length > 0 ? (
                                    eventosHorario.map((aula, i) => (
                                      <div
                                        key={i}
                                        className="p-2 mb-1 rounded border d-flex flex-column"
                                        style={{
                                          height: "100px",
                                          overflow: "hidden",
                                          backgroundColor: "#2a3042",
                                          color: "#fff",
                                        }}
                                      >
                                        <div
                                          className="fw-bold"
                                          style={{ fontSize: "12px" }}
                                        >
                                          {aula.subject}
                                        </div>
                                        <div>
                                          <small style={{ fontSize: "11px" }}>
                                            Prof: {aula.teacher.label}
                                          </small>
                                        </div>
                                        <div>
                                          <small style={{ fontSize: "11px" }}>
                                            Sala: {aula.room.label}
                                          </small>
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <div
                                      className="text-center text-muted"
                                      style={{ height: "100px" }}
                                    >
                                      Sem aulas
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
        </Container>
      </div>
    </React.Fragment>
  );
};

Calendar.propTypes = {
  className: PropTypes.string,
};

export default Calendar;
