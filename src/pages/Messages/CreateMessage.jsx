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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Componentes
import Breadcrumbs from "../../components/Common/Breadcrumb";

// Dados de exemplo para destinatários
const RECIPIENT_TYPE_OPTIONS = [
  { value: "person", label: "Pessoa específica" },
  { value: "class", label: "Turma específica" },
  { value: "teachers", label: "Todos os professores" },
  { value: "staff", label: "Todos os funcionários" },
  { value: "parents", label: "Todos os responsáveis" },
  { value: "school", label: "Toda a escola" },
];

// Dados de exemplo para pessoas
const PEOPLE_OPTIONS = [
  { value: "teacher1", label: "Roberto Santos (Professor - Matemática)" },
  { value: "teacher2", label: "Juliana Lima (Professora - Português)" },
  { value: "student1", label: "Ana Silva (Aluno - 1º Ano A)" },
  { value: "student2", label: "João Souza (Aluno - 2º Ano B)" },
  { value: "parent1", label: "Carlos Silva (Responsável - Ana Silva)" },
  { value: "parent2", label: "Márcia Souza (Responsável - João Souza)" },
  { value: "staff1", label: "Pedro Almeida (Funcionário - Secretaria)" },
  { value: "staff2", label: "Sandra Oliveira (Funcionária - Coordenação)" },
];

// Dados de exemplo para turmas
const CLASS_OPTIONS = [
  { value: "1A", label: "1º Ano A" },
  { value: "1B", label: "1º Ano B" },
  { value: "2A", label: "2º Ano A" },
  { value: "2B", label: "2º Ano B" },
  { value: "3A", label: "3º Ano A" },
  { value: "3B", label: "3º Ano B" },
];

// Prioridades
const PRIORITY_OPTIONS = [
  { value: "Alta", label: "Alta" },
  { value: "Normal", label: "Normal" },
  { value: "Baixa", label: "Baixa" },
];

// Estilos personalizados para o Select
const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? '#556ee6' : '#ced4da',
    boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(85, 110, 230, 0.25)' : 'none',
    '&:hover': {
      borderColor: state.isFocused ? '#556ee6' : '#ced4da',
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#556ee6' : state.isFocused ? 'rgba(85, 110, 230, 0.1)' : 'white',
    color: state.isSelected ? 'white' : '#495057',
  }),
};

