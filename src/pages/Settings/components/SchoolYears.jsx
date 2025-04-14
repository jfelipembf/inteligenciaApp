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

// Dados de exemplo para anos escolares
const SAMPLE_SCHOOL_YEARS = [
  {
    id: "sy1",
    name: "1º Ano",
    level: "Ensino Fundamental I",
    order: 1,
    active: true
  },
  {
    id: "sy2",
    name: "2º Ano",
    level: "Ensino Fundamental I",
    order: 2,
    active: true
  },
  {
    id: "sy3",
    name: "3º Ano",
    level: "Ensino Fundamental I",
    order: 3,
    active: true
  },
  {
    id: "sy4",
    name: "4º Ano",
    level: "Ensino Fundamental I",
    order: 4,
    active: true
  },
  {
    id: "sy5",
    name: "5º Ano",
    level: "Ensino Fundamental I",
    order: 5,
    active: true
  },
  {
    id: "sy6",
    name: "6º Ano",
    level: "Ensino Fundamental II",
    order: 6,
    active: true
  },
  {
    id: "sy7",
    name: "7º Ano",
    level: "Ensino Fundamental II",
    order: 7,
    active: true
  },
  {
    id: "sy8",
    name: "8º Ano",
    level: "Ensino Fundamental II",
    order: 8,
    active: true
  },
  {
    id: "sy9",
    name: "9º Ano",
    level: "Ensino Fundamental II",
    order: 9,
    active: true
  },
  {
    id: "sy10",
    name: "1º Ano",
    level: "Ensino Médio",
    order: 10,
    active: true
  },
  {
    id: "sy11",
    name: "2º Ano",
    level: "Ensino Médio",
    order: 11,
    active: true
  },
  {
    id: "sy12",
    name: "3º Ano",
    level: "Ensino Médio",
    order: 12,
    active: true
  }
];

// Dados de exemplo para níveis de ensino
const SAMPLE_EDUCATION_LEVELS = [
  { id: "el1", name: "Educação Infantil", active: true },
  { id: "el2", name: "Ensino Fundamental I", active: true },
  { id: "el3", name: "Ensino Fundamental II", active: true },
  { id: "el4", name: "Ensino Médio", active: true },
  { id: "el5", name: "Ensino Técnico", active: false }
];

const SchoolYears = ({ isEditing }) => {
  const [schoolYears, setSchoolYears] = useState(SAMPLE_SCHOOL_YEARS);
  const [educationLevels] = useState(SAMPLE_EDUCATION_LEVELS);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    level: "",
    order: 0,
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
      level: "",
      order: schoolYears.length + 1,
      active: true
    });
    setEditingItem(null);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingItem) {
      // Atualizar item existente
      const updatedItems = schoolYears.map(item => 
        item.id === editingItem ? { ...formData, id: editingItem } : item
      );
      setSchoolYears(updatedItems);
      toast.success("Ano escolar atualizado com sucesso!");
    } else {
      // Adicionar novo item
      const newId = `sy${schoolYears.length + 1}`;
      const newItem = { ...formData, id: newId };
      setSchoolYears([...schoolYears, newItem]);
      toast.success("Ano escolar adicionado com sucesso!");
    }
    
    setShowForm(false);
    setEditingItem(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const toggleActive = (id) => {
    const updatedItems = schoolYears.map(item => 
      item.id === id ? { ...item, active: !item.active } : item
    );
    setSchoolYears(updatedItems);
    toast.info("Status atualizado com sucesso!");
  };

  return (
    <Card>
      <CardBody>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="card-title mb-0">Anos Escolares</h5>
          {isEditing && (
            <Button color="primary" size="sm" onClick={handleAdd}>
              <i className="bx bx-plus me-1"></i> Adicionar Ano Escolar
            </Button>
          )}
        </div>

        <Table responsive className="table-striped">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Nível de Ensino</th>
              <th>Ordem</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {schoolYears.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.level}</td>
                <td>{item.order}</td>
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
              <h5 className="mb-3">{editingItem ? "Editar" : "Adicionar"} Ano Escolar</h5>
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
                      <FormText>Ex: 1º Ano, 2º Ano, etc.</FormText>
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="level">Nível de Ensino</Label>
                      <Input
                        type="select"
                        name="level"
                        id="level"
                        value={formData.level}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Selecione...</option>
                        {educationLevels
                          .filter(level => level.active)
                          .map(level => (
                            <option key={level.id} value={level.name}>
                              {level.name}
                            </option>
                          ))}
                      </Input>
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

export default SchoolYears;
