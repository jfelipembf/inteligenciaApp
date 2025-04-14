import React, { useState } from "react";
import {
  Card,
  CardBody,
  Table,
  Badge,
  Button,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  InputGroup
} from "reactstrap";
import { toast } from "react-toastify";

// Dados de exemplo para unidades de avaliação
const SAMPLE_EVALUATION_UNITS = [
  { 
    id: "eu1", 
    name: "1ª Unidade", 
    weight: 30, 
    startDate: "2025-02-01", 
    endDate: "2025-04-30", 
    active: true 
  },
  { 
    id: "eu2", 
    name: "2ª Unidade", 
    weight: 30, 
    startDate: "2025-05-01", 
    endDate: "2025-08-31", 
    active: true 
  },
  { 
    id: "eu3", 
    name: "3ª Unidade", 
    weight: 40, 
    startDate: "2025-09-01", 
    endDate: "2025-12-15", 
    active: true 
  }
];

// Meses para seleção
const MONTHS = [
  { value: "01", label: "Janeiro" },
  { value: "02", label: "Fevereiro" },
  { value: "03", label: "Março" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Maio" },
  { value: "06", label: "Junho" },
  { value: "07", label: "Julho" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" }
];

const EvaluationUnits = ({ isEditing }) => {
  const [evaluationUnits, setEvaluationUnits] = useState(SAMPLE_EVALUATION_UNITS);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    weight: 0,
    startMonth: "01",
    endMonth: "03",
    active: true
  });
  const [totalWeight, setTotalWeight] = useState(100);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleEdit = (item) => {
    const startMonth = item.startDate.split("-")[1];
    const endMonth = item.endDate.split("-")[1];
    
    setFormData({ 
      ...item,
      startMonth,
      endMonth
    });
    setEditingItem(item.id);
    setShowForm(true);
  };

  const handleAdd = () => {
    setFormData({
      name: "",
      weight: 0,
      startMonth: "01",
      endMonth: "03",
      active: true
    });
    setEditingItem(null);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Criar datas completas
    const currentYear = new Date().getFullYear();
    const startDate = `${currentYear}-${formData.startMonth}-01`;
    const endMonth = parseInt(formData.endMonth);
    const lastDay = new Date(currentYear, endMonth, 0).getDate();
    const endDate = `${currentYear}-${formData.endMonth}-${lastDay}`;
    
    const newData = {
      ...formData,
      startDate,
      endDate
    };
    
    if (editingItem) {
      // Atualizar item existente
      const updatedItems = evaluationUnits.map(item => 
        item.id === editingItem ? { ...newData, id: editingItem } : item
      );
      setEvaluationUnits(updatedItems);
      toast.success("Unidade de avaliação atualizada com sucesso!");
    } else {
      // Adicionar novo item
      const newId = `eu${evaluationUnits.length + 1}`;
      const newItem = { ...newData, id: newId };
      setEvaluationUnits([...evaluationUnits, newItem]);
      toast.success("Unidade de avaliação adicionada com sucesso!");
    }
    
    // Recalcular o peso total
    calculateTotalWeight([...evaluationUnits, newData]);
    
    setShowForm(false);
    setEditingItem(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const toggleActive = (id) => {
    const updatedItems = evaluationUnits.map(item => 
      item.id === id ? { ...item, active: !item.active } : item
    );
    setEvaluationUnits(updatedItems);
    toast.info("Status atualizado com sucesso!");
  };

  const calculateTotalWeight = (units) => {
    const total = units.reduce((sum, unit) => sum + parseInt(unit.weight || 0), 0);
    setTotalWeight(total);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getMonthName = (monthNumber) => {
    const month = MONTHS.find(m => m.value === monthNumber);
    return month ? month.label : "";
  };

  return (
    <Card>
      <CardBody>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="card-title mb-0">Unidades de Avaliação</h5>
          {isEditing && (
            <Button color="primary" size="sm" onClick={handleAdd}>
              <i className="bx bx-plus me-1"></i> Adicionar Unidade
            </Button>
          )}
        </div>

        {totalWeight !== 100 && (
          <div className={`alert alert-${totalWeight < 100 ? 'warning' : 'danger'} mb-3`}>
            <i className={`bx bx-${totalWeight < 100 ? 'error' : 'error-circle'} me-2`}></i>
            O peso total das unidades é de <strong>{totalWeight}%</strong>. O ideal é que some 100%.
          </div>
        )}

        <Table responsive className="table-striped">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Período</th>
              <th>Peso</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {evaluationUnits.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>
                  {getMonthName(item.startDate.split("-")[1])} a {getMonthName(item.endDate.split("-")[1])}
                </td>
                <td>{item.weight}%</td>
                <td>
                  <Badge color={item.active ? "success" : "danger"}>
                    {item.active ? "Ativo" : "Inativo"}
                  </Badge>
                </td>
                <td>
                  {isEditing && (
                    <div className="d-flex gap-2">
                      <Button
                        color="soft-primary"
                        className="btn btn-sm btn-soft-primary"
                        onClick={() => handleEdit(item)}
                      >
                        <i className="mdi mdi-pencil-outline"></i>
                      </Button>
                      <Button
                        color={item.active ? "soft-danger" : "soft-success"}
                        className={`btn btn-sm btn-${item.active ? "soft-danger" : "soft-success"}`}
                        onClick={() => toggleActive(item.id)}
                      >
                        <i className={`mdi mdi-${item.active ? "close-circle-outline" : "check-circle-outline"}`}></i>
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {showForm && (
          <Card className="mt-4 border">
            <CardBody>
              <h5 className="mb-3">{editingItem ? "Editar" : "Adicionar"} Unidade de Avaliação</h5>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="name">Nome da Unidade</Label>
                      <Input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                      <FormText>Ex: 1ª Unidade, 2ª Unidade, etc.</FormText>
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <FormGroup>
                      <Label for="weight">Peso (%)</Label>
                      <Input
                        type="number"
                        name="weight"
                        id="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        required
                        min="0"
                        max="100"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label>Período</Label>
                      <Row>
                        <Col xs={6}>
                          <Input
                            type="select"
                            name="startMonth"
                            value={formData.startMonth}
                            onChange={handleInputChange}
                            required
                          >
                            {MONTHS.map(month => (
                              <option key={`start-${month.value}`} value={month.value}>
                                {month.label}
                              </option>
                            ))}
                          </Input>
                        </Col>
                        <Col xs={6}>
                          <Input
                            type="select"
                            name="endMonth"
                            value={formData.endMonth}
                            onChange={handleInputChange}
                            required
                          >
                            {MONTHS.map(month => (
                              <option key={`end-${month.value}`} value={month.value}>
                                {month.label}
                              </option>
                            ))}
                          </Input>
                        </Col>
                      </Row>
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <FormGroup check className="mt-4">
                      <Label check>
                        <Input
                          type="checkbox"
                          name="active"
                          checked={formData.active}
                          onChange={handleInputChange}
                        />{" "}
                        Ativo
                      </Label>
                    </FormGroup>
                  </Col>
                </Row>
                <div className="d-flex justify-content-end gap-2 mt-3">
                  <Button color="light" type="button" onClick={handleCancel}>
                    Cancelar
                  </Button>
                  <Button color="primary" type="submit">
                    {editingItem ? "Atualizar" : "Adicionar"}
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        )}
      </CardBody>
    </Card>
  );
};

export default EvaluationUnits;
