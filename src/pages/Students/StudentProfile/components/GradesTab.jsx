import React, { useState } from "react";
import { Row, Col, Card, CardBody, Progress, Table, Badge, Button, Input, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Bar, Line } from "react-chartjs-2";
import { studentData } from "./data";

const GradesTab = () => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [editingSubject, setEditingSubject] = useState(null);
  const [editedGrades, setEditedGrades] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [gradesData, setGradesData] = useState(studentData.grades);
  // Calcular médias
  const calculateAverage = (grades) => {
    return ((grades.b1 + grades.b2 + grades.b3 + grades.b4) / 4).toFixed(1);
  };

  const calculateWeightedAverage = (grades) => {
    // Pesos: 1º bimestre (20%), 2º bimestre (20%), 3º bimestre (30%), 4º bimestre (30%)
    // Calcula a média do primeiro semestre (1ª e 2ª unidades)
    let firstSemAvg = (grades.b1 * 0.5) + (grades.b2 * 0.5);
    // Se houver recuperação do primeiro semestre e a média for menor que 7, considera a recuperação
    if (grades.rec1 > 0 && firstSemAvg < 7) {
      firstSemAvg = (firstSemAvg + grades.rec1) / 2;
    }
    
    // Calcula a média do segundo semestre (3ª e 4ª unidades)
    let secondSemAvg = (grades.b3 * 0.5) + (grades.b4 * 0.5);
    // Se houver recuperação do segundo semestre e a média for menor que 7, considera a recuperação
    if (grades.rec2 > 0 && secondSemAvg < 7) {
      secondSemAvg = (secondSemAvg + grades.rec2) / 2;
    }
    
    // Calcula a média ponderada anual (primeiro semestre 40%, segundo semestre 60%)
    let average = (firstSemAvg * 0.4) + (secondSemAvg * 0.6);
    
    // Se houver recuperação final e a média for menor que 7, considera a recuperação final
    if (grades.recFinal > 0 && average < 7) {
      average = (average + grades.recFinal) / 2;
    }
    
    return average.toFixed(1);
  };

  // Calcular média geral
  const calculateOverallAverage = () => {
    const sum = gradesData.reduce((acc, grade) => acc + parseFloat(calculateAverage(grade)), 0);
    return (sum / gradesData.length).toFixed(1);
  };

  // Calcular média ponderada geral
  const calculateOverallWeightedAverage = () => {
    const sum = gradesData.reduce((acc, grade) => acc + parseFloat(calculateWeightedAverage(grade)), 0);
    return (sum / gradesData.length).toFixed(1);
  };
  
  // Iniciar edição de notas
  const handleEditClick = (subject) => {
    const gradeToEdit = gradesData.find(g => g.subject === subject);
    setEditingSubject(subject);
    setEditedGrades({...gradeToEdit});
    setShowEditModal(true);
  };
  
  // Atualizar valores durante a edição
  const handleInputChange = (field, value) => {
    setEditedGrades(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };
  
  // Salvar alterações
  const handleSaveChanges = () => {
    setGradesData(prev => 
      prev.map(grade => 
        grade.subject === editingSubject ? editedGrades : grade
      )
    );
    setShowEditModal(false);
    setEditingSubject(null);
  };

  // Determinar status de aprovação
  const getApprovalStatus = (average) => {
    if (average >= 7.0) {
      return <Badge color="success">Aprovado</Badge>;
    } else if (average >= 5.0) {
      return <Badge color="warning">Recuperação</Badge>;
    } else {
      return <Badge color="danger">Reprovado</Badge>;
    }
  };

  // Dados para o gráfico da disciplina selecionada
  const getSubjectChartData = () => {
    if (!selectedSubject) return null;
    
    const subject = gradesData.find(g => g.subject === selectedSubject);
    if (!subject) return null;
    
    return {
      labels: ["1ª Unidade", "2ª Unidade", "3ª Unidade", "4ª Unidade", "Média"],
      datasets: [
        {
          label: selectedSubject,
          backgroundColor: "rgba(85, 110, 230, 0.2)",
          borderColor: "#556ee6",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          data: [subject.b1, subject.b2, subject.b3, subject.b4, parseFloat(calculateAverage(subject))],
          pointBackgroundColor: "#556ee6",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 5,
        },
      ],
    };
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: false,
        min: 0,
        max: 10,
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: selectedSubject ? `Desempenho em ${selectedSubject}` : 'Selecione uma disciplina',
        font: {
          size: 16,
        },
      },
    },
  };

  return (
    <React.Fragment>
      {/* Seção de Boletim */}
      <Row>
        <Col lg={12}>
          <Card>
            <CardBody>
              <h4 className="card-title mb-4">Boletim Escolar</h4>
              <div className="table-responsive">
        <Table className="table-bordered mb-0">
          <thead>
            <tr className="bg-light">
              <th>Disciplina</th>
              <th>1ª Unidade</th>
              <th>2ª Unidade</th>
              <th>Rec. 1-2</th>
              <th>3ª Unidade</th>
              <th>4ª Unidade</th>
              <th>Rec. 3-4</th>
              <th>Rec. Final</th>
              <th>Média</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {gradesData.map((grade, index) => {
              const weightedAverage = calculateWeightedAverage(grade);
              return (
                <tr 
                  key={index} 
                  className={selectedSubject === grade.subject ? "table-active" : ""}
                >
                  <td><strong>{grade.subject}</strong></td>
                  <td>{grade.b1.toFixed(1)}</td>
                  <td>{grade.b2.toFixed(1)}</td>
                  <td className={grade.rec1 > 0 ? "bg-light" : ""}>
                    {grade.rec1 > 0 ? grade.rec1.toFixed(1) : "-"}
                  </td>
                  <td>{grade.b3.toFixed(1)}</td>
                  <td>{grade.b4.toFixed(1)}</td>
                  <td className={grade.rec2 > 0 ? "bg-light" : ""}>
                    {grade.rec2 > 0 ? grade.rec2.toFixed(1) : "-"}
                  </td>
                  <td className={grade.recFinal > 0 ? "bg-light" : ""}>
                    {grade.recFinal > 0 ? grade.recFinal.toFixed(1) : "-"}
                  </td>
                  <td><strong>{weightedAverage}</strong></td>
                  <td>{getApprovalStatus(parseFloat(weightedAverage))}</td>
                  <td>
                    <div className="d-flex">
                      <Button
                        color="link"
                        className="p-0 me-2"
                        onClick={() => setSelectedSubject(grade.subject)}
                        title="Ver detalhes"
                      >
                        <i className="mdi mdi-eye font-size-18 text-secondary"></i>
                      </Button>
                      <Button
                        color="link"
                        className="p-0"
                        onClick={() => handleEditClick(grade.subject)}
                        title="Editar notas"
                      >
                        <i className="mdi mdi-pencil font-size-18 text-secondary"></i>
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {selectedSubject ? (
        <div className="mt-4">
          <h4 className="card-title mb-4">Gráfico de Desempenho</h4>
          <div className="chart-container" style={{ position: 'relative', height: '350px' }}>
            {getSubjectChartData() && (
              <Line 
                data={getSubjectChartData()} 
                options={chartOptions} 
                height={80} 
              />
            )}
          </div>
          
          {selectedSubject && (
            <div className="mt-4">
              <h5 className="font-size-15 mb-3">Desempenho por Unidade</h5>
              {studentData.grades
                .filter(grade => grade.subject === selectedSubject)
                .map((grade, index) => {
                  const units = [
                    { name: "1ª Unidade", value: grade.b1, color: grade.b1 >= 7 ? "success" : grade.b1 >= 5 ? "warning" : "danger" },
                    { name: "2ª Unidade", value: grade.b2, color: grade.b2 >= 7 ? "success" : grade.b2 >= 5 ? "warning" : "danger" },
                    { name: "3ª Unidade", value: grade.b3, color: grade.b3 >= 7 ? "success" : grade.b3 >= 5 ? "warning" : "danger" },
                    { name: "4ª Unidade", value: grade.b4, color: grade.b4 >= 7 ? "success" : grade.b4 >= 5 ? "warning" : "danger" },
                  ];
                  
                  return units.map((unit, i) => (
                    <div key={i} className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span>{unit.name}</span>
                        <span>{unit.value.toFixed(1)}</span>
                      </div>
                      <Progress value={unit.value * 10} color={unit.color} className="progress-sm" />
                    </div>
                  ));
                })
              }
            </div>
          )}
        </div>
      ) : null}
      {/* Modal de Edição de Notas */}
      <Modal isOpen={showEditModal} toggle={() => setShowEditModal(false)} size="lg">
        <ModalHeader toggle={() => setShowEditModal(false)}>
          Editar Notas - {editingSubject}
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col md={3}>
              <FormGroup>
                <Label for="b1">1ª Unidade</Label>
                <Input
                  type="number"
                  id="b1"
                  min="0"
                  max="10"
                  step="0.1"
                  value={editedGrades.b1 || 0}
                  onChange={(e) => handleInputChange('b1', e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Label for="b2">2ª Unidade</Label>
                <Input
                  type="number"
                  id="b2"
                  min="0"
                  max="10"
                  step="0.1"
                  value={editedGrades.b2 || 0}
                  onChange={(e) => handleInputChange('b2', e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Label for="rec1">Recuperação 1-2</Label>
                <Input
                  type="number"
                  id="rec1"
                  min="0"
                  max="10"
                  step="0.1"
                  value={editedGrades.rec1 || 0}
                  onChange={(e) => handleInputChange('rec1', e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Label for="b3">3ª Unidade</Label>
                <Input
                  type="number"
                  id="b3"
                  min="0"
                  max="10"
                  step="0.1"
                  value={editedGrades.b3 || 0}
                  onChange={(e) => handleInputChange('b3', e.target.value)}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col md={3}>
              <FormGroup>
                <Label for="b4">4ª Unidade</Label>
                <Input
                  type="number"
                  id="b4"
                  min="0"
                  max="10"
                  step="0.1"
                  value={editedGrades.b4 || 0}
                  onChange={(e) => handleInputChange('b4', e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Label for="rec2">Recuperação 3-4</Label>
                <Input
                  type="number"
                  id="rec2"
                  min="0"
                  max="10"
                  step="0.1"
                  value={editedGrades.rec2 || 0}
                  onChange={(e) => handleInputChange('rec2', e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Label for="recFinal">Recuperação Final</Label>
                <Input
                  type="number"
                  id="recFinal"
                  min="0"
                  max="10"
                  step="0.1"
                  value={editedGrades.recFinal || 0}
                  onChange={(e) => handleInputChange('recFinal', e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md={3} className="d-flex align-items-end">
              {editedGrades && (
                <div className="mt-4">
                  <strong>Média calculada: </strong>
                  {calculateWeightedAverage(editedGrades)}
                </div>
              )}
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setShowEditModal(false)}>Cancelar</Button>
          <Button color="primary" onClick={handleSaveChanges}>Salvar Alterações</Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default GradesTab;
