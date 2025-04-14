import React, { useState, useEffect, useRef } from "react";
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
  FormFeedback,
} from "reactstrap";
import Select from "react-select";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { useClassManagement } from "../../../hooks/useClassManagement";
import CreatableSelect from "react-select/creatable";
import InputMask from "react-input-mask";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Importando constantes
import {
  PRESCHOOL_YEARS,
  ELEMENTARY_SCHOOL_YEARS,
  HIGH_SCHOOL_YEARS,
  EDUCATION_LEVELS,
  YEAR_TO_LEVEL_MAP
} from "../../../constants";

const CreateClass = () => {
  // Refs para os componentes Select
  const educationLevelRef = useRef(null);
  const seriesRef = useRef(null);
  const identifierRef = useRef(null);
  const periodRef = useRef(null);
  
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
    educationLevel: "",
  });

  // Estado para controlar validação
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Convertendo os anos escolares para o formato do react-select
  const preschoolOptions = PRESCHOOL_YEARS.map(year => ({ 
    value: year, 
    label: year 
  }));
  
  const elementaryOptions = ELEMENTARY_SCHOOL_YEARS.map(year => ({ 
    value: year, 
    label: year 
  }));
  
  const highSchoolOptions = HIGH_SCHOOL_YEARS.map(year => ({ 
    value: year, 
    label: year 
  }));

  // Opções para o nível de ensino
  const educationLevelOptions = EDUCATION_LEVELS.map(level => ({
    value: level,
    label: level
  }));

  // Opções para o período
  const periodOptions = [
    { value: "Manhã", label: "Manhã" },
    { value: "Tarde", label: "Tarde" },
    { value: "Noite", label: "Noite" },
    { value: "Integral", label: "Integral" },
  ];

  // Função para filtrar as séries com base no nível de ensino selecionado
  const getFilteredSeriesOptions = () => {
    if (!formData.educationLevel) {
      // Se nenhum nível de ensino estiver selecionado, retorna todas as opções agrupadas
      return [
        {
          label: "Educação Infantil",
          options: preschoolOptions
        },
        {
          label: "Ensino Fundamental",
          options: elementaryOptions
        },
        {
          label: "Ensino Médio",
          options: highSchoolOptions
        }
      ];
    }

    const selectedLevel = formData.educationLevel.value;
    
    // Filtra as séries com base no nível selecionado
    if (selectedLevel === "Educação Infantil") {
      return [{ label: "Educação Infantil", options: preschoolOptions }];
    } else if (selectedLevel === "Ensino Fundamental I" || selectedLevel === "Ensino Fundamental II") {
      // Filtra apenas os anos do ensino fundamental que correspondem ao nível selecionado
      const filteredOptions = elementaryOptions.filter(option => 
        YEAR_TO_LEVEL_MAP[option.value] === selectedLevel
      );
      return [{ label: selectedLevel, options: filteredOptions }];
    } else if (selectedLevel === "Ensino Médio") {
      return [{ label: "Ensino Médio", options: highSchoolOptions }];
    }
    
    // Caso padrão, retorna todas as opções
    return [
      {
        label: "Educação Infantil",
        options: preschoolOptions
      },
      {
        label: "Ensino Fundamental",
        options: elementaryOptions
      },
      {
        label: "Ensino Médio",
        options: highSchoolOptions
      }
    ];
  };

  // Limpa a série selecionada quando o nível de ensino muda
  useEffect(() => {
    if (formData.series && formData.educationLevel) {
      const seriesLevel = YEAR_TO_LEVEL_MAP[formData.series.value];
      if (seriesLevel !== formData.educationLevel.value) {
        setFormData(prev => ({
          ...prev,
          series: ""
        }));
      }
    }
  }, [formData.educationLevel]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Marca o campo como tocado
    if (!touched[name]) {
      setTouched(prev => ({
        ...prev,
        [name]: true
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    validateField(name, formData[name]);
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };
    
    // Validação básica
    if (!value && name !== 'complement' && name !== 'endDate') {
      newErrors[name] = "Este campo é obrigatório";
    } else {
      delete newErrors[name];
    }
    
    setErrors(newErrors);
  };

  const handleSelectChange = (selectedOption, { name }) => {
    setFormData((prev) => ({
      ...prev,
      [name]: selectedOption,
    }));
    
    // Marca o campo como tocado
    if (!touched[name]) {
      setTouched(prev => ({
        ...prev,
        [name]: true
      }));
    }
    
    // Valida o campo
    validateField(name, selectedOption);
  };

  const handleSelectBlur = (name) => {
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    validateField(name, formData[name]);
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['educationLevel', 'series', 'identifier', 'period', 'startDate'];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = "Este campo é obrigatório";
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Marca todos os campos como tocados
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
    
    // Valida o formulário antes de enviar
    if (!validateForm()) {
      return;
    }

    try {
      const classData = {
        ...formData,
      };

      const response = await createClass(classData);
      
      toast.success("Turma criada com sucesso!", { 
        autoClose: 3000,
        position: "top-right",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Navegar para a lista de turmas após um breve atraso
      setTimeout(() => {
        navigate("/classes");
      }, 1500);
    } catch (err) {
      console.error("Erro ao criar turma:", err);
      
      toast.error(`Erro ao criar turma: ${err.message}`, {
        autoClose: 5000,
        position: "top-right",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Configuração de estilos para os componentes Select
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? '#556ee6' : '#ced4da',
      boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(85, 110, 230, 0.25)' : 'none',
      '&:hover': {
        borderColor: state.isFocused ? '#556ee6' : '#ced4da',
      },
    }),
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb title="Criar Turma" breadcrumbItem="Nova Turma" />
        <ToastContainer />

        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={4}>
                      <FormGroup className="mb-3">
                        <Label>Nível de Ensino</Label>
                        <Select
                          ref={educationLevelRef}
                          name="educationLevel"
                          value={formData.educationLevel}
                          onChange={(option) =>
                            handleSelectChange(option, { name: "educationLevel" })
                          }
                          onBlur={() => handleSelectBlur("educationLevel")}
                          options={educationLevelOptions}
                          placeholder="Selecione o nível de ensino"
                          isClearable
                          className={touched.educationLevel && errors.educationLevel ? "is-invalid" : ""}
                          classNamePrefix="select"
                          styles={selectStyles}
                        />
                        {touched.educationLevel && errors.educationLevel && (
                          <div className="invalid-feedback d-block">
                            {errors.educationLevel}
                          </div>
                        )}
                      </FormGroup>
                    </Col>
                    
                    <Col md={4}>
                      <FormGroup className="mb-3">
                        <Label>Série/Ano</Label>
                        <Select
                          ref={seriesRef}
                          name="series"
                          value={formData.series}
                          onChange={(option) =>
                            handleSelectChange(option, { name: "series" })
                          }
                          onBlur={() => handleSelectBlur("series")}
                          options={getFilteredSeriesOptions()}
                          placeholder="Selecione a série/ano"
                          isClearable
                          isDisabled={!formData.educationLevel}
                          className={touched.series && errors.series ? "is-invalid" : ""}
                          classNamePrefix="select"
                          styles={selectStyles}
                        />
                        {!formData.educationLevel && (
                          <small className="text-muted">
                            Selecione primeiro o nível de ensino
                          </small>
                        )}
                        {touched.series && errors.series && (
                          <div className="invalid-feedback d-block">
                            {errors.series}
                          </div>
                        )}
                      </FormGroup>
                    </Col>

                    <Col md={4}>
                      <FormGroup className="mb-3">
                        <Label>Turma</Label>
                        <CreatableSelect
                          ref={identifierRef}
                          name="identifier"
                          value={formData.identifier}
                          onChange={(option) =>
                            handleSelectChange(option, { name: "identifier" })
                          }
                          onBlur={() => handleSelectBlur("identifier")}
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
                            { value: "D", label: "D" },
                            { value: "E", label: "E" },
                          ]}
                          placeholder="Selecione ou digite a turma"
                          isClearable
                          className={touched.identifier && errors.identifier ? "is-invalid" : ""}
                          classNamePrefix="select"
                          styles={selectStyles}
                        />
                        {touched.identifier && errors.identifier && (
                          <div className="invalid-feedback d-block">
                            {errors.identifier}
                          </div>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col md={4}>
                      <FormGroup className="mb-3">
                        <Label>Data de Início</Label>
                        <InputMask
                          mask="99/99/9999"
                          value={formData.startDate || ""}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          placeholder="DD/MM/AAAA"
                        >
                          {(inputProps) => (
                            <Input
                              {...inputProps}
                              type="text"
                              name="startDate"
                              className="form-control"
                              invalid={touched.startDate && errors.startDate ? true : false}
                            />
                          )}
                        </InputMask>
                        {touched.startDate && errors.startDate && (
                          <FormFeedback>{errors.startDate}</FormFeedback>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup className="mb-3">
                        <Label>Data de Término <small className="text-muted">(opcional)</small></Label>
                        <InputMask
                          mask="99/99/9999"
                          value={formData.endDate || ""}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          placeholder="DD/MM/AAAA"
                        >
                          {(inputProps) => (
                            <Input
                              {...inputProps}
                              type="text"
                              name="endDate"
                              className="form-control"
                              invalid={touched.endDate && errors.endDate ? true : false}
                            />
                          )}
                        </InputMask>
                        {touched.endDate && errors.endDate && (
                          <FormFeedback>{errors.endDate}</FormFeedback>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup className="mb-3">
                        <Label>Período</Label>
                        <Select
                          ref={periodRef}
                          name="period"
                          value={formData.period}
                          onChange={(option) =>
                            handleSelectChange(option, { name: "period" })
                          }
                          onBlur={() => handleSelectBlur("period")}
                          options={periodOptions}
                          placeholder="Selecione o período"
                          isClearable
                          className={touched.period && errors.period ? "is-invalid" : ""}
                          classNamePrefix="select"
                          styles={selectStyles}
                        />
                        {touched.period && errors.period && (
                          <div className="invalid-feedback d-block">
                            {errors.period}
                          </div>
                        )}
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
