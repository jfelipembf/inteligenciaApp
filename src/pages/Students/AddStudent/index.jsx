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
import { useNavigate } from "react-router-dom";
import InputMask from "react-input-mask";
import Breadcrumbs from "../../../components/Common/Breadcrumb";

const AddStudent = () => {
  const navigate = useNavigate();
  
  // Estado para armazenar as séries e turmas
  const [series, setSeries] = useState([
    { id: 1, name: "1º Ano - Ensino Fundamental" },
    { id: 2, name: "2º Ano - Ensino Fundamental" },
    { id: 3, name: "3º Ano - Ensino Fundamental" },
    // Adicionar mais séries conforme necessário
  ]);

  const [turmas, setTurmas] = useState([
    { id: 1, name: "Turma A", serieId: 1 },
    { id: 2, name: "Turma B", serieId: 1 },
    { id: 3, name: "Turma A", serieId: 2 },
    { id: 4, name: "Turma B", serieId: 2 },
    // Adicionar mais turmas conforme necessário
  ]);

  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    email: "",
    telefone: "",
    dataNascimento: "",
    cpf: "",
    matricula: "",
    serie: "",
    turma: "",
    endereco: "",
    cep: "",
    responsavelNome: "",
    responsavelEmail: "",
    responsavelTelefone: "",
    responsavelCpf: "",
  });

  // Estado para armazenar as turmas filtradas baseado na série selecionada
  const [turmasFiltradas, setTurmasFiltradas] = useState([]);

  // Efeito para filtrar turmas quando a série é selecionada
  useEffect(() => {
    if (formData.serie) {
      const turmasDaSerie = turmas.filter(
        (turma) => turma.serieId === parseInt(formData.serie)
      );
      setTurmasFiltradas(turmasDaSerie);
      // Limpa a turma selecionada se não estiver disponível na nova série
      if (!turmasDaSerie.find(t => t.id === parseInt(formData.turma))) {
        setFormData(prev => ({ ...prev, turma: "" }));
      }
    } else {
      setTurmasFiltradas([]);
      setFormData(prev => ({ ...prev, turma: "" }));
    }
  }, [formData.serie, turmas]);

  // Função para lidar com mudanças nos campos do formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica para enviar os dados para a API
    console.log("Dados do formulário:", formData);
    // Após salvar, redirecionar para a lista de alunos
    navigate("/students");
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="Alunos" breadcrumbItem="Novo Aluno" />

        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <h4 className="card-title mb-4">Cadastro de Novo Aluno</h4>

                <Form onSubmit={handleSubmit}>
                  {/* Dados do Aluno */}
                  <h5 className="mb-3">Dados do Aluno</h5>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="nomeCompleto">Nome Completo</Label>
                        <Input
                          type="text"
                          name="nomeCompleto"
                          id="nomeCompleto"
                          value={formData.nomeCompleto}
                          onChange={handleInputChange}
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="email">E-mail</Label>
                        <Input
                          type="email"
                          name="email"
                          id="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="telefone">Telefone</Label>
                        <InputMask
                          mask="(99) 99999-9999"
                          value={formData.telefone}
                          onChange={handleInputChange}
                        >
                          {(inputProps) => (
                            <Input
                              {...inputProps}
                              type="text"
                              name="telefone"
                              id="telefone"
                              required
                            />
                          )}
                        </InputMask>
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="dataNascimento">Data de Nascimento</Label>
                        <Input
                          type="date"
                          name="dataNascimento"
                          id="dataNascimento"
                          value={formData.dataNascimento}
                          onChange={handleInputChange}
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="cpf">CPF</Label>
                        <InputMask
                          mask="999.999.999-99"
                          value={formData.cpf}
                          onChange={handleInputChange}
                        >
                          {(inputProps) => (
                            <Input
                              {...inputProps}
                              type="text"
                              name="cpf"
                              id="cpf"
                              required
                            />
                          )}
                        </InputMask>
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="matricula">Matrícula</Label>
                        <Input
                          type="text"
                          name="matricula"
                          id="matricula"
                          value={formData.matricula}
                          onChange={handleInputChange}
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="serie">Série</Label>
                        <Input
                          type="select"
                          name="serie"
                          id="serie"
                          value={formData.serie}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Selecione a série</option>
                          {series.map((serie) => (
                            <option key={serie.id} value={serie.id}>
                              {serie.name}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="turma">Turma</Label>
                        <Input
                          type="select"
                          name="turma"
                          id="turma"
                          value={formData.turma}
                          onChange={handleInputChange}
                          disabled={!formData.serie}
                          required
                        >
                          <option value="">Selecione a turma</option>
                          {turmasFiltradas.map((turma) => (
                            <option key={turma.id} value={turma.id}>
                              {turma.name}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={8}>
                      <FormGroup>
                        <Label for="endereco">Endereço</Label>
                        <Input
                          type="text"
                          name="endereco"
                          id="endereco"
                          value={formData.endereco}
                          onChange={handleInputChange}
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="cep">CEP</Label>
                        <InputMask
                          mask="99999-999"
                          value={formData.cep}
                          onChange={handleInputChange}
                        >
                          {(inputProps) => (
                            <Input
                              {...inputProps}
                              type="text"
                              name="cep"
                              id="cep"
                              required
                            />
                          )}
                        </InputMask>
                      </FormGroup>
                    </Col>
                  </Row>

                  {/* Dados do Responsável */}
                  <h5 className="mb-3 mt-4">Dados do Responsável</h5>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="responsavelNome">Nome do Responsável</Label>
                        <Input
                          type="text"
                          name="responsavelNome"
                          id="responsavelNome"
                          value={formData.responsavelNome}
                          onChange={handleInputChange}
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="responsavelEmail">E-mail do Responsável</Label>
                        <Input
                          type="email"
                          name="responsavelEmail"
                          id="responsavelEmail"
                          value={formData.responsavelEmail}
                          onChange={handleInputChange}
                          required
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="responsavelTelefone">Telefone do Responsável</Label>
                        <InputMask
                          mask="(99) 99999-9999"
                          value={formData.responsavelTelefone}
                          onChange={handleInputChange}
                        >
                          {(inputProps) => (
                            <Input
                              {...inputProps}
                              type="text"
                              name="responsavelTelefone"
                              id="responsavelTelefone"
                              required
                            />
                          )}
                        </InputMask>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="responsavelCpf">CPF do Responsável</Label>
                        <InputMask
                          mask="999.999.999-99"
                          value={formData.responsavelCpf}
                          onChange={handleInputChange}
                        >
                          {(inputProps) => (
                            <Input
                              {...inputProps}
                              type="text"
                              name="responsavelCpf"
                              id="responsavelCpf"
                              required
                            />
                          )}
                        </InputMask>
                      </FormGroup>
                    </Col>
                  </Row>

                  <div className="d-flex justify-content-end mt-4">
                    <Button
                      type="button"
                      color="secondary"
                      className="me-2"
                      onClick={() => navigate("/students")}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" color="primary">
                      Salvar
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AddStudent;
