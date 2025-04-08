import React, { useState } from "react";
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
import CreatableSelect from "react-select/creatable";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/Common/Breadcrumb";
import { useActivityManagement } from "../../hooks/useActivityManagement"; // hook hipotético

const NewActivity = () => {
  const navigate = useNavigate();
  const {
    createActivity,
    loading: creatingActivity,
    error: createError,
  } = useActivityManagement();

  const [formData, setFormData] = useState({
    teacher: null,
    subject: null,
    class: null,
    name: "",
    score: "",
    startDate: "",
    endDate: "",
  });

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
      const activityData = {
        teacherId: formData.teacher?.value,
        subjectId: formData.subject?.value,
        classId: formData.class?.value,
        name: formData.name,
        score: formData.score || null,
        startDate: formData.startDate,
        endDate: formData.endDate,
      };

      const response = await createActivity(activityData);
      console.log("Atividade criada com sucesso:", response);
      alert("Atividade criada com sucesso!");
      navigate("/activities");
    } catch (err) {
      console.error("Erro ao criar atividade:", err);
      alert("Erro ao criar atividade: " + err.message);
    }
  };

  const teacherOptions = [
    { value: "1", label: "Prof. João" },
    { value: "2", label: "Profª. Maria" },
  ];

  const subjectOptions = [
    { value: "1", label: "Matemática" },
    { value: "2", label: "Português" },
  ];

  const classOptions = [
    { value: "1A", label: "1º Ano - A" },
    { value: "2B", label: "2º Ano - B" },
  ];

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb title="Criar Atividade" breadcrumbItem="Atividades" />

        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={4}>
                      <FormGroup>
                        <Label>Professor Responsável</Label>
                        <Select
                          name="teacher"
                          value={formData.teacher}
                          onChange={(option) =>
                            handleSelectChange(option, { name: "teacher" })
                          }
                          options={teacherOptions}
                          placeholder="Selecione o professor"
                          isClearable
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label>Disciplina</Label>
                        <Select
                          name="subject"
                          value={formData.subject}
                          onChange={(option) =>
                            handleSelectChange(option, { name: "subject" })
                          }
                          options={subjectOptions}
                          placeholder="Selecione a disciplina"
                          isClearable
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label>Turma</Label>
                        <Select
                          name="class"
                          value={formData.class}
                          onChange={(option) =>
                            handleSelectChange(option, { name: "class" })
                          }
                          options={classOptions}
                          placeholder="Selecione a turma"
                          isClearable
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col md={6}>
                      <FormGroup>
                        <Label>Nome da Atividade</Label>
                        <Input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Digite o nome da atividade"
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label>Pontuação (opcional)</Label>
                        <Input
                          type="number"
                          name="score"
                          value={formData.score}
                          onChange={handleInputChange}
                          placeholder="Ex: 10"
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col md={3}>
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
                    <Col md={3}>
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
                  </Row>

									<Row className="mt-4">
										<Col className="text-end">
											<div className="d-flex justify-content-end gap-2">
												<Button
													color="primary"
													type="submit"
													disabled={creatingActivity}
												>
													{creatingActivity ? "Criando..." : "Criar Atividade"}
												</Button>
												<Button
													color="secondary"
													onClick={() => navigate("/activities")}
												>
													Voltar
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

export default NewActivity;
