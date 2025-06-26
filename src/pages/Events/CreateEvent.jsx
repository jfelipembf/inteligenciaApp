import React, { useState, useEffect } from "react";
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
  InputGroup,
  Alert,
} from "reactstrap";
import Select from "react-select";
import { Link, useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import Dropzone from "react-dropzone";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useSaveEvent from "../../hooks/useSaveEvent";
import uploadToFirebase from "../../utils/uploadToFirebase";
import { useClassContext } from "../../contexts/ClassContext";
import useUser from "../../hooks/useUser";
import { v4 as uuidv4 } from "uuid";

// Dados de exemplo para turmas
const CLASS_OPTIONS = [
  { value: "1A", label: "1º Ano A" },
  { value: "1B", label: "1º Ano B" },
  { value: "2A", label: "2º Ano A" },
  { value: "2B", label: "2º Ano B" },
  { value: "3A", label: "3º Ano A" },
  { value: "3B", label: "3º Ano B" },
];

// Dados de exemplo para eventos
const SAMPLE_EVENTS = [
  {
    id: "evt001",
    name: "Feira de Ciências",
    startDate: "2025-05-15",
    endDate: "2025-05-15",
    startTime: "09:00",
    endTime: "17:00",
    classes: ["1A", "1B", "2A"],
    location: "Pátio da Escola",
    value: "Gratuito",
    status: "Agendado",
    image: null,
    notes: "Trazer projetos uma hora antes para montagem",
  },
  {
    id: "evt002",
    name: "Festa Junina",
    startDate: "2025-06-20",
    endDate: "2025-06-20",
    startTime: "18:00",
    endTime: "22:00",
    classes: ["1A", "1B", "2A", "2B", "3A", "3B"],
    location: "Quadra Poliesportiva",
    value: "R$ 10,00",
    status: "Agendado",
    image: null,
    notes: "Traje típico é opcional",
  },
  {
    id: "evt003",
    name: "Excursão ao Museu",
    startDate: "2025-04-30",
    endDate: "2025-04-30",
    startTime: "08:00",
    endTime: "14:00",
    classes: ["3A", "3B"],
    location: "Museu de História Natural",
    value: "R$ 25,00",
    status: "Agendado",
    image: null,
    notes: "Levar autorização dos pais e lanche",
  },
];

const CreateEvent = () => {
  const {
    classes,
    loading: loadingClasses,
    error: classesError,
  } = useClassContext();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const { saveEvent, loading: savingEvent } = useSaveEvent();
  const { userDetails } = useUser();
  const schoolId = userDetails?.schoolId;
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    classes: [],
    location: "",
    value: "",
    image: null,
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    if (isEditMode) {
      setLoading(true);

      setTimeout(() => {
        const eventData = SAMPLE_EVENTS.find((event) => event.id === id);

        if (eventData) {
          const classesOptions = eventData.classes.map(
            (classId) =>
              classes.find((option) => option.value === classId) || {
                value: classId,
                label: classId,
              }
          );

          setFormData({
            ...eventData,
            classes: classesOptions,
          });
        } else {
          toast.error("Evento não encontrado!");
          navigate("/events");
        }

        setLoading(false);
      }, 800);
    }
  }, [id, isEditMode, navigate, classes]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Limpar erro do campo quando o usuário digita
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleSelectChange = (selectedOption, { name }) => {
    setFormData({
      ...formData,
      [name]: selectedOption,
    });

    // Limpar erro do campo quando o usuário seleciona
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleFileChange = (acceptedFiles) => {
    setSelectedFiles(acceptedFiles);

    // Limpar erro do campo quando o usuário seleciona um arquivo
    if (errors.image) {
      setErrors({
        ...errors,
        image: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome do evento é obrigatório";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Data de início é obrigatória";
    }

    if (!formData.endDate) {
      newErrors.endDate = "Data de término é obrigatória";
    } else if (formData.endDate < formData.startDate) {
      newErrors.endDate = "Data de término deve ser posterior à data de início";
    }

    if (!formData.startTime) {
      newErrors.startTime = "Hora de início é obrigatória";
    }

    if (!formData.endTime) {
      newErrors.endTime = "Hora de término é obrigatória";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Local é obrigatório";
    }

    if (!formData.classes || formData.classes.length === 0) {
      newErrors.classes = "Selecione pelo menos uma turma";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);

      try {
        const pathId = `${uuidv4()}`;

        if (selectedFiles.length > 0) {
          await uploadToFirebase(
            selectedFiles[0],
            `events/${pathId}`,
            schoolId
          );
        }

        const eventData = {
          name: formData.name,
          startDate: formData.startDate,
          endDate: formData.endDate,
          startTime: formData.startTime,
          endTime: formData.endTime,
          classes: formData.classes.map((cls) => ({
            value: cls.value,
            label: cls.label,
          })), // Salvar como { value, label }
          location: formData.location,
          value: formData.value || "Gratuito",
          notes: formData.notes,
          gallery: pathId,
          cover: selectedFiles.length > 0 ? selectedFiles[0].name : null,
        };

        await saveEvent(eventData);

        toast.success(
          isEditMode
            ? "Evento atualizado com sucesso!"
            : "Evento criado com sucesso!"
        );
        navigate("/events");
      } catch (err) {
        toast.error(`Erro ao salvar evento: ${err.message}`);
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Por favor, corrija os erros no formulário");
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Breadcrumb */}
          <Breadcrumbs
            title="Eventos"
            breadcrumbItem={isEditMode ? "Editar Evento" : "Criar Evento"}
          />

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <CardTitle className="mb-4">
                    {isEditMode ? "Editar Evento" : "Novo Evento"}
                  </CardTitle>

                  {loading ? (
                    <div className="text-center my-4">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Carregando...</span>
                      </div>
                      <p className="mt-2">Carregando dados...</p>
                    </div>
                  ) : (
                    <Form onSubmit={handleSubmit}>
                      <Row>
                        <Col md={12}>
                          <FormGroup>
                            <Label for="name">Nome do Evento *</Label>
                            <Input
                              type="text"
                              name="name"
                              id="name"
                              placeholder="Digite o nome do evento"
                              value={formData.name}
                              onChange={handleInputChange}
                              invalid={!!errors.name}
                            />
                            <FormFeedback>{errors.name}</FormFeedback>
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={3}>
                          <FormGroup>
                            <Label for="startDate">Data de Início *</Label>
                            <Input
                              type="date"
                              name="startDate"
                              id="startDate"
                              value={formData.startDate}
                              onChange={handleInputChange}
                              invalid={!!errors.startDate}
                            />
                            <FormFeedback>{errors.startDate}</FormFeedback>
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label for="endDate">Data de Término *</Label>
                            <Input
                              type="date"
                              name="endDate"
                              id="endDate"
                              value={formData.endDate}
                              onChange={handleInputChange}
                              invalid={!!errors.endDate}
                            />
                            <FormFeedback>{errors.endDate}</FormFeedback>
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label for="startTime">Hora de Início *</Label>
                            <Input
                              type="time"
                              name="startTime"
                              id="startTime"
                              value={formData.startTime}
                              onChange={handleInputChange}
                              invalid={!!errors.startTime}
                            />
                            <FormFeedback>{errors.startTime}</FormFeedback>
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label for="endTime">Hora de Término *</Label>
                            <Input
                              type="time"
                              name="endTime"
                              id="endTime"
                              value={formData.endTime}
                              onChange={handleInputChange}
                              invalid={!!errors.endTime}
                            />
                            <FormFeedback>{errors.endTime}</FormFeedback>
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="location">Local *</Label>
                            <Input
                              type="text"
                              name="location"
                              id="location"
                              placeholder="Digite o local do evento"
                              value={formData.location}
                              onChange={handleInputChange}
                              invalid={!!errors.location}
                            />
                            <FormFeedback>{errors.location}</FormFeedback>
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="value">Valor</Label>
                            <InputGroup>
                              <span className="input-group-text">R$</span>
                              <Input
                                type="text"
                                name="value"
                                id="value"
                                placeholder="0,00"
                                value={formData.value}
                                onChange={handleInputChange}
                              />
                            </InputGroup>
                            <small className="text-muted">
                              Deixe em branco para eventos gratuitos
                            </small>
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={12}>
                          <FormGroup>
                            <Label for="classes">Turmas Participantes *</Label>
                            <Select
                              isMulti
                              name="classes"
                              id="classes"
                              value={formData.classes}
                              onChange={(option) =>
                                handleSelectChange(option, { name: "classes" })
                              }
                              options={classes}
                              isLoading={loadingClasses}
                              classNamePrefix="select2-selection"
                              placeholder="Selecione as turmas participantes"
                              invalid={!!errors.classes}
                            />
                            {console.log(classes)}
                            {errors.classes && (
                              <div className="invalid-feedback d-block">
                                {errors.classes}
                              </div>
                            )}
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={12}>
                          <FormGroup>
                            <Label>Imagem do Evento</Label>
                            <div className="dropzone">
                              <Dropzone
                                onDrop={handleFileChange}
                                accept={{
                                  "image/*": [".jpeg", ".jpg", ".png"],
                                }}
                                maxFiles={1}
                              >
                                {({ getRootProps, getInputProps }) => (
                                  <div
                                    className="dz-message needsclick"
                                    {...getRootProps()}
                                  >
                                    <input {...getInputProps()} />
                                    <div className="mb-3">
                                      <i className="display-4 text-muted bx bxs-cloud-upload"></i>
                                    </div>
                                    <h4>
                                      Arraste uma imagem ou clique para
                                      selecionar
                                    </h4>
                                  </div>
                                )}
                              </Dropzone>
                            </div>
                            <small className="text-muted">
                              Tamanho recomendado: <strong>1200x400px</strong>{" "}
                            </small>
                            {selectedFiles.length > 0 && (
                              <div className="dropzone-previews mt-3">
                                <div className="mt-1 mb-0 p-2 rounded">
                                  <div className="d-flex flex-wrap">
                                    {selectedFiles.map((f, i) => (
                                      <Card
                                        className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                                        key={i + "-file"}
                                      >
                                        <div className="p-2">
                                          <Row className="align-items-center">
                                            <Col className="col-auto">
                                              <img
                                                data-dz-thumbnail=""
                                                height="80"
                                                className="avatar-sm rounded bg-light"
                                                alt={f.name}
                                                src={URL.createObjectURL(f)}
                                              />
                                            </Col>
                                            <Col>
                                              <Link
                                                to="#"
                                                className="text-muted font-weight-bold"
                                              >
                                                {f.name}
                                              </Link>
                                              <p className="mb-0">
                                                <strong>
                                                  {f.formattedSize}
                                                </strong>
                                              </p>
                                            </Col>
                                          </Row>
                                        </div>
                                      </Card>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={12}>
                          <FormGroup>
                            <Label for="notes">Informações Adicionais</Label>
                            <Input
                              type="textarea"
                              name="notes"
                              id="notes"
                              rows="4"
                              placeholder="Digite informações adicionais sobre o evento"
                              value={formData.notes}
                              onChange={handleInputChange}
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      <div className="d-flex flex-wrap gap-2 mt-4">
                        <Button
                          type="submit"
                          color="primary"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <i className="bx bx-loader bx-spin font-size-16 align-middle me-2"></i>
                              Salvando...
                            </>
                          ) : (
                            <>Salvar</>
                          )}
                        </Button>
                        <Button
                          type="button"
                          color="light"
                          className="ms-1"
                          onClick={() => navigate("/events")}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </Form>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Toast Container */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default CreateEvent;
