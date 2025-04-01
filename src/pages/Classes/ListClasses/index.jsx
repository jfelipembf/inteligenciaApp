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
import useUpdateClass from "../../../hooks/useUpdateClass";
import CreatableSelect from "react-select/creatable";
import useFetchTeachers from "../../../hooks/useFetchTeachers";
import useDeleteClass from "../../../hooks/useDeleteClass";

const roomOptions = [
  { value: "1", label: "Sala 1" },
  { value: "2", label: "Sala 2" },
  { value: "3", label: "Sala 3" },
  { value: "4", label: "Sala 4" },
  { value: "5", label: "Sala 5" },
];

const ListClasses = () => {
  const navigate = useNavigate();
  const { classes, loading, error } = useFetchClasses();
  const {
    updateClass,
    loading: updatingClass,
    error: updateError,
  } = useUpdateClass();

  const {
    teachers,
    loading: loadingTeachers,
    error: fetchError,
  } = useFetchTeachers();

  const [modal, setModal] = useState(false);
  const [currentClass, setCurrentClass] = useState(null);

  const toggle = () => setModal(!modal);

  const handleEdit = (classItem) => {
    setCurrentClass({
      ...classItem,
      series: classItem.series || null,
      identifier: classItem.identifier || null,
      teacher: classItem.teacher || null, // Mantém o professor existente
      startTime: classItem.startTime || "",
      endTime: classItem.endTime || "",
      duration: classItem.duration || "",
      daysOfWeek: classItem.daysOfWeek || [],
      description: classItem.description || "",
      room: classItem.room || { value: "", label: "" },
      startDate: classItem.startDate || "",
      endDate: classItem.endDate || "",
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

  const handleSave = async () => {
    if (!currentClass || !currentClass.id) {
      alert("Erro: Nenhuma turma selecionada para atualização.");
      return;
    }

    try {
      // Atualizar a turma no Firestore
      await updateClass(currentClass.id, currentClass.schoolId, currentClass);
      alert("Turma atualizada com sucesso!");
      setModal(false);
    } catch (err) {
      console.error("Erro ao atualizar a turma:", err);
      alert("Erro ao atualizar a turma: " + err.message);
    }
  };

  const {
    deleteClass,
    loading: deletingClass,
    error: deleteError,
  } = useDeleteClass();

  const handleDelete = async (classItem) => {
    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir a turma "${classItem.className}"?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteClass(classItem.id, classItem.schoolId);
      alert("Turma excluída com sucesso!");
      // Atualizar a lista de turmas após a exclusão
      window.location.reload(); // Ou use um método mais eficiente para atualizar a lista
    } catch (err) {
      console.error("Erro ao excluir a turma:", err);
      alert("Erro ao excluir a turma: " + err.message);
    }
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
                            {/*<th>ID</th>*/}
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
                              {/*<td>{classItem.id}</td>*/}
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
                                  onClick={() => handleDelete(classItem)}
                                  disabled={deletingClass} // Desabilita o botão enquanto está excluindo
                                >
                                  {deletingClass ? "Excluindo..." : "Excluir"}
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
                      <Label>Professor Responsável</Label>
                      {loadingTeachers ? (
                        <p>Carregando professores...</p>
                      ) : fetchError ? (
                        <p className="text-danger">
                          Erro ao carregar professores: {fetchError}
                        </p>
                      ) : (
                        <Select
                          name="teacher"
                          value={currentClass?.teacher || null} // Valor atual do professor selecionado
                          onChange={(selectedOption) =>
                            setCurrentClass((prev) => ({
                              ...prev,
                              teacher: selectedOption, // Atualiza o estado com o professor selecionado
                            }))
                          }
                          options={teachers} // Lista de professores retornada pelo hook
                          placeholder="Selecione o professor"
                          isClearable
                        />
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Descrição</Label>
                      <Input
                        type="text"
                        name="description"
                        value={currentClass?.description || ""}
                        onChange={handleInputChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Sala</Label>
                      <CreatableSelect
                        name="room"
                        value={currentClass?.room || { value: "", label: "" }}
                        onChange={(selectedOption) =>
                          setCurrentClass((prev) => ({
                            ...prev,
                            room: selectedOption, // Atualiza no formato { value, label }
                          }))
                        }
                        formatCreateLabel={(inputValue) =>
                          `Criar "${inputValue}"`
                        }
                        getNewOptionData={(inputValue, optionLabel) => ({
                          value: inputValue,
                          label: optionLabel,
                        })}
                        options={roomOptions}
                        placeholder="Selecione ou digite a sala"
                        isClearable
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onClick={handleSave}
                disabled={updatingClass}
              >
                {updatingClass ? "Salvando..." : "Salvar"}
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
