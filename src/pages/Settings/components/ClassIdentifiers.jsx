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
  FormText
} from "reactstrap";
import { toast } from "react-toastify";

// Dados de exemplo para turmas
const SAMPLE_CLASS_IDENTIFIERS = [
  { id: "ci1", name: "A", active: true },
  { id: "ci2", name: "B", active: true },
  { id: "ci3", name: "C", active: true },
  { id: "ci4", name: "D", active: true },
  { id: "ci5", name: "E", active: false },
  { id: "ci6", name: "F", active: false }
];

const ClassIdentifiers = ({ isEditing }) => {
  const [classIdentifiers, setClassIdentifiers] = useState(SAMPLE_CLASS_IDENTIFIERS);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    active: true
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
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
      active: true
    });
    setEditingItem(null);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingItem) {
      // Atualizar item existente
      const updatedItems = classIdentifiers.map(item => 
        item.id === editingItem ? { ...formData, id: editingItem } : item
      );
      setClassIdentifiers(updatedItems);
      toast.success("Turma atualizada com sucesso!");
    } else {
      // Adicionar novo item
      const newId = `ci${classIdentifiers.length + 1}`;
      const newItem = { ...formData, id: newId };
      setClassIdentifiers([...classIdentifiers, newItem]);
      toast.success("Turma adicionada com sucesso!");
    }
    
    setShowForm(false);
    setEditingItem(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const toggleActive = (id) => {
    const updatedItems = classIdentifiers.map(item => 
      item.id === id ? { ...item, active: !item.active } : item
    );
    setClassIdentifiers(updatedItems);
    toast.info("Status atualizado com sucesso!");
  };

  return (
    <Card>
      <CardBody>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="card-title mb-0">Turmas</h5>
          {isEditing && (
            <Button color="primary" size="sm" onClick={handleAdd}>
              <i className="bx bx-plus me-1"></i> Adicionar Turma
            </Button>
          )}
        </div>

        <Table responsive className="table-striped">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {classIdentifiers.map((item) => (
              <tr key={item.id}>
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
              <h5 className="mb-3">{editingItem ? "Editar" : "Adicionar"} Turma</h5>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="name">Nome da Turma</Label>
                      <Input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                      <FormText>Ex: A, B, C, etc.</FormText>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
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

export default ClassIdentifiers;
