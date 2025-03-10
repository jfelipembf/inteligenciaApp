import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, CardBody, Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from "reactstrap";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import Breadcrumbs from "../../../components/Common/Breadcrumb";

const ListClasses = () => {
  const navigate = useNavigate();
  
  // Estado para armazenar as turmas
  const [classes, setClasses] = useState([
    { id: 1, name: "Turma A", period: "Manhã", teacher: "João Silva", students: 25 },
    { id: 2, name: "Turma B", period: "Tarde", teacher: "Maria Santos", students: 30 },
    // Dados de exemplo - substituir por dados reais da API
  ]);

  const [modal, setModal] = useState(false);
  const [currentClass, setCurrentClass] = useState(null);
  const [teachers, setTeachers] = useState([]);

  // Mock data for teachers - replace with API call
  useEffect(() => {
    setTeachers([
      { value: "1", label: "Professor João Silva" },
      { value: "2", label: "Professora Maria Santos" },
    ]);
  }, []);

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

  const toggle = () => setModal(!modal);

  const handleEdit = (classItem) => {
    setCurrentClass({
      ...classItem,
      series: null,
      identifier: null,
      teacher: null,
      startTime: "",
      endTime: "",
      duration: "",
      daysOfWeek: [],
      description: "",
      room: null,
      startDate: "",
      endDate: "",
    });
    setModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentClass(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (selectedOption, { name }) => {
    setCurrentClass(prev => ({
      ...prev,
      [name]: selectedOption,
    }));
  };

  // Determina o período baseado no horário de início
  useEffect(() => {
    if (currentClass?.startTime) {
      const hour = parseInt(currentClass.startTime.split(":")[0]);
      let period = "";
      
      if (hour >= 5 && hour < 12) {
        period = "Manhã";
      } else if (hour >= 12 && hour < 18) {
        period = "Tarde";
      } else {
        period = "Noite";
      }

      setCurrentClass(prev => ({
        ...prev,
        period
      }));
    }
  }, [currentClass?.startTime]);

  // Calcula a duração
  useEffect(() => {
    if (currentClass?.startTime && currentClass?.endTime) {
      const start = new Date(`1970-01-01T${currentClass.startTime}:00`);
      const end = new Date(`1970-01-01T${currentClass.endTime}:00`);

      if (end > start) {
        const durationInMinutes = (end - start) / (1000 * 60);
        const hours = Math.floor(durationInMinutes / 60);
        const minutes = durationInMinutes % 60;
        const duration = `${hours}h${minutes > 0 ? ` ${minutes}min` : ''}`;
        
        setCurrentClass(prev => ({
          ...prev,
          duration: duration,
        }));
      }
    }
  }, [currentClass?.startTime, currentClass?.endTime]);

  const handleSave = () => {
    // Aqui você implementará a lógica para salvar as alterações
    setModal(false);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Breadcrumb */}
          <Breadcrumbs title="Turmas" breadcrumbItem="Visualizar Turmas" />

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="card-title mb-0">Lista de Turmas</h4>
                    <Button
                      color="primary"
                      onClick={() => navigate("/create-class")}
                    >
                      Nova Turma
                    </Button>
                  </div>

                  <div className="table-responsive">
                    <Table className="table-centered table-nowrap mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Nome da Turma</th>
                          <th>Período</th>
                          <th>Professor</th>
                          <th>Alunos</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {classes.map((classItem) => (
                          <tr key={classItem.id}>
                            <td>{classItem.id}</td>
                            <td>{classItem.name}</td>
                            <td>{classItem.period}</td>
                            <td>{classItem.teacher}</td>
                            <td>{classItem.students}</td>
                            <td>
                              <Button
                                color="info"
                                size="sm"
                                className="me-2"
                                onClick={() => navigate(`/classes/${classItem.id}`)}
                              >
                                Ver
                              </Button>
                              <Button
                                color="warning"
                                size="sm"
                                className="me-2"
                                onClick={() => handleEdit(classItem)}
                              >
                                Editar
                              </Button>
                              <Button
                                color="danger"
                                size="sm"
                                onClick={() => {
                                  // Implementar exclusão
                                }}
                              >
                                Excluir
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Modal de Edição */}
          <Modal isOpen={modal} toggle={toggle} size="lg">
            <ModalHeader toggle={toggle}>
              Editar Turma
            </ModalHeader>
            <ModalBody>
              <Form>
                <Row>
                  <Col md={4}>
                    <FormGroup>
                      <Label>Série</Label>
                      <Select
                        name="series"
                        value={currentClass?.series}
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
                        value={currentClass?.identifier}
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
                        value={currentClass?.teacher}
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
                        value={currentClass?.startTime || ''}
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
                        value={currentClass?.endTime || ''}
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
                        value={currentClass?.duration || ''}
                        disabled
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col md={6}>
                    <FormGroup>
                      <Label>Dias da Semana</Label>
                      <Select
                        isMulti
                        name="daysOfWeek"
                        value={currentClass?.daysOfWeek}
                        onChange={(option) => handleSelectChange(option, { name: "daysOfWeek" })}
                        options={daysOfWeekOptions}
                        placeholder="Selecione os dias"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Sala</Label>
                      <Select
                        name="room"
                        value={currentClass?.room}
                        onChange={(option) => handleSelectChange(option, { name: "room" })}
                        options={roomOptions}
                        placeholder="Selecione a sala"
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col md={6}>
                    <FormGroup>
                      <Label>Data de Início</Label>
                      <Input
                        type="date"
                        name="startDate"
                        value={currentClass?.startDate || ''}
                        onChange={handleInputChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Data de Término</Label>
                      <Input
                        type="date"
                        name="endDate"
                        value={currentClass?.endDate || ''}
                        onChange={handleInputChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col md={12}>
                    <FormGroup>
                      <Label>Descrição</Label>
                      <Input
                        type="textarea"
                        name="description"
                        value={currentClass?.description || ''}
                        onChange={handleInputChange}
                        rows="3"
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={handleSave}>
                Salvar
              </Button>
              <Button color="secondary" onClick={toggle}>
                Cancelar
              </Button>
            </ModalFooter>
          </Modal>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ListClasses;
