import { useEffect, useState } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../../components/Common/Breadcrumb";
import { useActivityManagement } from "../../hooks/useActivityManagement";
import { useFetchClasses } from "../../hooks/useFetchClasses";
import useFetchLessons from "../../hooks/useFetchLessons";

const EditActivity = () => {
  const { classId, lessonId, id } = useParams();
  const navigate = useNavigate();

  const {
    getActivityById,
    updateActivity,
    loading: saving,
    error,
  } = useActivityManagement();

  const [formData, setFormData] = useState({
    subject: null,
    class: null,
    name: "",
    score: "",
    startDate: "",
    endDate: "",
    activityType: null,
    description: "",
  });
  

  const [classes, setClasses] = useState([]);
  const [isStartDateLocked, setIsStartDateLocked] = useState(false);

  const { classes: fetchedClasses } = useFetchClasses();

  useEffect(() => {
    setClasses(fetchedClasses);
  }, [fetchedClasses]);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const activity = await getActivityById(classId, lessonId, id);

        const today = new Date().toISOString().split("T")[0];
        const startDate = activity.startDate;

        setFormData({
          class: activity.class
            ? { value: activity.class.id, label: activity.class.name }
            : null,
          subject: activity.subject
            ? { value: activity.subject.id, label: activity.subject.name }
            : null,
          name: activity.name || "",
          score: activity.score || "",
          startDate: activity.startDate || "",
          endDate: activity.endDate || "",
          activityType: activity.activityType
            ? { value: activity.activityType, label: activity.activityType.toUpperCase() }
            : null,
          description: activity.description || "",
        });        

        if (startDate && startDate <= today) {
          setIsStartDateLocked(true);
        }
      } catch (err) {
        console.error("Erro ao carregar atividade:", err);
        alert("Erro ao carregar atividade");
      }
    };

    fetchActivity();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedClassId = formData.class?.value;
  const { lessons, loading: loadingLessons } = useFetchLessons(selectedClassId);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (selectedOption, { name }) => {
    setFormData((prev) => ({
      ...prev,
      [name]: selectedOption,
      ...(name === "class" && { subject: null }),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subject || !formData.class || !formData.name || !formData.startDate || !formData.endDate) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (formData.startDate > formData.endDate) {
      alert("A data de início não pode ser posterior à de término.");
      return;
    }

    if (formData.endDate < today) {
      alert("A data de término não pode estar no passado.");
      return;
    }

    try {
      const updated = {
        subject: { id: formData.subject.value, name: formData.subject.label },
        class: { id: formData.class.value, name: formData.class.label },
        name: formData.name,
        score: formData.score || null,
        startDate: formData.startDate,
        endDate: formData.endDate,
        activityType: formData.activityType?.value || null,
        description: formData.description || "",
      };      

      await updateActivity(id, updated);
      alert("Atividade atualizada com sucesso!");
      navigate("/activities");
    } catch (err) {
      console.error("Erro ao atualizar atividade:", err);
      alert("Erro ao atualizar atividade: " + err.message);
    }
  };

  const classOptions = classes.map((c) => ({
    value: c.id,
    label: c.className,
    data: c,
  }));

  const subjectOptions = lessons.map((lesson) => ({
    value: lesson.id || lesson.subject || lesson,
    label: lesson.subject || lesson.subject || lesson,
  }));

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb title="Editar Atividade" breadcrumbItem="Atividades" />

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
                          placeholder={loadingLessons ? "Carregando disciplinas..." : "Selecione a disciplina"}
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
                          disabled={isStartDateLocked}
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
                        <Label>Descrição</Label>
                        <Input
                          type="textarea"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Descreva a atividade (opcional)"
                          rows={4}
                        />
                        </FormGroup>
                    </Col>
                  </Row>

                  <Row className="mt-4">
                    <Col className="text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <Button color="primary" type="submit" disabled={saving}>
                          {saving ? "Salvando..." : "Salvar Alterações"}
                        </Button>
                        <Button
                          color="secondary"
                          onClick={() => navigate("/activities")}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </Col>
                  </Row>

                  {error && (
                    <Row className="mt-3">
                      <Col>
                        <div className="alert alert-danger">{error}</div>
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

export default EditActivity;
