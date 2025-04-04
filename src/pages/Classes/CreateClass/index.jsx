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
import Breadcrumb from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { useClassManagement } from "../../../hooks/useClassManagement";
import CreatableSelect from "react-select/creatable";

const CreateClass = () => {
  const navigate = useNavigate();
  const {
    createClass,
    loading: creatingClass,
    error: createError,
  } = useClassManagement();

  const [formData, setFormData] = useState({
    className: "",
    series: "",
    identifier: "",
    period: "",
    startDate: "",
    endDate: "",
  });

  const seriesOptions = [
    { value: "1", label: "1º ano do fundamental" },
    { value: "2", label: "2º ano do fundamental" },
    { value: "3", label: "3º ano do fundamental" },
    { value: "4", label: "4º ano do fundamental" },
    { value: "5", label: "5º ano do fundamental" },
    { value: "6", label: "6º ano do fundamental" },
    { value: "7", label: "7º ano do fundamental" },
    { value: "8", label: "8º ano do fundamental" },
    { value: "9", label: "9º ano do fundamental" },
    { value: "10", label: "1º ano do médio" },
    { value: "11", label: "2º ano do médio" },
    { value: "12", label: "3º ano do médio" },
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
      const classData = {
        ...formData,
      };

      const response = await createClass(classData);
      console.log("Turma criada com sucesso:", response);
      alert("Turma criada com sucesso!");
      navigate("/classes");
    } catch (err) {
      console.error("Erro ao criar turma:", err);
      alert("Erro ao criar turma: " + err.message);
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb title="Criar Turma" breadcrumbItem="Nova Turma" />

        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={4}>
                      <FormGroup>
                        <Label>Série</Label>
                        <CreatableSelect
                          name="series"
                          value={formData.series}
                          onChange={(option) =>
                            handleSelectChange(option, { name: "series" })
                          }
                          formatCreateLabel={(inputValue) =>
                            `Criar "${inputValue}"`
                          }
                          getNewOptionData={(inputValue, optionLabel) => ({
                            value: inputValue,
                            label: optionLabel,
                          })}
                          options={seriesOptions}
                          placeholder="Selecione ou digite a série"
                          isClearable
                        />
                      </FormGroup>
                    </Col>

                    <Col md={4}>
                      <FormGroup>
                        <Label>Turma</Label>
                        <CreatableSelect
                          name="identifier"
                          value={formData.identifier}
                          onChange={(option) =>
                            handleSelectChange(option, { name: "identifier" })
                          }
                          formatCreateLabel={(inputValue) =>
                            `Criar "${inputValue}"`
                          }
                          getNewOptionData={(inputValue, optionLabel) => ({
                            value: inputValue,
                            label: optionLabel,
                          })}
                          options={[
                            { value: "A", label: "A" },
                            { value: "B", label: "B" },
                            { value: "C", label: "C" },
                          ]}
                          placeholder="Selecione ou digite a turma"
                          isClearable
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col md={4}>
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
                    <Col md={4}>
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
                    <Col md={4}>
                      <FormGroup>
                        <Label>Período</Label>
                        <Input
                          type="select"
                          name="period"
                          value={formData.period}
                          onChange={handleInputChange}
                        >
                          <option value="">Selecione o período</option>
                          <option value="Manhã">Manhã</option>
                          <option value="Tarde">Tarde</option>
                          <option value="Noite">Noite</option>
                        </Input>
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
                          {creatingClass ? "Criando..." : "Criar Turma"}
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

export default CreateClass;
