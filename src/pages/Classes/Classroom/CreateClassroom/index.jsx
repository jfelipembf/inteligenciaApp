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
import Breadcrumb from "../../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import useClassroomManagement from "../../../../hooks/useClassroomManagement";
import { useParams } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import useFetchTeachers from "../../../../hooks/useFetchTeachers"; // Importação do hook
import firebase from "firebase/compat/app";

const CreateClassroom = () => {
  const { classId } = useParams(); // Obtenção do classId da URL
  const [classPeriod, setClassPeriod] = useState("");
  const [lessons, setLessons] = useState([]);

  const navigate = useNavigate();
  const {
    createClass,
    loading: creatingClass,
    error: createError,
  } = useClassroomManagement();
  const {
    teachers,
    loading: loadingTeachers,
    error: fetchError,
  } = useFetchTeachers(); // Uso do hook

  const [formData, setFormData] = useState({
    subject: "",
    teacher: null,
    startTime: "",
    endTime: "",
    duration: "",
    daysOfWeek: [],
    room: "",
  });

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const currentUser = firebase.auth().currentUser;

        const userDoc = await firebase
          .firestore()
          .collection("users")
          .doc(currentUser.uid)
          .get();

        const classDoc = await firebase
          .firestore()
          .collection("schools")
          .doc(userDoc.data().schoolId)
          .collection("classes")
          .doc(classId)
          .get();

        if (classDoc.exists) {
          setClassPeriod(classDoc.data().period); // Armazena o período da classe

          const lessonsSnapshot = await classDoc.ref
            .collection("lessons")
            .get();
          const lessons = lessonsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setLessons(lessons); // Armazena as aulas existentes na turma
        } else {
          console.error("Classe não encontrada");
        }
      } catch (err) {
        console.error("Erro ao buscar o período da classe:", err);
      }
    };

    fetchClass();
  }, [classId]);

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
      console.log(classPeriod);
      if (formData.period !== classPeriod) {
        alert(
          `O período da aula (${formData.period}) não corresponde ao período da classe (${classPeriod}).`
        );
        return;
      }

      const newStart = new Date(`1970-01-01T${formData.startTime}:00`);
      const newEnd = new Date(`1970-01-01T${formData.endTime}:00`);

      const hasConflict = lessons.some((lesson) => {
        const existingStart = new Date(`1970-01-01T${lesson.startTime}:00`);
        const existingEnd = new Date(`1970-01-01T${lesson.endTime}:00`);

        return (
          (newStart >= existingStart && newStart < existingEnd) || // Início da nova aula está dentro de uma aula existente
          (newEnd > existingStart && newEnd <= existingEnd) || // Fim da nova aula está dentro de uma aula existente
          (newStart <= existingStart && newEnd >= existingEnd) // Nova aula engloba uma aula existente
        );
      });

      if (hasConflict) {
        alert(
          "O horário da aula entra em conflito com outra aula já existente."
        );
        return;
      }

      const classData = {
        ...formData,
        teacher: {
          value: formData.teacher?.value, // ID do professor
          label: formData.teacher?.label, // Nome do professor
        },
      };

      const response = await createClass(classId, classData);
      console.log("Aula criada com sucesso:", response);
      alert("Aula criada com sucesso!");
      navigate(`/classes/${classId}`); // Redireciona para a página da turma
    } catch (err) {
      console.error("Erro ao criar aula:", err);
      alert("Erro ao criar aula: " + err.message);
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
        <Breadcrumb title="Criar Aula" breadcrumbItem="Nova Aula" />

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
                          options={teachers}
                          placeholder="Selecione o professor"
                        />
                      </FormGroup>
                    </Col>

                    <Col md={4}>
                      <FormGroup className="mb-3">
                        <Label>Disciplina</Label>
                        <Input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
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
                          {creatingClass ? "Criando..." : "Criar Aula"}
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

export default CreateClassroom;
