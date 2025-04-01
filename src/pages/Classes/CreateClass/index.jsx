import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import Select from "react-select";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { useClassManagement } from "../../../hooks/useClassManagement";
import CreatableSelect from "react-select/creatable";
import useFetchTeachers from "../../../hooks/useFetchTeachers"; // Importação do hook

const CreateClass = () => {
  const navigate = useNavigate();
  const {
    createClass,
    loading: creatingClass,
    error: createError,
  } = useClassManagement();
  const {
    teachers,
    loading: loadingTeachers,
    error: fetchError,
  } = useFetchTeachers(); // Uso do hook

  const [formData, setFormData] = useState({
    className: "",
    series: "",
    identifier: "",
    teacher: null,
    startTime: "",
    endTime: "",
    duration: "",
    daysOfWeek: [],
    description: "",
    room: "",
    period: "",
    startDate: "",
    endDate: "",
  });

  // Determina o período baseado no horário de início
  useEffect(() => {
    if (formData.startTime) {
      const hour = parseInt(formData.startTime.split(":")[0]);
      let period = "";

      if (hour >= 5 && hour < 12) {
        period = "Manhã";
      } else if (hour >= 12 && hour < 18) {
        period = "Tarde";
      } else {
        period = "Noite";
      }

      setFormData((prev) => ({
        ...prev,
        period,
      }));
    }
  }, [formData.startTime]);

  useEffect(() => {
    if (formData.startTime && formData.endTime) {
      const start = new Date(`1970-01-01T${formData.startTime}:00`);
      const end = new Date(`1970-01-01T${formData.endTime}:00`);

      if (end > start) {
        const durationInMinutes = (end - start) / (1000 * 60);
        const hours = Math.floor(durationInMinutes / 60);
        const minutes = durationInMinutes % 60;
        const duration = `${hours}h${minutes > 0 ? ` ${minutes}min` : ""}`;

        setFormData((prev) => ({
          ...prev,
          duration: duration,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          duration: "",
        }));
      }
    }
  }, [formData.startTime, formData.endTime]);

  const daysOfWeekOptions = [
    { value: "segunda", label: "Segunda-feira" },
    { value: "terca", label: "Terça-feira" },
    { value: "quarta", label: "Quarta-feira" },
    { value: "quinta", label: "Quinta-feira" },
    { value: "sexta", label: "Sexta-feira" },
  ];

  const seriesOptions = [
    { value: "1", label: "1º ano do fundamental" },
    { value: "2", label: "2º ano do fundamental" },
    { value: "3", label: "3º ano do fundamental" },
    { value: "4", label: "4º ano do fundamental" },
    { value: "5", label: "5º ano do fundamental" },
    { value: "6", label: "6º ano do fundamental" },
    { value: "7", label: "7º ano do fundamental" },
    { value: "8", label: "8º ano do fundamental" },
    { value: "9", label: "9º ano do fundamental" },
    { value: "10", label: "1º ano do médio" },
    { value: "11", label: "2º ano do médio" },
    { value: "12", label: "3º ano do médio" },
  ];

  const roomOptions = [
    { value: "1", label: "Sala 1" },
    { value: "2", label: "Sala 2" },
    { value: "3", label: "Sala 3" },
    { value: "4", label: "Sala 4" },
    { value: "5", label: "Sala 5" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (selectedOption, { name }) => {
    setFormData((prev) => ({
      ...prev,
      [name]: selectedOption,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const classData = {
        ...formData,
        teacher: {
          value: formData.teacher?.value, // ID do professor
          label: formData.teacher?.label, // Nome do professor
        },
      };

      const response = await createClass(classData);
      console.log("Turma criada com sucesso:", response);
      alert("Turma criada com sucesso!");
      navigate("/classes");
    } catch (err) {
      console.error("Erro ao criar turma:", err);
      alert("Erro ao criar turma: " + err.message);
    }
  };

  if (loadingTeachers) {
    return <p>Carregando professores...</p>;
  }

  if (fetchError) {
    return (
      <p className="text-danger">Erro ao carregar professores: {fetchError}</p>
    );
  }

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb title="Criar Turma" breadcrumbItem="Nova Turma" />

        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={4}>
                      <FormGroup>
                        <Label>Série</Label>
                        <CreatableSelect
                          name="series"
                          value={formData.series}
                          onChange={(option) =>
                            handleSelectChange(option, { name: "series" })
                          }
                          formatCreateLabel={(inputValue) =>
                            `Criar "${inputValue}"`
                          }
                          getNewOptionData={(inputValue, optionLabel) => ({
                            value: inputValue,
                            label: optionLabel,
                          })}
                          options={seriesOptions}
                          placeholder="Selecione ou digite a série"
                          isClearable
                        />
                      </FormGroup>
                    </Col>

                    <Col md={4}>
                      <FormGroup>
                        <Label>Turma</Label>
                        <CreatableSelect
                          name="identifier"
                          value={formData.identifier}
                          onChange={(option) =>
                            handleSelectChange(option, { name: "identifier" })
                          }
                          formatCreateLabel={(inputValue) =>
                            `Criar "${inputValue}"`
                          }
                          getNewOptionData={(inputValue, optionLabel) => ({
                            value: inputValue,
                            label: optionLabel,
                          })}
                          options={[
                            { value: "A", label: "A" },
                            { value: "B", label: "B" },
                            { value: "C", label: "C" },
                          ]}
                          placeholder="Selecione ou digite a turma"
                          isClearable
                        />
                      </FormGroup>
                    </Col>

                    <Col md={4}>
                      {console.log(teachers)}
                      <FormGroup>
                        <Label>Professor Responsável</Label>
                        <Select
                          name="teacher"
                          value={formData.teacher}
                          onChange={(option) =>
                            handleSelectChange(option, { name: "teacher" })
                          }
                          options={teachers}
                          placeholder="Selecione o professor"
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col md={4}>
                      <FormGroup>
                        <Label>Horário de Início</Label>
                        <Input
                          type="time"
                          name="startTime"
                          value={formData.startTime}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label>Horário de Término</Label>
                        <Input
                          type="time"
                          name="endTime"
                          value={formData.endTime}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label>Duração</Label>
                        <Input
                          type="text"
                          name="duration"
                          value={formData.duration}
                          disabled
                          placeholder="Calculado automaticamente"
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col md={4}>
                      <FormGroup>
                        <Label>Data de Início</Label>
                        <Input
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label>Data de Término</Label>
                        <Input
                          type="date"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label>Período</Label>
                        <Input
                          type="text"
                          name="period"
                          value={formData.period}
                          disabled
                          placeholder="Determinado pelo horário"
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col md={4}>
                      <FormGroup>
                        <Label>Sala</Label>
                        <CreatableSelect
                          name="room"
                          value={formData.room}
                          onChange={(option) =>
                            handleSelectChange(option, { name: "room" })
                          }
                          formatCreateLabel={(inputValue) =>
                            `Criar "${inputValue}"`
                          }
                          getNewOptionData={(inputValue, optionLabel) => ({
                            value: inputValue,
                            label: optionLabel,
                          })}
                          options={roomOptions}
                          placeholder="Selecione ou digite a sala"
                          isClearable
                        />
                      </FormGroup>
                    </Col>
                    <Col md={8}>
                      <FormGroup>
                        <Label>Dias da Semana</Label>
                        <Select
                          isMulti
                          name="daysOfWeek"
                          value={formData.daysOfWeek}
                          onChange={(option) =>
                            handleSelectChange(option, { name: "daysOfWeek" })
                          }
                          options={daysOfWeekOptions}
                          placeholder="Selecione os dias"
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row className="mt-4">
                    <Col>
                      <div className="text-end">
                        <Button
                          color="primary"
                          type="submit"
                          disabled={creatingClass}
                        >
                          {creatingClass ? "Criando..." : "Criar Turma"}
                        </Button>
                      </div>
                    </Col>
                  </Row>

                  {createError && (
                    <Row className="mt-3">
                      <Col>
                        <div className="alert alert-danger">{createError}</div>
                      </Col>
                    </Row>
                  )}
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CreateClass;
