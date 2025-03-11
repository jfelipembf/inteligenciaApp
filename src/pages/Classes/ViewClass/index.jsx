import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, CardBody, Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from "reactstrap";
import { useParams } from "react-router-dom";
import Breadcrumbs from "../../../components/Common/Breadcrumb";

const ViewClass = () => {
  const { id } = useParams();

  // Estado para armazenar os dados da turma
  const [classData, setClassData] = useState({
    id: 1,
    name: "Turma A",
    period: "Manhã",
    teacher: "João Silva",
    students: 25,
    description: "Turma do período matutino focada em matemática avançada",
    schedule: "Segunda a Sexta, 07:00 - 12:00",
    room: "Sala 101",
    startDate: "01/02/2025",
    endDate: "15/12/2025"
  });

  // Estado para armazenar a lista de alunos da turma
  const [students, setStudents] = useState([
    { id: 1, name: "Ana Silva", age: 15, enrollment: "2025001", status: "Ativo" },
    { id: 2, name: "Pedro Santos", age: 16, enrollment: "2025002", status: "Ativo" },
    { id: 3, name: "Maria Oliveira", age: 15, enrollment: "2025003", status: "Ativo" },
  ]);

  // Estado para armazenar todos os alunos disponíveis
  const [availableStudents, setAvailableStudents] = useState([
    { id: 4, name: "João Pereira", age: 16, enrollment: "2025004", status: "Ativo" },
    { id: 5, name: "Lucas Costa", age: 15, enrollment: "2025005", status: "Ativo" },
    { id: 6, name: "Mariana Lima", age: 16, enrollment: "2025006", status: "Ativo" },
    { id: 7, name: "Gabriel Santos", age: 15, enrollment: "2025007", status: "Ativo" },
  ]);

  // Estado para controlar o modal de adicionar aluno
  const [addStudentModal, setAddStudentModal] = useState(false);
  const [searchEnrollment, setSearchEnrollment] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  // Toggle do modal
  const toggleAddStudentModal = () => {
    setAddStudentModal(!addStudentModal);
    if (!addStudentModal) {
      setSearchEnrollment("");
      setSelectedStudents([]);
      setFilteredStudents([]);
    }
  };

  // Função para filtrar alunos baseado na matrícula
  useEffect(() => {
    if (searchEnrollment) {
      const filtered = availableStudents.filter(
        student => 
          student.enrollment.toLowerCase().includes(searchEnrollment.toLowerCase()) ||
          student.name.toLowerCase().includes(searchEnrollment.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents([]);
    }
  }, [searchEnrollment, availableStudents]);

  // Função para adicionar aluno à lista de selecionados
  const handleSelectStudent = (student) => {
    if (!selectedStudents.find(s => s.id === student.id)) {
      setSelectedStudents([...selectedStudents, student]);
    }
    setSearchEnrollment("");
    setFilteredStudents([]);
  };

  // Função para remover aluno da lista de selecionados
  const handleRemoveSelected = (studentId) => {
    setSelectedStudents(selectedStudents.filter(student => student.id !== studentId));
  };

  // Função para adicionar alunos selecionados à turma
  const handleAddStudents = () => {
    setStudents(prev => [...prev, ...selectedStudents]);
    setAvailableStudents(prev => prev.filter(student => !selectedStudents.find(s => s.id === student.id)));
    toggleAddStudentModal();
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Turmas" breadcrumbItem="Detalhes da Turma" />

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <h4 className="card-title mb-4">Informações da Turma</h4>
                  
                  <div className="table-responsive">
                    <table className="table table-nowrap mb-4">
                      <tbody>
                        <tr>
                          <th scope="row">Nome da Turma:</th>
                          <td>{classData.name}</td>
                          <th scope="row">Período:</th>
                          <td>{classData.period}</td>
                        </tr>
                        <tr>
                          <th scope="row">Professor:</th>
                          <td>{classData.teacher}</td>
                          <th scope="row">Sala:</th>
                          <td>{classData.room}</td>
                        </tr>
                        <tr>
                          <th scope="row">Data de Início:</th>
                          <td>{classData.startDate}</td>
                          <th scope="row">Data de Término:</th>
                          <td>{classData.endDate}</td>
                        </tr>
                        <tr>
                          <th scope="row">Horário:</th>
                          <td colSpan="3">{classData.schedule}</td>
                        </tr>
                        <tr>
                          <th scope="row">Descrição:</th>
                          <td colSpan="3">{classData.description}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="card-title mb-0">Alunos Matriculados</h4>
                    <Button
                      color="primary"
                      onClick={toggleAddStudentModal}
                    >
                      Adicionar Alunos
                    </Button>
                  </div>

                  <div className="table-responsive">
                    <Table className="table-centered table-nowrap mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Nome do Aluno</th>
                          <th>Idade</th>
                          <th>Matrícula</th>
                          <th>Status</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student) => (
                          <tr key={student.id}>
                            <td>{student.id}</td>
                            <td>{student.name}</td>
                            <td>{student.age}</td>
                            <td>{student.enrollment}</td>
                            <td>
                              <span className={`badge bg-${student.status === 'Ativo' ? 'success' : 'danger'}`}>
                                {student.status}
                              </span>
                            </td>
                            <td>
                              <Button
                                color="info"
                                size="sm"
                                className="me-2"
                                onClick={() => {
                                  window.location.href = `/student-profile/${student.id}`;
                                }}
                              >
                                Ver Perfil
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Modal para adicionar alunos */}
          <Modal isOpen={addStudentModal} toggle={toggleAddStudentModal} size="lg">
            <ModalHeader toggle={toggleAddStudentModal}>Adicionar Alunos à Turma</ModalHeader>
            <ModalBody>
              <Form>
                <FormGroup>
                  <Label for="enrollment">Pesquisar por Matrícula ou Nome</Label>
                  <Input
                    type="text"
                    name="enrollment"
                    id="enrollment"
                    value={searchEnrollment}
                    onChange={(e) => setSearchEnrollment(e.target.value)}
                    placeholder="Digite a matrícula ou nome do aluno"
                  />
                </FormGroup>

                {/* Lista de alunos filtrados */}
                {filteredStudents.length > 0 && (
                  <div className="mt-3 border rounded p-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {filteredStudents.map(student => (
                      <div 
                        key={student.id}
                        className="d-flex justify-content-between align-items-center p-2 border-bottom cursor-pointer hover-bg-light"
                        onClick={() => handleSelectStudent(student)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div>
                          <strong>{student.name}</strong> - Matrícula: {student.enrollment}
                        </div>
                        <Button color="primary" size="sm">
                          Adicionar
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Lista de alunos selecionados */}
                {selectedStudents.length > 0 && (
                  <div className="mt-4">
                    <h5>Alunos Selecionados:</h5>
                    <div className="border rounded p-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      {selectedStudents.map(student => (
                        <div 
                          key={student.id}
                          className="d-flex justify-content-between align-items-center p-2 border-bottom"
                        >
                          <div>
                            <strong>{student.name}</strong> - Matrícula: {student.enrollment}
                          </div>
                          <Button
                            color="danger"
                            size="sm"
                            onClick={() => handleRemoveSelected(student.id)}
                          >
                            Remover
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={toggleAddStudentModal}>
                Cancelar
              </Button>
              <Button 
                color="primary" 
                onClick={handleAddStudents}
                disabled={selectedStudents.length === 0}
              >
                Adicionar {selectedStudents.length} Aluno(s)
              </Button>
            </ModalFooter>
          </Modal>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ViewClass;
