import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useFetchClasses } from "../../../hooks/useFetchClasses";

const ListClasses = () => {
  const navigate = useNavigate();
  const { classes, loading, error } = useFetchClasses();

  const [modal, setModal] = useState(false);
  const [currentClass, setCurrentClass] = useState(null);

  const toggle = () => setModal(!modal);

  const handleEdit = (classItem) => {
    setCurrentClass({
      ...classItem,
      series: null,
      identifier: null,
      teacher: null,
      startTime: "",
      endTime: "",
      duration: "",
      daysOfWeek: [],
      description: "",
      room: null,
      startDate: "",
      endDate: "",
    });
    setModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentClass((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Aqui você implementará a lógica para salvar as alterações
    setModal(false);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Breadcrumb */}
          <Breadcrumbs title="Turmas" breadcrumbItem="Visualizar Turmas" />

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="card-title mb-0">Lista de Turmas</h4>
                    <Button
                      color="primary"
                      onClick={() => navigate("/create-class")}
                    >
                      Nova Turma
                    </Button>
                  </div>

                  {loading ? (
                    <p>Carregando turmas...</p>
                  ) : error ? (
                    <p className="text-danger">Erro: {error}</p>
                  ) : (
                    <div className="table-responsive">
                      <Table className="table-centered table-nowrap mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>ID</th>
                            <th>Nome da Turma</th>
                            <th>Período</th>
                            <th>Professor</th>
                            <th>Alunos</th>
                            <th>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {classes.map((classItem) => (
                            <tr key={classItem.id}>
                              <td>{classItem.id}</td>
                              <td>{classItem.className}</td>
                              <td>{classItem.period}</td>
                              <td>{classItem.teacher?.label || "N/A"}</td>
                              <td>{classItem.studentCount || 0}</td>
                              <td>
                                <Button
                                  color="info"
                                  size="sm"
                                  className="me-2"
                                  onClick={() =>
                                    navigate(`/classes/${classItem.id}`)
                                  }
                                >
                                  Ver
                                </Button>
                                <Button
                                  color="warning"
                                  size="sm"
                                  className="me-2"
                                  onClick={() => handleEdit(classItem)}
                                >
                                  Editar
                                </Button>
                                <Button
                                  color="danger"
                                  size="sm"
                                  onClick={() => {
                                    // Implementar exclusão
                                  }}
                                >
                                  Excluir
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Modal de Edição */}
          <Modal isOpen={modal} toggle={toggle} size="lg">
            <ModalHeader toggle={toggle}>Editar Turma</ModalHeader>
            <ModalBody>
              <Form>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Nome da Turma</Label>
                      <Input
                        type="text"
                        name="className"
                        value={currentClass?.className || ""}
                        onChange={handleInputChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Período</Label>
                      <Input
                        type="text"
                        name="period"
                        value={currentClass?.period || ""}
                        onChange={handleInputChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={handleSave}>
                Salvar
              </Button>
              <Button color="secondary" onClick={toggle}>
                Cancelar
              </Button>
            </ModalFooter>
          </Modal>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ListClasses;
