import { useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/Common/Breadcrumb";
import { useActivityManagement } from "../../hooks/useActivityManagement";

import { useClassContext } from "../../contexts/ClassContext";
import { useLessonsContext } from "../../contexts/LessonContext";

const NewActivity = () => {
  const navigate = useNavigate();
  const {
    createActivity,
    loading: creatingActivity,
    error: createError,
  } = useActivityManagement();

  const [formData, setFormData] = useState({
    subject: null,
    class: null,
    name: "",
    score: "",
    startDate: "",
    endDate: "",
    activityType: "sala",
    description: "",
  });

  const [classes, setClasses] = useState([]);
  const { classes: fetchedClasses } = useClassContext();

  useEffect(() => {
    setClasses(fetchedClasses);
  }, [fetchedClasses]);

  const selectedClassIdFromForm = formData.class?.value;
  const {
    lessons,
    loading: loadingLessons,
    error: er,
    setSelectedClassId,
  } = useLessonsContext();

  useEffect(() => {
    if (selectedClassIdFromForm) {
      setSelectedClassId(selectedClassIdFromForm); // Atualiza o contexto com o classId
    }
  }, [selectedClassIdFromForm, setSelectedClassId]);

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
      ...(name === "class" && { subject: null }), // resetar subject quando turma mudar
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.subject ||
      !formData.class ||
      !formData.name ||
      !formData.startDate ||
      !formData.endDate
    ) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    if (formData.startDate < today || formData.endDate < today) {
      alert("Datas não podem estar no passado.");
      return;
    }

    if (formData.startDate > formData.endDate) {
      alert("A data de início não pode ser posterior à de término.");
      return;
    }

    try {
      const activityData = {
        subject: { name: formData.subject.label, id: formData.subject.value },
        class: { name: formData.class.label, id: formData.class.value },
        name: formData.name,
        score: formData.score || null,
        startDate: formData.startDate,
        endDate: formData.endDate,
        activityType: formData.activityType, // novo campo
        description: formData.description, // novo campo
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

  const classOptions = classes.map((c) => ({
    value: c.id,
    label: `${c.className}`,
    data: c,
  }));

  const subjectOptions = lessons.map((lesson) => ({
    value: lesson.id || lesson.subject || lesson,
    label: lesson.subject || lesson.subject || lesson,
  }));

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
                    <Col md={6}>
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
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label>Disciplina</Label>
                        <Select
                          name="subject"
                          value={formData.subject}
                          onChange={(option) =>
                            handleSelectChange(option, { name: "subject" })
                          }
                          options={subjectOptions}
                          placeholder={
                            loadingLessons
                              ? "Carregando disciplinas..."
                              : "Selecione a disciplina"
                          }
                          isClearable
                          isDisabled={!formData.class || loadingLessons}
                          required
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
                          required
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
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label>Tipo de Atividade</Label>
                        <Input
                          type="select"
                          name="activityType"
                          value={formData.activityType}
                          onChange={handleInputChange}
                        >
                          <option value="sala">Para Sala</option>
                          <option value="casa">Para Casa</option>
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col md={12}>
                      <FormGroup>
                        <Label>Descrição da Atividade</Label>
                        <Input
                          type="textarea"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Descreva a atividade..."
                          rows={3}
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