const CreateMessage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    subject: "",
    content: "",
    recipientType: null,
    recipient: null,
    priority: { value: "Normal", label: "Normal" },
    attachments: [],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpar erro do campo quando o usuário digita
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const handleSelectChange = (selectedOption, { name }) => {
    setFormData({
      ...formData,
      [name]: selectedOption
    });
    
    // Se mudar o tipo de destinatário, resetar o valor do destinatário
    if (name === "recipientType") {
      setFormData(prev => ({
        ...prev,
        recipient: null
      }));
    }
    
    // Limpar erro do campo quando o usuário seleciona
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({
      ...formData,
      attachments: [...formData.attachments, ...files]
    });
  };

  const removeAttachment = (index) => {
    const updatedAttachments = [...formData.attachments];
    updatedAttachments.splice(index, 1);
    setFormData({
      ...formData,
      attachments: updatedAttachments
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.subject.trim()) {
      newErrors.subject = "Assunto da mensagem é obrigatório";
    }
    
    if (!formData.content.trim()) {
      newErrors.content = "Conteúdo da mensagem é obrigatório";
    }
    
    if (!formData.recipientType) {
      newErrors.recipientType = "Tipo de destinatário é obrigatório";
    }
    
    // Validar valor do destinatário com base no tipo selecionado
    if (formData.recipientType && formData.recipientType.value === "person" && !formData.recipient) {
      newErrors.recipient = "Selecione um destinatário";
    }
    
    if (formData.recipientType && formData.recipientType.value === "class" && !formData.recipient) {
      newErrors.recipient = "Selecione uma turma";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setLoading(true);
      
      // Simular envio da mensagem
      setTimeout(() => {
        setLoading(false);
        toast.success("Mensagem enviada com sucesso!");
        
        // Redirecionar para a lista de mensagens após o envio
        setTimeout(() => {
          navigate("/messages");
        }, 1500);
      }, 1000);
    }
  };

  // Renderizar campos específicos com base no tipo de destinatário selecionado
  const renderRecipientField = () => {
    if (!formData.recipientType) return null;
    
    switch (formData.recipientType.value) {
      case "person":
        return (
          <FormGroup>
            <Label for="recipient">Destinatário</Label>
            <Select
              id="recipient"
              name="recipient"
              value={formData.recipient}
              onChange={(option) => handleSelectChange(option, { name: "recipient" })}
              options={PEOPLE_OPTIONS}
              placeholder="Selecione uma pessoa..."
              isSearchable
              styles={customSelectStyles}
              className={errors.recipient ? "is-invalid" : ""}
            />
            {errors.recipient && (
              <FormFeedback className="d-block">{errors.recipient}</FormFeedback>
            )}
          </FormGroup>
        );
      
      case "class":
        return (
          <FormGroup>
            <Label for="recipient">Turma</Label>
            <Select
              id="recipient"
              name="recipient"
              value={formData.recipient}
              onChange={(option) => handleSelectChange(option, { name: "recipient" })}
              options={CLASS_OPTIONS}
              placeholder="Selecione uma turma..."
              isSearchable
              styles={customSelectStyles}
              className={errors.recipient ? "is-invalid" : ""}
            />
            {errors.recipient && (
              <FormFeedback className="d-block">{errors.recipient}</FormFeedback>
            )}
          </FormGroup>
        );
      
      default:
        // Para outros tipos de destinatários (todos os professores, toda a escola, etc.)
        // não é necessário um campo adicional
        return null;
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Breadcrumbs */}
          <Breadcrumbs title="Comunicação" breadcrumbItem="Nova Mensagem" />

          <Row>
            <Col lg={8}>
              <Card className="message-compose-card">
                <CardBody>
                  <div className="d-flex align-items-center mb-4">
                    <div className="message-compose-icon me-3">
                      <i className="mdi mdi-email-plus-outline font-size-24"></i>
                    </div>
                    <h4 className="card-title mb-0">Nova Mensagem</h4>
                  </div>

                  {loading ? (
                    <div className="text-center p-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Carregando...</span>
                      </div>
                      <p className="mt-3">Enviando mensagem, aguarde...</p>
                    </div>
                  ) : (
                    <Form onSubmit={handleSubmit}>
                      <FormGroup className="mb-4">
                        <Label for="recipientType" className="form-label-lg">Para</Label>
                        <Select
                          id="recipientType"
                          name="recipientType"
                          value={formData.recipientType}
                          onChange={(option) => handleSelectChange(option, { name: "recipientType" })}
                          options={RECIPIENT_TYPE_OPTIONS}
                          placeholder="Selecione o tipo de destinatário..."
                          styles={customSelectStyles}
                          className={errors.recipientType ? "is-invalid" : ""}
                        />
                        {errors.recipientType && (
                          <FormFeedback className="d-block">{errors.recipientType}</FormFeedback>
                        )}
                      </FormGroup>

                      {renderRecipientField()}

                      <FormGroup className="mb-4">
                        <Label for="priority" className="form-label-lg">Prioridade</Label>
                        <Select
                          id="priority"
                          name="priority"
                          value={formData.priority}
                          onChange={(option) => handleSelectChange(option, { name: "priority" })}
                          options={PRIORITY_OPTIONS}
                          styles={customSelectStyles}
                        />
                      </FormGroup>

                      <FormGroup className="mb-4">
                        <Label for="subject" className="form-label-lg">Assunto</Label>
                        <Input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="Digite o assunto da mensagem..."
                          className={errors.subject ? "is-invalid" : ""}
                        />
                        {errors.subject && (
                          <FormFeedback>{errors.subject}</FormFeedback>
                        )}
                      </FormGroup>

                      <FormGroup className="mb-4">
                        <Label for="content" className="form-label-lg">Mensagem</Label>
                        <Input
                          type="textarea"
                          id="content"
                          name="content"
                          value={formData.content}
                          onChange={handleInputChange}
                          placeholder="Digite sua mensagem aqui..."
                          rows="6"
                          className={errors.content ? "is-invalid" : ""}
                        />
                        {errors.content && (
                          <FormFeedback>{errors.content}</FormFeedback>
                        )}
                      </FormGroup>

                      <FormGroup className="mb-4">
                        <Label className="form-label-lg">Anexos</Label>
                        <div className="attachment-input">
                          <InputGroup>
                            <Input
                              type="file"
                              id="attachments"
                              multiple
                              onChange={handleFileChange}
                              hidden
                            />
                            <Button
                              color="light"
                              type="button"
                              onClick={() => document.getElementById("attachments").click()}
                              className="attachment-btn"
                            >
                              <i className="mdi mdi-paperclip me-1"></i> Anexar arquivos
                            </Button>
                            <span className="ms-2 text-muted">
                              {formData.attachments.length > 0 
                                ? `${formData.attachments.length} arquivo(s) selecionado(s)` 
                                : "Nenhum arquivo selecionado"}
                            </span>
                          </InputGroup>
                        </div>
                      </FormGroup>

                      {formData.attachments.length > 0 && (
                        <div className="attachment-list mb-4">
                          <div className="p-3 bg-light rounded">
                            <h6 className="mb-3">Arquivos anexados:</h6>
                            <div className="attachment-files">
                              {formData.attachments.map((file, index) => (
                                <div key={index} className="attachment-file-item">
                                  <div className="attachment-file-icon">
                                    <i className="mdi mdi-file-document-outline"></i>
                                  </div>
                                  <div className="attachment-file-info">
                                    <div className="attachment-file-name">{file.name}</div>
                                    <div className="attachment-file-size">
                                      {(file.size / 1024).toFixed(2)} KB
                                    </div>
                                  </div>
                                  <Button
                                    color="link"
                                    className="attachment-file-remove"
                                    onClick={() => removeAttachment(index)}
                                  >
                                    <i className="mdi mdi-close-circle"></i>
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="message-actions">
                        <Button
                          type="submit"
                          color="primary"
                          className="message-send-btn"
                          disabled={loading}
                        >
                          <i className="mdi mdi-send me-1"></i> Enviar Mensagem
                        </Button>
                        <Button
                          type="button"
                          color="light"
                          className="message-cancel-btn ms-2"
                          onClick={() => navigate("/messages")}
                        >
                          <i className="bx bx-arrow-left me-1"></i> Cancelar
                        </Button>
                      </div>
                    </Form>
                  )}
                </CardBody>
              </Card>
            </Col>

            <Col lg={4}>
              <Card className="message-tips-card">
                <CardBody>
                  <div className="d-flex align-items-center mb-4">
                    <div className="message-tips-icon me-3">
                      <i className="mdi mdi-lightbulb-outline font-size-24"></i>
                    </div>
                    <h4 className="card-title mb-0">Dicas</h4>
                  </div>
                  <div className="message-tips-list">
                    <div className="message-tip-item">
                      <div className="message-tip-icon">
                        <i className="mdi mdi-information-outline"></i>
                      </div>
                      <div className="message-tip-text">
                        Escreva assuntos claros e diretos para facilitar a identificação da mensagem.
                      </div>
                    </div>
                    <div className="message-tip-item">
                      <div className="message-tip-icon">
                        <i className="mdi mdi-information-outline"></i>
                      </div>
                      <div className="message-tip-text">
                        Seja objetivo e conciso no conteúdo da mensagem.
                      </div>
                    </div>
                    <div className="message-tip-item">
                      <div className="message-tip-icon">
                        <i className="mdi mdi-information-outline"></i>
                      </div>
                      <div className="message-tip-text">
                        Use a prioridade "Alta" apenas para mensagens realmente urgentes.
                      </div>
                    </div>
                    <div className="message-tip-item">
                      <div className="message-tip-icon">
                        <i className="mdi mdi-information-outline"></i>
                      </div>
                      <div className="message-tip-text">
                        Selecione cuidadosamente os destinatários para evitar envios desnecessários.
                      </div>
                    </div>
                    <div className="message-tip-item">
                      <div className="message-tip-icon">
                        <i className="mdi mdi-information-outline"></i>
                      </div>
                      <div className="message-tip-text">
                        Verifique os anexos antes de enviar para garantir que são os arquivos corretos.
                      </div>
                    </div>
                  </div>
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

export default CreateMessage;
