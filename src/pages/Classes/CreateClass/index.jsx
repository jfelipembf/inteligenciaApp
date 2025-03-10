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

const CreateClass = () => {
  const navigate = useNavigate();
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

  const [teachers, setTeachers] = useState([]);

  // Mock data for teachers - replace with API call
  useEffect(() => {
    setTeachers([
      { value: "1", label: "Professor João Silva" },
      { value: "2", label: "Professora Maria Santos" },
    ]);
  }, []);

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

      setFormData(prev => ({
        ...prev,
        period
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
        const duration = `${hours}h${minutes > 0 ? ` ${minutes}min` : ''}`;
        
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
    { value: "1", label: "1º ano" },
    { value: "2", label: "2º ano" },
    { value: "3", label: "3º ano" },
    { value: "4", label: "4º ano" },
    { value: "5", label: "5º ano" },
    { value: "6", label: "6º ano" },
    { value: "7", label: "7º ano" },
    { value: "8", label: "8º ano" },
    { value: "9", label: "9º ano" },
  ];

  const identifierOptions = "ABCDEFGHIJ".split("").map((letter) => ({
    value: letter,
    label: letter,
  }));

  const roomOptions = [
    { value: "101", label: "Sala 101" },
    { value: "102", label: "Sala 102" },
    { value: "103", label: "Sala 103" },
    { value: "104", label: "Sala 104" },
    { value: "105", label: "Sala 105" },
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

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
                        <Select
                          name="series"
                          value={formData.series}
                          onChange={(option) => handleSelectChange(option, { name: "series" })}
                          options={seriesOptions}
                          placeholder="Selecione a série"
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label>Turma</Label>
                        <Select
                          name="identifier"
                          value={formData.identifier}
                          onChange={(option) => handleSelectChange(option, { name: "identifier" })}
                          options={identifierOptions}
                          placeholder="Selecione a turma"
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label>Professor Responsável</Label>
                        <Select
                          name="teacher"
                          value={formData.teacher}
                          onChange={(option) => handleSelectChange(option, { name: "teacher" })}
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
                        <Select
                          name="room"
                          value={formData.room}
                          onChange={(option) => handleSelectChange(option, { name: "room" })}
                          options={roomOptions}
                          placeholder="Selecione a sala"
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
                          onChange={(option) => handleSelectChange(option, { name: "daysOfWeek" })}
                          options={daysOfWeekOptions}
                          placeholder="Selecione os dias"
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col md={12}>
                      <FormGroup>
                        <Label>Descrição da Turma</Label>
                        <Input
                          type="textarea"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Descreva os objetivos e características da turma"
                          rows="4"
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row className="mt-4">
                    <Col>
                      <div className="text-end">
                        <Button color="primary" type="submit">
                          Criar Turma
                        </Button>
                      </div>
                    </Col>
                  </Row>
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
