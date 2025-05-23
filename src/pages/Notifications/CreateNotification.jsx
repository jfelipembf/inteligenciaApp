import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { toast } from "react-toastify";
import useUser from "../../hooks/useUser";
import { useClassContext } from "../../contexts/ClassContext";
import { useStudentsContext } from "../../contexts/StudentsContext";
import { useLessonsContext } from "../../contexts/LessonContext";
import useCreateNotification from "../../hooks/useCreateNotification";

const NOTIFICATION_TYPES = [
  { value: "individual", label: "Individual (Pessoa específica)" },
  { value: "class", label: "Turma (Todos da turma)" },
  { value: "turn", label: "Turno (Todas as turmas do turno)" },
  { value: "school", label: "Escola (Todos da escola)" },
];

const TURN_OPTIONS = [
  { value: "manha", label: "Manhã" },
  { value: "tarde", label: "Tarde" },
  { value: "noite", label: "Noite" },
];

const CreateNotification = () => {
  const navigate = useNavigate();
  const { userDetails } = useUser();
  const { classes } = useClassContext();
  const { students } = useStudentsContext();
  const { lessons, setSelectedClassId } = useLessonsContext();
  const { sendNotification, loading } = useCreateNotification();

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    classId: "",
    targetType: "",
    targetValue: "",
    sendType: "now",
    scheduleDate: "",
    scheduleTime: "",
  });

  // Limitar opções conforme role
  const isCoordinator = userDetails?.role === "coordinator";
  const isProfessor = userDetails?.role === "professor";

  const typeOptions = isCoordinator
    ? NOTIFICATION_TYPES
    : NOTIFICATION_TYPES.filter(
        (t) => t.value === "class" || t.value === "individual"
      );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      ...(name === "targetType" ? { targetValue: "", classId: "" } : {}),
      ...(name === "classId" ? { targetValue: "" } : {}),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submit");

    let notificationData = {
      title: formData.title,
      message: formData.message,
      type: formData.targetType,
      class: null,
      lesson: null,
      turn: null,
      individual: null,
      schedule: null,
    };

    if (formData.targetType === "class") {
      // Coordenador: só turma, Professor: turma e aula
      const selectedClass = classes.find(
        (cls) =>
          cls.id === (isProfessor ? formData.classId : formData.targetValue)
      );
      notificationData.class = selectedClass
        ? { label: selectedClass.className, value: selectedClass.id }
        : null;

      if (isProfessor) {
        const selectedLesson = lessons.find(
          (lesson) => lesson.id === formData.targetValue
        );
        notificationData.lesson = selectedLesson
          ? { label: selectedLesson.subject, value: selectedLesson.id }
          : null;
      }
    } else if (formData.targetType === "individual") {
      const selectedStudent = students.find(
        (student) => student.id === formData.targetValue
      );
      notificationData.individual = selectedStudent
        ? {
            label: selectedStudent.personalInfo?.name,
            value: selectedStudent.id,
          }
        : null;
    } else if (formData.targetType === "turn") {
      notificationData.turn = formData.targetValue;
    }

    // Agendamento
    if (
      formData.sendType === "schedule" &&
      formData.scheduleDate &&
      formData.scheduleTime
    ) {
      notificationData.schedule = {
        date: formData.scheduleDate,
        time: formData.scheduleTime,
      };
    }

    // Para "school", só type já basta, os outros campos ficam null

    const res = await sendNotification(notificationData);
    if (res.success) {
      toast.success("Notificação criada com sucesso!");
      navigate("/notifications");
    } else {
      toast.error("Erro ao criar notificação: " + res.error);
    }
  };

  // Opções de seleção baseadas no tipo
  let targetSelect = null;
  if (formData.targetType === "class") {
    if (isCoordinator) {
      // Coordenador: seleciona turma normalmente
      targetSelect = (
        <Input
          type="select"
          id="targetValue"
          name="targetValue"
          value={formData.targetValue}
          onChange={handleInputChange}
          required
        >
          <option value="">Selecione a turma</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.className}
            </option>
          ))}
        </Input>
      );
    } else if (isProfessor) {
      // Professor: seleciona turma e depois aula (lesson)
      targetSelect = (
        <>
          <FormGroup>
            <Input
              type="select"
              id="classId"
              name="classId"
              value={formData.classId || ""}
              onChange={(e) => {
                handleInputChange(e);
                setSelectedClassId(e.target.value);
              }}
              required
            >
              <option value="">Selecione a turma</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.className}
                </option>
              ))}
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="targetValue">Aula</Label>
            <Input
              type="select"
              id="targetValue"
              name="targetValue"
              value={formData.targetValue}
              onChange={handleInputChange}
              required
              disabled={!formData.classId}
            >
              <option value="">Selecione a aula</option>
              {lessons
                .filter((lesson) => lesson.teacher?.value === userDetails.uid)
                .map((lesson) => (
                  <option key={lesson.id} value={lesson.id}>
                    {lesson.subject} - {lesson.room?.label || "Sem sala"}
                  </option>
                ))}
            </Input>
          </FormGroup>
        </>
      );
    }
  } else if (formData.targetType === "individual") {
    targetSelect = (
      <Input
        type="select"
        id="targetValue"
        name="targetValue"
        value={formData.targetValue}
        onChange={handleInputChange}
        required
      >
        <option value="">Selecione o aluno</option>
        {students.map((student) => (
          <option key={student.id} value={student.id}>
            {student.personalInfo?.name || student.label}
          </option>
        ))}
      </Input>
    );
  } else if (formData.targetType === "turn") {
    targetSelect = (
      <Input
        type="select"
        id="targetValue"
        name="targetValue"
        value={formData.targetValue}
        onChange={handleInputChange}
        required
      >
        <option value="">Selecione o turno</option>
        {TURN_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Input>
    );
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Notificações" breadcrumbItem="Nova Notificação" />
          <Row>
            <Col lg={8}>
              <Card>
                <CardBody>
                  <CardTitle className="mb-4">
                    Informações da Notificação
                  </CardTitle>
                  <Form onSubmit={handleSubmit}>
                    <FormGroup>
                      <Label for="title">Título</Label>
                      <Input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Digite o título da notificação"
                        required
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="message">Mensagem</Label>
                      <Input
                        type="textarea"
                        id="message"
                        name="message"
                        rows="5"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Digite a mensagem"
                        required
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="targetType">Tipo de Destinatário</Label>
                      <Input
                        type="select"
                        id="targetType"
                        name="targetType"
                        value={formData.targetType}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Selecione o tipo</option>
                        {typeOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                    {formData.targetType && (
                      <FormGroup>
                        <Label for="targetValue">
                          {formData.targetType === "class"
                            ? "Turma"
                            : formData.targetType === "turn"
                            ? "Turno"
                            : formData.targetType === "individual"
                            ? "Aluno"
                            : "Destino"}
                        </Label>
                        {targetSelect}
                      </FormGroup>
                    )}
                    <FormGroup>
                      <Label for="sendType">Envio</Label>
                      <Input
                        type="select"
                        id="sendType"
                        name="sendType"
                        value={formData.sendType}
                        onChange={handleInputChange}
                      >
                        <option value="now">Enviar agora</option>
                        <option value="schedule">Agendar envio</option>
                      </Input>
                    </FormGroup>
                    {formData.sendType === "schedule" && (
                      <Row>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="scheduleDate">Data de envio</Label>
                            <Input
                              type="date"
                              name="scheduleDate"
                              id="scheduleDate"
                              className="form-control"
                              value={formData.scheduleDate}
                              min={new Date().toISOString().split("T")[0]}
                              onChange={handleInputChange}
                              required
                            />
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="scheduleTime">Hora de envio</Label>
                            <Input
                              type="time"
                              name="scheduleTime"
                              id="scheduleTime"
                              className="form-control"
                              value={formData.scheduleTime}
                              onChange={handleInputChange}
                              required
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    )}
                    <div className="d-flex flex-wrap gap-2 mt-4">
                      <Button
                        type="submit"
                        color="primary"
                        disabled={
                          loading ||
                          (isProfessor &&
                            formData.targetType === "class" &&
                            (!formData.classId || !formData.targetValue))
                        }
                      >
                        <i className="mdi mdi-send font-size-16 align-middle me-1"></i>{" "}
                        Criar Notificação
                      </Button>
                      <Link to="/notifications">
                        <Button color="secondary" outline>
                          <i className="bx bx-arrow-left font-size-16 align-middle me-1"></i>{" "}
                          Cancelar
                        </Button>
                      </Link>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
            <Col lg={4}>
              <Card>
                <CardBody>
                  <CardTitle className="mb-4">Dicas</CardTitle>
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2">
                      <i className="mdi mdi-information-outline text-primary me-2"></i>
                      Escreva títulos claros e diretos
                    </li>
                    <li className="mb-2">
                      <i className="mdi mdi-information-outline text-primary me-2"></i>
                      Mensagens devem ser objetivas e informativas
                    </li>
                    <li className="mb-2">
                      <i className="mdi mdi-information-outline text-primary me-2"></i>
                      Selecione os destinatários com cuidado para evitar envios
                      desnecessários
                    </li>
                    <li>
                      <i className="mdi mdi-information-outline text-primary me-2"></i>
                      Use o agendamento para enviar notificações no melhor
                      horário
                    </li>
                  </ul>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default CreateNotification;
