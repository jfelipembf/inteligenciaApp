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
import Breadcrumb from "../../components/Common/Breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import { useActivityManagement } from "../../hooks/useActivityManagement";

const EditActivity = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getActivityById,
    updateActivity,
    loading,
    error,
  } = useActivityManagement();

  const [formData, setFormData] = useState({
    name: "",
    score: "",
    startDate: "",
    endDate: "",
    class: null,
    subject: null,
    teacher: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      const activity = await getActivityById(id);
      if (activity) {
        setFormData({
          name: activity.name,
          score: activity.score || "",
          startDate: activity.startDate,
          endDate: activity.endDate,
          class: activity.class,
          subject: activity.subject,
          teacher: activity.teacher,
        });
      } else {
        alert("Atividade não encontrada.");
        navigate("/activities");
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (option, { name }) => {
    setFormData((prev) => ({
      ...prev,
      [name]: option,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateActivity(id, formData);
      alert("Atividade atualizada com sucesso!");
      navigate("/activities");
    } catch (err) {
      alert("Erro ao atualizar atividade: " + err.message);
    }
  };

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
                        <Label>Nome da Atividade</Label>
                        <Input
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
                          name="score"
                          value={formData.score}
                          onChange={handleInputChange}
                          placeholder="Ex: 10"
                          type="number"
                          min="0"
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={4}>
                      <FormGroup>
                        <Label>Professor</Label>
                        <Select
                          name="teacher"
                          value={formData.teacher}
                          onChange={handleSelectChange}
                          options={[
                            { value: "prof1", label: "Prof. João" },
                            { value: "prof2", label: "Prof. Ana" },
                          ]}
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
                          onChange={handleSelectChange}
                          options={[
                            { value: "matematica", label: "Matemática" },
                            { value: "portugues", label: "Português" },
                          ]}
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
                          onChange={handleSelectChange}
                          options={[
                            { value: "turma1", label: "Turma 1" },
                            { value: "turma2", label: "Turma 2" },
                          ]}
                          placeholder="Selecione a turma"
                          isClearable
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={4}>
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

                    <Col md={4}>
                      <FormGroup>
                        <Label>Data de Fim</Label>
                        <Input
                          type="date"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleInputChange}
                          required
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <div className="mt-4 d-flex justify-content-end gap-2">
                    <Button color="primary" type="submit" disabled={loading}>
                      {loading ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                    <Button
                     color="secondary"
                     onClick={() => navigate("/activities")}
                    >
                     Voltar
                    </Button>                                
                  </div>

                  {error && (
                    <div className="alert alert-danger mt-3">{error}</div>
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
