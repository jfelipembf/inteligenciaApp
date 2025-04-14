import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
  FormText
} from "reactstrap";
import { toast } from "react-toastify";

const SAMPLE_ACADEMIC_SETTINGS = {
  passingGrade: 7.0,
  recoveryThreshold: 5.0,
  maxAttendanceAbsence: 25,
  gradingSystem: "numeric", // numeric ou conceptual
  roundGrades: true,
  showDecimal: true
};

const AcademicSettings = ({ isEditing }) => {
  const [academicSettings, setAcademicSettings] = useState(SAMPLE_ACADEMIC_SETTINGS);
  const [formData, setFormData] = useState(SAMPLE_ACADEMIC_SETTINGS);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Quando isEditing mudar, atualize o estado showForm
    setShowForm(isEditing);
  }, [isEditing]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : 
              (name === "passingGrade" || name === "recoveryThreshold") ? parseFloat(value) :
              name === "maxAttendanceAbsence" ? parseInt(value) : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    setAcademicSettings(formData);
    setShowForm(false);
    toast.success("Configurações acadêmicas atualizadas com sucesso!");
  };

  const handleCancel = () => {
    setFormData({ ...academicSettings });
    setShowForm(false);
  };

  return (
    <Card>
      <CardBody>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="card-title mb-0">Configurações Acadêmicas</h5>
          {isEditing && !showForm && (
            <Button color="primary" size="sm" onClick={() => setShowForm(true)}>
              <i className="mdi mdi-pencil-outline me-1"></i> Editar Configurações
            </Button>
          )}
        </div>

        {!showForm ? (
          <Row>
            <Col md={6}>
              <Card className="border mb-3">
                <CardBody>
                  <h6 className="mb-3">Média e Aprovação</h6>
                  <div className="mb-2">
                    <strong>Média para Aprovação:</strong> {academicSettings.passingGrade.toFixed(1)}
                  </div>
                  <div className="mb-2">
                    <strong>Média para Recuperação:</strong> {academicSettings.recoveryThreshold.toFixed(1)}
                  </div>
                  <div className="mb-2">
                    <strong>Limite de Faltas:</strong> {academicSettings.maxAttendanceAbsence}%
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="border mb-3">
                <CardBody>
                  <h6 className="mb-3">Sistema de Notas</h6>
                  <div className="mb-2">
                    <strong>Tipo de Avaliação:</strong> {academicSettings.gradingSystem === "numeric" ? "Numérica" : "Conceitual"}
                  </div>
                  <div className="mb-2">
                    <strong>Arredondamento:</strong> {academicSettings.roundGrades ? "Sim" : "Não"}
                  </div>
                  <div className="mb-2">
                    <strong>Mostrar Casas Decimais:</strong> {academicSettings.showDecimal ? "Sim" : "Não"}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Card className="border mb-4">
              <CardBody>
                <h6 className="mb-3">Média e Aprovação</h6>
                <Row>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="passingGrade">Média para Aprovação</Label>
                      <Input
                        type="number"
                        name="passingGrade"
                        id="passingGrade"
                        value={formData.passingGrade}
                        onChange={handleInputChange}
                        required
                        min="0"
                        max="10"
                        step="0.1"
                      />
                      <FormText>Nota mínima para aprovação direta</FormText>
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="recoveryThreshold">Média para Recuperação</Label>
                      <Input
                        type="number"
                        name="recoveryThreshold"
                        id="recoveryThreshold"
                        value={formData.recoveryThreshold}
                        onChange={handleInputChange}
                        required
                        min="0"
                        max="10"
                        step="0.1"
                      />
                      <FormText>Nota mínima para ter direito à recuperação</FormText>
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="maxAttendanceAbsence">Limite de Faltas (%)</Label>
                      <Input
                        type="number"
                        name="maxAttendanceAbsence"
                        id="maxAttendanceAbsence"
                        value={formData.maxAttendanceAbsence}
                        onChange={handleInputChange}
                        required
                        min="0"
                        max="100"
                      />
                      <FormText>Percentual máximo de faltas permitido</FormText>
                    </FormGroup>
                  </Col>
                </Row>
              </CardBody>
            </Card>

            <Card className="border mb-4">
              <CardBody>
                <h6 className="mb-3">Sistema de Notas</h6>
                <Row>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="gradingSystem">Tipo de Avaliação</Label>
                      <Input
                        type="select"
                        name="gradingSystem"
                        id="gradingSystem"
                        value={formData.gradingSystem}
                        onChange={handleInputChange}
                      >
                        <option value="numeric">Numérica (0-10)</option>
                        <option value="conceptual">Conceitual (A, B, C, D)</option>
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup check className="mt-4">
                      <Label check>
                        <Input
                          type="checkbox"
                          name="roundGrades"
                          checked={formData.roundGrades}
                          onChange={handleInputChange}
                        />{" "}
                        Arredondar Notas
                      </Label>
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup check className="mt-4">
                      <Label check>
                        <Input
                          type="checkbox"
                          name="showDecimal"
                          checked={formData.showDecimal}
                          onChange={handleInputChange}
                        />{" "}
                        Mostrar Casas Decimais
                      </Label>
                    </FormGroup>
                  </Col>
                </Row>
              </CardBody>
            </Card>

            {formData.passingGrade <= formData.recoveryThreshold && (
              <Alert color="warning" className="mb-4">
                <i className="bx bx-error me-2"></i>
                A média para aprovação deve ser maior que a média para recuperação.
              </Alert>
            )}

            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button color="light" type="button" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button 
                color="primary" 
                type="submit"
                disabled={formData.passingGrade <= formData.recoveryThreshold}
              >
                Salvar Configurações
              </Button>
            </div>
          </Form>
        )}
      </CardBody>
    </Card>
  );
};

export default AcademicSettings;
