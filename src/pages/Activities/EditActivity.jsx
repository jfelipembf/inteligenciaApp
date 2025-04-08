// ...imports mantidos
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
import Breadcrumb from "../../components/Common/Breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import { useActivityManagement } from "../../hooks/useActivityManagement";
import { useFetchClasses } from "../../hooks/useFetchClasses";
import useFetchTeachers from "../../hooks/useFetchTeachers";

const EditActivity = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { getActivityById, updateActivity } = useActivityManagement();
  const { teachers } = useFetchTeachers();
  const { classes } = useFetchClasses();

  const [activity, setActivity] = useState(null);
  const [formData, setFormData] = useState({
    teacher: null,
    subject: null,
    class: null,
    name: "",
    score: "",
    startDate: "",
    endDate: "",
  });

  // 🔹 1. Buscar atividade ao carregar
  useEffect(() => {
    const fetchActivity = async () => {
      const data = await getActivityById(id);
      setActivity(data);
    };
    fetchActivity();
  }, [getActivityById, id]);

  // 🔹 2. Preencher o formulário com os dados da atividade
  useEffect(() => {
    if (!activity) return;
    setFormData({
      teacher: activity.teacher || null,
      subject: activity.subject || null,
      class: activity.class || null,
      name: activity.name || "",
      score: activity.score || "",
      startDate: activity.startDate || "",
      endDate: activity.endDate || "",
    });
  }, [activity]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (option, { name }) => {
    if (name === "teacher") {
      setFormData((prev) => ({
        ...prev,
        teacher: option,
        subject: null,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: option,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      teacher: formData.teacher,
      subject: formData.subject,
      class: formData.class,
      name: formData.name,
      score: formData.score || null,
      startDate: formData.startDate,
      endDate: formData.endDate,
    };

    try {
      await updateActivity(id, updatedData);
      alert("Atividade atualizada com sucesso!");
      navigate("/activities");
    } catch (err) {
      alert("Erro ao atualizar atividade: " + err.message);
    }
  };

  const teacherOptions = teachers.map((t) => ({
    value: t.uid,
    label: t.personalInfo.name,
    data: t,
  }));

  const selectedTeacher = formData.teacher?.data;
  const subjectOptions =
    selectedTeacher?.professionalInfo?.subjects?.map((s) => ({
      value: s,
      label: s,
    })) || [];

  const classOptions = classes.map((c) => ({
    value: c.id,
    label: c.className,
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
                          isDisabled={!formData.teacher}
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
                        <Button color="primary" type="submit">
                          Salvar Alterações
                        </Button>
                        <Button color="secondary" onClick={() => navigate("/activities")}>
                          Voltar
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

export default EditActivity;
