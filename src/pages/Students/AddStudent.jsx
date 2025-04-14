import React, { useState } from "react";
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
  Spinner,
  FormFeedback,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/Common/Breadcrumb";
import InputMask from "react-input-mask";
import ImageUploader from "../../components/Common/ImageUploader";
import { useUserManagement } from "../../hooks/useUserManagement";
import Layout from "../../components/VerticalLayout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Formik validation
import { useFormik } from "formik";
// Importando esquema de validação e valores iniciais
import { studentValidationSchema, studentInitialValues } from "./validationSchemas";
// Importando constantes
import { 
  GENDER_OPTIONS, 
  RELATIONSHIP_OPTIONS, 
  BRAZILIAN_STATES,
  PRESCHOOL_YEARS,
  ELEMENTARY_SCHOOL_YEARS,
  HIGH_SCHOOL_YEARS
} from "../../constants";

const AddStudent = () => {
  const navigate = useNavigate();
  const { createUser, loading, error } = useUserManagement();
  const [profileImage, setProfileImage] = useState(null);

  // Função para buscar CEP
  const searchCep = async (cep) => {
    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cep.replace(/\D/g, "")}/json/`
      );
      const data = await response.json();
      if (!data.erro) {
        validation.setFieldValue("street", data.logradouro);
        validation.setFieldValue("neighborhood", data.bairro);
        validation.setFieldValue("city", data.localidade);
        validation.setFieldValue("state", data.uf);
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    }
  };

  // Form validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: studentInitialValues,
    validationSchema: studentValidationSchema,
    onSubmit: async (values) => {
      try {
        const userData = {
          personalInfo: {
            name: values.fullName,
            phone: values.phone,
            birthDate: values.birthDate,
            gender: values.gender,
            cpf: values.cpf,
          },
          academicInfo: {
            registration: values.registration,
            classId: values.classId,
          },
          address: {
            cep: values.cep,
            street: values.street,
            number: values.number,
            complement: values.complement,
            neighborhood: values.neighborhood,
            city: values.city,
            state: values.state,
          },
          guardian: {
            name: values.guardianName,
            cpf: values.guardianCpf,
            email: values.guardianEmail,
            phone: values.guardianPhone,
            relationship: values.guardianRelationship,
          },
        };

        await createUser({
          email: values.email,
          password: values.password,
          userData,
          profileImage,
          role: "aluno",
        });

        toast.success("Aluno cadastrado com sucesso!", { 
          autoClose: 3000,
          position: "top-right",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        // Navegar para a lista de alunos após um breve atraso
        setTimeout(() => {
          navigate("/students");
        }, 1500);
      } catch (err) {
        toast.error(`Erro ao criar aluno: ${err.message}`, { 
          autoClose: 5000,
          position: "top-right",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  });

  // Handler para CEP com busca automática
  const handleCepBlur = (e) => {
    const cep = e.target.value.replace(/\D/g, "");
    if (cep.length === 8) {
      searchCep(cep);
    }
  };

  return (
    <Layout>
      <div className="page-content">
        <Container fluid>
          <ToastContainer />
          <Breadcrumb title="Alunos" breadcrumbItem="Novo Aluno" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <h4 className="card-title mb-4">Cadastro de Novo Aluno</h4>
                  <Form onSubmit={validation.handleSubmit}>
                    <FormGroup className="mb-4">
                      <Label>Foto de Perfil</Label>
                      <div className="d-flex align-items-center">
                        <ImageUploader
                          image={profileImage}
                          onImageChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setProfileImage(file);
                            }
                          }}
                        />
                      </div>
                    </FormGroup>

                    <h5 className="font-size-14 mb-3">Dados do Aluno</h5>
                    <Row>
                      <Col md={6}>
                        <FormGroup className="mb-3">
                          <Label>Nome Completo</Label>
                          <Input
                            name="fullName"
                            placeholder="Digite o nome completo"
                            type="text"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.fullName || ""}
                            invalid={
                              validation.touched.fullName && validation.errors.fullName ? true : false
                            }
                          />
                          {validation.touched.fullName && validation.errors.fullName ? (
                            <FormFeedback type="invalid">{validation.errors.fullName}</FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup className="mb-3">
                          <Label>Email</Label>
                          <Input
                            name="email"
                            placeholder="Digite o email"
                            type="email"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.email || ""}
                            invalid={
                              validation.touched.email && validation.errors.email ? true : false
                            }
                          />
                          {validation.touched.email && validation.errors.email ? (
                            <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup className="mb-3">
                          <Label>CPF</Label>
                          <InputMask
                            mask="999.999.999-99"
                            value={validation.values.cpf || ""}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                          >
                            {(inputProps) => (
                              <Input
                                {...inputProps}
                                type="text"
                                name="cpf"
                                placeholder="000.000.000-00"
                                invalid={
                                  validation.touched.cpf && validation.errors.cpf ? true : false
                                }
                              />
                            )}
                          </InputMask>
                          {validation.touched.cpf && validation.errors.cpf ? (
                            <FormFeedback type="invalid">{validation.errors.cpf}</FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup className="mb-3">
                          <Label>Telefone</Label>
                          <InputMask
                            mask="(99) 99999-9999"
                            value={validation.values.phone || ""}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                          >
                            {(inputProps) => (
                              <Input
                                {...inputProps}
                                type="text"
                                name="phone"
                                placeholder="(00) 00000-0000"
                                invalid={
                                  validation.touched.phone && validation.errors.phone ? true : false
                                }
                              />
                            )}
                          </InputMask>
                          {validation.touched.phone && validation.errors.phone ? (
                            <FormFeedback type="invalid">{validation.errors.phone}</FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup className="mb-3">
                          <Label>Data de Nascimento</Label>
                          <InputMask
                            mask="99/99/9999"
                            value={validation.values.birthDate || ""}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            placeholder="DD/MM/AAAA"
                          >
                            {(inputProps) => (
                              <Input
                                {...inputProps}
                                type="text"
                                name="birthDate"
                                invalid={
                                  validation.touched.birthDate && validation.errors.birthDate ? true : false
                                }
                              />
                            )}
                          </InputMask>
                          {validation.touched.birthDate && validation.errors.birthDate ? (
                            <FormFeedback type="invalid">{validation.errors.birthDate}</FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup className="mb-3">
                          <Label>Matrícula</Label>
                          <Input
                            name="registration"
                            placeholder="Digite a matrícula"
                            type="text"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.registration || ""}
                            invalid={
                              validation.touched.registration && validation.errors.registration ? true : false
                            }
                          />
                          {validation.touched.registration && validation.errors.registration ? (
                            <FormFeedback type="invalid">{validation.errors.registration}</FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>

                      <Col md={4}>
                        <FormGroup className="mb-3">
                          <Label for="gender">Sexo</Label>
                          <Input
                            name="gender"
                            type="select"
                            className="form-control"
                            id="gender"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.gender || ""}
                            invalid={
                              validation.touched.gender && validation.errors.gender
                                ? true
                                : false
                            }
                          >
                            <option value="">Selecione o sexo</option>
                            {GENDER_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </Input>
                          {validation.touched.gender && validation.errors.gender ? (
                            <FormFeedback type="invalid">
                              {validation.errors.gender}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>

                    <h5 className="font-size-14 mb-3 mt-4">Endereço</h5>
                    <Row>
                      <Col md={3}>
                        <FormGroup className="mb-3">
                          <Label>CEP</Label>
                          <InputMask
                            mask="99999-999"
                            value={validation.values.cep || ""}
                            onChange={validation.handleChange}
                            onBlur={(e) => {
                              validation.handleBlur(e);
                              handleCepBlur(e);
                            }}
                          >
                            {(inputProps) => (
                              <Input
                                {...inputProps}
                                type="text"
                                name="cep"
                                placeholder="00000-000"
                                invalid={
                                  validation.touched.cep && validation.errors.cep ? true : false
                                }
                              />
                            )}
                          </InputMask>
                          {validation.touched.cep && validation.errors.cep ? (
                            <FormFeedback type="invalid">{validation.errors.cep}</FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md={7}>
                        <FormGroup className="mb-3">
                          <Label>Rua</Label>
                          <Input
                            name="street"
                            placeholder="Digite a rua"
                            type="text"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.street || ""}
                            invalid={
                              validation.touched.street && validation.errors.street ? true : false
                            }
                          />
                          {validation.touched.street && validation.errors.street ? (
                            <FormFeedback type="invalid">{validation.errors.street}</FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md={2}>
                        <FormGroup className="mb-3">
                          <Label>Número</Label>
                          <Input
                            name="number"
                            placeholder="Digite o número"
                            type="text"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.number || ""}
                            invalid={
                              validation.touched.number && validation.errors.number ? true : false
                            }
                          />
                          {validation.touched.number && validation.errors.number ? (
                            <FormFeedback type="invalid">{validation.errors.number}</FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup className="mb-3">
                          <Label>Complemento</Label>
                          <Input
                            name="complement"
                            placeholder="Digite o complemento"
                            type="text"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.complement || ""}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup className="mb-3">
                          <Label>Bairro</Label>
                          <Input
                            name="neighborhood"
                            placeholder="Digite o bairro"
                            type="text"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.neighborhood || ""}
                            invalid={
                              validation.touched.neighborhood && validation.errors.neighborhood ? true : false
                            }
                          />
                          {validation.touched.neighborhood && validation.errors.neighborhood ? (
                            <FormFeedback type="invalid">{validation.errors.neighborhood}</FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md={2}>
                        <FormGroup className="mb-3">
                          <Label for="state">Estado</Label>
                          <Input
                            name="state"
                            type="select"
                            className="form-control"
                            id="state"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.state || ""}
                            invalid={
                              validation.touched.state && validation.errors.state
                                ? true
                                : false
                            }
                          >
                            <option value="">Selecione o estado</option>
                            {BRAZILIAN_STATES.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </Input>
                          {validation.touched.state && validation.errors.state ? (
                            <FormFeedback type="invalid">
                              {validation.errors.state}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md={2}>
                        <FormGroup className="mb-3">
                          <Label>Cidade</Label>
                          <Input
                            name="city"
                            placeholder="Digite a cidade"
                            type="text"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.city || ""}
                            invalid={
                              validation.touched.city && validation.errors.city ? true : false
                            }
                          />
                          {validation.touched.city && validation.errors.city ? (
                            <FormFeedback type="invalid">{validation.errors.city}</FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>

                    <h5 className="font-size-14 mb-3 mt-4">
                      Dados do Responsável
                    </h5>
                    <Row>
                      <Col md={6}>
                        <FormGroup className="mb-3">
                          <Label>Nome do Responsável</Label>
                          <Input
                            name="guardianName"
                            placeholder="Digite o nome do responsável"
                            type="text"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.guardianName || ""}
                            invalid={
                              validation.touched.guardianName && validation.errors.guardianName ? true : false
                            }
                          />
                          {validation.touched.guardianName && validation.errors.guardianName ? (
                            <FormFeedback type="invalid">{validation.errors.guardianName}</FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup className="mb-3">
                          <Label>Email do Responsável</Label>
                          <Input
                            name="guardianEmail"
                            placeholder="Digite o email do responsável"
                            type="email"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.guardianEmail || ""}
                            invalid={
                              validation.touched.guardianEmail && validation.errors.guardianEmail ? true : false
                            }
                          />
                          {validation.touched.guardianEmail && validation.errors.guardianEmail ? (
                            <FormFeedback type="invalid">{validation.errors.guardianEmail}</FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup className="mb-3">
                          <Label>CPF do Responsável</Label>
                          <InputMask
                            mask="999.999.999-99"
                            value={validation.values.guardianCpf || ""}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                          >
                            {(inputProps) => (
                              <Input
                                {...inputProps}
                                type="text"
                                name="guardianCpf"
                                placeholder="000.000.000-00"
                                invalid={
                                  validation.touched.guardianCpf && validation.errors.guardianCpf ? true : false
                                }
                              />
                            )}
                          </InputMask>
                          {validation.touched.guardianCpf && validation.errors.guardianCpf ? (
                            <FormFeedback type="invalid">{validation.errors.guardianCpf}</FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup className="mb-3">
                          <Label>Telefone do Responsável</Label>
                          <InputMask
                            mask="(99) 99999-9999"
                            value={validation.values.guardianPhone || ""}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                          >
                            {(inputProps) => (
                              <Input
                                {...inputProps}
                                type="text"
                                name="guardianPhone"
                                placeholder="(00) 00000-0000"
                                invalid={
                                  validation.touched.guardianPhone && validation.errors.guardianPhone ? true : false
                                }
                              />
                            )}
                          </InputMask>
                          {validation.touched.guardianPhone && validation.errors.guardianPhone ? (
                            <FormFeedback type="invalid">{validation.errors.guardianPhone}</FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup className="mb-3">
                          <Label for="guardianRelationship">Parentesco</Label>
                          <Input
                            name="guardianRelationship"
                            type="select"
                            className="form-control"
                            id="guardianRelationship"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.guardianRelationship || ""}
                            invalid={
                              validation.touched.guardianRelationship && validation.errors.guardianRelationship
                                ? true
                                : false
                            }
                          >
                            <option value="">Selecione o parentesco</option>
                            {RELATIONSHIP_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </Input>
                          {validation.touched.guardianRelationship && validation.errors.guardianRelationship ? (
                            <FormFeedback type="invalid">
                              {validation.errors.guardianRelationship}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>

                    <h5 className="font-size-14 mb-3 mt-4">Dados de Acesso</h5>
                    <Row>
                      <Col md={6}>
                        <FormGroup className="mb-3">
                          <Label>Senha</Label>
                          <Input
                            name="password"
                            placeholder="Digite a senha"
                            type="password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.password || ""}
                            invalid={
                              validation.touched.password && validation.errors.password ? true : false
                            }
                          />
                          {validation.touched.password && validation.errors.password ? (
                            <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup className="mb-3">
                          <Label>Confirmar Senha</Label>
                          <Input
                            name="confirmPassword"
                            placeholder="Digite a confirmação da senha"
                            type="password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.confirmPassword || ""}
                            invalid={
                              validation.touched.confirmPassword && validation.errors.confirmPassword ? true : false
                            }
                          />
                          {validation.touched.confirmPassword && validation.errors.confirmPassword ? (
                            <FormFeedback type="invalid">{validation.errors.confirmPassword}</FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>

                    <h5 className="font-size-14 mb-3 mt-4">Dados Acadêmicos</h5>
                    <Row>
                      <Col md={6}>
                        <FormGroup className="mb-3">
                          <Label for="classId">Ano Escolar</Label>
                          <Input
                            name="classId"
                            type="select"
                            className="form-control"
                            id="classId"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.classId || ""}
                          >
                            <option value="">Selecione o ano escolar</option>
                            <optgroup label="Educação Infantil">
                              {PRESCHOOL_YEARS.map((year, index) => (
                                <option key={`ei-${index}`} value={year}>
                                  {year}
                                </option>
                              ))}
                            </optgroup>
                            <optgroup label="Ensino Fundamental">
                              {ELEMENTARY_SCHOOL_YEARS.map((year, index) => (
                                <option key={`ef-${index}`} value={year}>
                                  {year}
                                </option>
                              ))}
                            </optgroup>
                            <optgroup label="Ensino Médio">
                              {HIGH_SCHOOL_YEARS.map((year, index) => (
                                <option key={`em-${index}`} value={year}>
                                  {year}
                                </option>
                              ))}
                            </optgroup>
                          </Input>
                        </FormGroup>
                      </Col>
                    </Row>

                    <div className="d-flex flex-wrap gap-2">
                      <Button type="submit" color="primary" disabled={loading}>
                        {loading ? (
                          <>
                            <Spinner size="sm" className="me-2" />
                            Salvando...
                          </>
                        ) : (
                          "Salvar"
                        )}
                      </Button>
                      <Button
                        type="button"
                        color="secondary"
                        onClick={() => navigate("/students")}
                        disabled={loading}
                      >
                        Cancelar
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
    </Layout>
  );
};

export default AddStudent;
