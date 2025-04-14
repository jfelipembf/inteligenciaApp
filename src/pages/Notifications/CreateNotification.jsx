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
  FormFeedback,
  Alert,
  InputGroup,
} from "reactstrap";
import Select from "react-select";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateNotification = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    targetType: "",
    sendType: "now", // 'now' ou 'schedule'
    scheduleDate: "",
    scheduleTime: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Notificação criada com sucesso!");
    navigate("/notifications");
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Notificações" breadcrumbItem="Criar Notificação" />
          <Row>
            <Col lg={8}>
              <Card>
                <CardBody>
                  <CardTitle className="mb-4">Informações da Notificação</CardTitle>
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={12}>
                        <FormGroup>
                          <Label for="title">Título</Label>
                          <Input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Digite o título da notificação"
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12}>
                        <FormGroup>
                          <Label for="message">Mensagem</Label>
                          <Input
                            type="textarea"
                            id="message"
                            name="message"
                            rows="5"
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder="Digite a mensagem da notificação"
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12}>
                        <FormGroup>
                          <Label for="targetType">Tipo de Destinatário</Label>
                          <Input
                            type="select"
                            id="targetType"
                            name="targetType"
                            value={formData.targetType}
                            onChange={handleInputChange}
                          >
                            <option value="">Selecione o tipo de destinatário</option>
                            <option value="Pessoa">Pessoa específica</option>
                            <option value="Turmas">Turmas específicas</option>
                            <option value="Turno">Turno completo</option>
                            <option value="Série">Série completa</option>
                            <option value="Escola">Toda a escola</option>
                          </Input>
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row className="mt-3">
                      <Col md={12}>
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
                      </Col>
                    </Row>

                    {formData.sendType === "schedule" && (
                      <Row>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="scheduleDate">Data de Envio</Label>
                            <Input
                              type="date"
                              name="scheduleDate"
                              id="scheduleDate"
                              className="form-control"
                              value={formData.scheduleDate}
                              min={new Date().toISOString().split('T')[0]}
                              onChange={handleInputChange}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="scheduleTime">Hora de Envio</Label>
                            <Input
                              type="time"
                              name="scheduleTime"
                              id="scheduleTime"
                              className="form-control"
                              value={formData.scheduleTime}
                              onChange={handleInputChange}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    )}

                    <div className="d-flex flex-wrap gap-2 mt-4">
                      <Button type="submit" color="primary">
                        <i className="mdi mdi-send font-size-16 align-middle me-1"></i> Criar Notificação
                      </Button>
                      <Link to="/notifications">
                        <Button color="secondary" outline>
                          <i className="bx bx-arrow-left font-size-16 align-middle me-1"></i> Cancelar
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
                  <CardTitle className="mb-4">
                    Dicas
                  </CardTitle>
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2">
                      <i className="mdi mdi-information-outline text-primary me-2"></i>
                      Escreva títulos claros e diretos
                    </li>
                    <li className="mb-2">
                      <i className="mdi mdi-information-outline text-primary me-2"></i>
                      Mensagens devem ser concisas e informativas
                    </li>
                    <li className="mb-2">
                      <i className="mdi mdi-information-outline text-primary me-2"></i>
                      Selecione cuidadosamente os destinatários para evitar envios desnecessários
                    </li>
                    <li>
                      <i className="mdi mdi-information-outline text-primary me-2"></i>
                      Use o agendamento para enviar notificações em horários mais adequados
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
