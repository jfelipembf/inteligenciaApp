import React, { useState, useEffect } from "react";
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
  FormText
} from "reactstrap";
import { toast } from "react-toastify";

// Dados de exemplo para recuperações
const SAMPLE_RECOVERY_TYPES = [
  {
    id: "rt1",
    name: "Recuperação Paralela",
    description: "Realizada durante o período letivo para alunos com dificuldades",
    maxGrade: 7.0,
    active: true
  },
  {
    id: "rt2",
    name: "Recuperação Final",
    description: "Realizada ao final do ano letivo para alunos que não atingiram a média",
    maxGrade: 6.0,
    active: true
  },
  {
    id: "rt3",
    name: "Recuperação Semestral",
    description: "Realizada ao final de cada semestre",
    maxGrade: 7.0,
    active: false
  }
];

const RecoveryTypes = ({ isEditing }) => {
  const [recoveryTypes, setRecoveryTypes] = useState(SAMPLE_RECOVERY_TYPES);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    maxGrade: 7.0,
    active: true
  });

  useEffect(() => {
    // Quando isEditing mudar, podemos mostrar o formulário automaticamente
    if (isEditing && !showForm && !editingItem) {
      setShowForm(true);
      setFormData({
        name: "",
        description: "",
        maxGrade: 7.0,
        active: true
      });
    }
  }, [isEditing, showForm, editingItem]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : 
              name === "maxGrade" ? parseFloat(value) : value
    });
  };

  const handleEdit = (item) => {
    setFormData({ ...item });
    setEditingItem(item.id);
    setShowForm(true);
  };

  const handleAdd = () => {
    setFormData({
      name: "",
      description: "",
      maxGrade: 7.0,
      active: true
    });
    setEditingItem(null);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingItem) {
      // Atualizar item existente
      const updatedItems = recoveryTypes.map(item => 
        item.id === editingItem ? { ...formData, id: editingItem } : item
      );
      setRecoveryTypes(updatedItems);
      toast.success("Tipo de recuperação atualizado com sucesso!");
    } else {
      // Adicionar novo item
      const newId = `rt${recoveryTypes.length + 1}`;
      const newItem = { ...formData, id: newId };
      setRecoveryTypes([...recoveryTypes, newItem]);
      toast.success("Tipo de recuperação adicionado com sucesso!");
    }
    
    setShowForm(false);
    setEditingItem(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const toggleActive = (id) => {
    const updatedItems = recoveryTypes.map(item => 
      item.id === id ? { ...item, active: !item.active } : item
    );
    setRecoveryTypes(updatedItems);
    toast.info("Status atualizado com sucesso!");
  };

  return (
    <Card>
      <CardBody>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="card-title mb-0">Tipos de Recuperação</h5>
          {isEditing && (
            <Button color="primary" size="sm" onClick={handleAdd}>
              <i className="bx bx-plus me-1"></i> Adicionar Recuperação
            </Button>
          )}
        </div>

        <Table responsive className="table-striped">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Nota Máxima</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {recoveryTypes.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>{item.maxGrade.toFixed(1)}</td>
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
              <h5 className="mb-3">{editingItem ? "Editar" : "Adicionar"} Tipo de Recuperação</h5>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="name">Nome</Label>
                      <Input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                      <FormText>Ex: Recuperação Paralela, Recuperação Final, etc.</FormText>
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="maxGrade">Nota Máxima</Label>
                      <Input
                        type="number"
                        name="maxGrade"
                        id="maxGrade"
                        value={formData.maxGrade}
                        onChange={handleInputChange}
                        required
                        min="0"
                        max="10"
                        step="0.1"
                      />
                      <FormText>Nota máxima que o aluno pode obter na recuperação</FormText>
                    </FormGroup>
                  </Col>
                  <Col md={4}>
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
                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <Label for="description">Descrição</Label>
                      <Input
                        type="textarea"
                        name="description"
                        id="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="3"
                      />
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

export default RecoveryTypes;
