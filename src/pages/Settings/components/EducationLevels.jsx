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
  Input
} from "reactstrap";
import { toast } from "react-toastify";

// Dados de exemplo para níveis de ensino
const SAMPLE_EDUCATION_LEVELS = [
  { id: "el1", name: "Educação Infantil", order: 1, active: true },
  { id: "el2", name: "Ensino Fundamental I", order: 2, active: true },
  { id: "el3", name: "Ensino Fundamental II", order: 3, active: true },
  { id: "el4", name: "Ensino Médio", order: 4, active: true },
  { id: "el5", name: "Ensino Técnico", order: 5, active: false }
];

const EducationLevels = ({ isEditing }) => {
  const [educationLevels, setEducationLevels] = useState(SAMPLE_EDUCATION_LEVELS);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    order: 1,
    active: true
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : 
              name === "order" ? parseInt(value) : value
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
      order: educationLevels.length + 1,
      active: true
    });
    setEditingItem(null);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingItem) {
      // Atualizar item existente
      const updatedItems = educationLevels.map(item => 
        item.id === editingItem ? { ...formData, id: editingItem } : item
      );
      setEducationLevels(updatedItems);
      toast.success("Nível de ensino atualizado com sucesso!");
    } else {
      // Adicionar novo item
      const newId = `el${educationLevels.length + 1}`;
      const newItem = { ...formData, id: newId };
      setEducationLevels([...educationLevels, newItem]);
      toast.success("Nível de ensino adicionado com sucesso!");
    }
    
    setShowForm(false);
    setEditingItem(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const toggleActive = (id) => {
    const updatedItems = educationLevels.map(item => 
      item.id === id ? { ...item, active: !item.active } : item
    );
    setEducationLevels(updatedItems);
    toast.info("Status atualizado com sucesso!");
  };

  const moveItem = (id, direction) => {
    const currentIndex = educationLevels.findIndex(item => item.id === id);
    if (
      (direction === "up" && currentIndex === 0) || 
      (direction === "down" && currentIndex === educationLevels.length - 1)
    ) {
      return; // Não pode mover além dos limites
    }

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const updatedItems = [...educationLevels];
    
    // Troca os itens de posição
    [updatedItems[currentIndex], updatedItems[newIndex]] = 
    [updatedItems[newIndex], updatedItems[currentIndex]];
    
    // Atualiza a ordem
    updatedItems.forEach((item, index) => {
      item.order = index + 1;
    });
    
    setEducationLevels(updatedItems);
    toast.info("Ordem atualizada com sucesso!");
  };

  return (
    <Card>
      <CardBody>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="card-title mb-0">Níveis de Ensino</h5>
          {isEditing && (
            <Button color="primary" size="sm" onClick={handleAdd}>
              <i className="bx bx-plus me-1"></i> Adicionar Nível
            </Button>
          )}
        </div>

        <Table responsive className="table-striped">
          <thead>
            <tr>
              <th style={{ width: "5%" }}>#</th>
              <th>Nome</th>
              <th style={{ width: "15%" }}>Status</th>
              <th style={{ width: "25%" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {educationLevels
              .sort((a, b) => a.order - b.order)
              .map((item) => (
                <tr key={item.id}>
                  <td>{item.order}</td>
                  <td>{item.name}</td>
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
                        <Button
                          color="soft-secondary"
                          className="btn btn-sm btn-soft-secondary"
                          onClick={() => moveItem(item.id, "up")}
                          disabled={item.order === 1}
                        >
                          <i className="mdi mdi-arrow-up"></i>
                        </Button>
                        <Button
                          color="soft-secondary"
                          className="btn btn-sm btn-soft-secondary"
                          onClick={() => moveItem(item.id, "down")}
                          disabled={item.order === educationLevels.length}
                        >
                          <i className="mdi mdi-arrow-down"></i>
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
              <h5 className="mb-3">{editingItem ? "Editar" : "Adicionar"} Nível de Ensino</h5>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={8}>
                    <FormGroup>
                      <Label for="name">Nome do Nível</Label>
                      <Input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <FormGroup>
                      <Label for="order">Ordem</Label>
                      <Input
                        type="number"
                        name="order"
                        id="order"
                        value={formData.order}
                        onChange={handleInputChange}
                        required
                        min="1"
                      />
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

export default EducationLevels;
