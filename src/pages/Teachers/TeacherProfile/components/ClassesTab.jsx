import React, { useState, useEffect } from "react";
import { Row, Col, Card, CardBody, Table, Badge, Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input, Alert, InputGroup } from "reactstrap";
import { teacherData } from "./data";
import { leftSideBarThemeTypes } from "../../../../constants/layout";

const ClassesTab = () => {
  const [notificationModal, setNotificationModal] = useState(false);
  const [gradesModal, setGradesModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    message: ''
  });
  
  // Estado para armazenar a lista de alunos
  const [alunos, setAlunos] = useState([]);
  // Estado para armazenar as notas
  const [notas, setNotas] = useState({});
  // Estado para mensagem de sucesso
  const [showSuccess, setShowSuccess] = useState(false);
  // Estado para ano letivo
  const [anoLetivo, setAnoLetivo] = useState(new Date().getFullYear().toString());

  const toggleNotificationModal = () => setNotificationModal(!notificationModal);
  const toggleGradesModal = () => setGradesModal(!gradesModal);

  const handleOpenNotificationModal = (classItem) => {
    setSelectedClass(classItem);
    setNotificationModal(true);
  };
  
  const handleOpenGradesModal = (classItem) => {
    setSelectedClass(classItem);
    setGradesModal(true);
    
    // Carregar alunos fictícios para a turma
    const alunosFicticios = [
      { id: 1, nome: "Ana Silva", matricula: "2023001" },
      { id: 2, nome: "Bruno Santos", matricula: "2023002" },
      { id: 3, nome: "Carla Oliveira", matricula: "2023003" },
      { id: 4, nome: "Daniel Pereira", matricula: "2023004" },
      { id: 5, nome: "Eduarda Costa", matricula: "2023005" },
    ];
    
    setAlunos(alunosFicticios);
    
    // Inicializa o estado de notas
    const notasIniciais = {};
    alunosFicticios.forEach(aluno => {
      notasIniciais[aluno.id] = { 
        unidade1: "", 
        unidade2: "", 
        unidade3: "", 
        unidade4: "", 
        observacao: "" 
      };
    });
    setNotas(notasIniciais);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNotificationForm({
      ...notificationForm,
      [name]: value
    });
  };

  const handleSendNotification = () => {
    // Aqui seria implementada a lógica para enviar a notificação
    alert(`Notificação "${notificationForm.title}" enviada para a turma ${selectedClass.class}`);
    setNotificationModal(false);
    // Resetar o formulário
    setNotificationForm({
      title: '',
      message: ''
    });
  };
  
  // Função para atualizar nota de uma unidade
  const handleNotaChange = (alunoId, unidade, valor) => {
    // Validar se o valor é um número entre 0 e 10
    let notaValor = valor;
    if (valor !== "") {
      const num = parseFloat(valor);
      if (isNaN(num) || num < 0 || num > 10) {
        return; // Não atualiza se não for um número válido
      }
      // Formatar para ter no máximo 1 casa decimal
      notaValor = Math.round(num * 10) / 10;
    }

    setNotas(prev => ({
      ...prev,
      [alunoId]: { ...prev[alunoId], [unidade]: notaValor }
    }));
  };

  // Função para adicionar observação
  const handleObservacaoChange = (alunoId, observacao) => {
    setNotas(prev => ({
      ...prev,
      [alunoId]: { ...prev[alunoId], observacao }
    }));
  };

  // Função para calcular a média das notas
  const calcularMedia = (alunoId) => {
    const notasAluno = notas[alunoId];
    if (!notasAluno) return "-";
    
    const valores = [
      parseFloat(notasAluno.unidade1) || 0,
      parseFloat(notasAluno.unidade2) || 0,
      parseFloat(notasAluno.unidade3) || 0,
      parseFloat(notasAluno.unidade4) || 0
    ];
    
    // Contar quantas notas foram preenchidas
    const notasPreenchidas = valores.filter(nota => nota > 0).length;
    if (notasPreenchidas === 0) return "-";
    
    // Calcular a média
    const soma = valores.reduce((acc, curr) => acc + curr, 0);
    return (soma / notasPreenchidas).toFixed(1);
  };

  // Função para determinar o status do aluno com base na média
  const getStatusAluno = (media) => {
    if (media === "-") return { text: "Sem notas", color: "secondary" };
    const mediaNum = parseFloat(media);
    if (mediaNum >= 7) return { text: "Aprovado", color: "success" };
    if (mediaNum >= 5) return { text: "Recuperação", color: "warning" };
    return { text: "Reprovado", color: "danger" };
  };

  // Função para salvar as notas
  const salvarNotas = () => {
    // Aqui seria implementada a lógica para salvar as notas no backend
    setShowSuccess(true);
    
    // Esconde a mensagem após 3 segundos
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };
  return (
    <React.Fragment>
      <Row>
        <Col lg={12}>
          <Card>
            <CardBody>
              <h4 className="card-title mb-4">Horário de Aulas</h4>
              
              <div className="table-responsive">
                <Table className="table-centered table-nowrap mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Dia</th>
                      <th>Horário</th>
                      <th>Turma</th>
                      <th>Disciplina</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teacherData.schedule.map((item, index) => (
                      <tr key={index}>
                        <td>{item.day}</td>
                        <td>{item.time}</td>
                        <td>
                          <Badge color="primary" className="font-size-12">
                            {item.class}
                          </Badge>
                        </td>
                        <td>{item.subject}</td>
                        <td>
                          <div className="d-flex gap-3">
                            <a href="#" className="text-primary" onClick={(e) => { e.preventDefault(); handleOpenGradesModal(item); }}>
                              <i className="mdi mdi-book-education font-size-18"></i>
                            </a>
                            <a href="#" className="text-warning" onClick={(e) => { e.preventDefault(); handleOpenNotificationModal(item); }}>
                              <i className="mdi mdi-bell font-size-18"></i>
                            </a>
                          </div>
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
      {/* Modal de Notificação */}
      <Modal isOpen={notificationModal} toggle={toggleNotificationModal} centered={true} size="lg">
        <ModalHeader toggle={toggleNotificationModal} className="bg-white text-black">
          <i className="mdi mdi-bell-outline me-2"></i>
          Enviar Notificação para a Turma
        </ModalHeader>
        <ModalBody>
          <div className="mb-4 p-3 bg-light rounded">
            <h5>Detalhes da Turma</h5>
            <div className="row">
              <div className="col-md-6">
                <p><strong>Turma:</strong> {selectedClass?.class}</p>
                <p><strong>Disciplina:</strong> {selectedClass?.subject}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Dia:</strong> {selectedClass?.day}</p>
                <p><strong>Horário:</strong> {selectedClass?.time}</p>
              </div>
            </div>
          </div>
          
          <h5>Detalhes da Notificação</h5>
          <Form>
            <FormGroup>
              <Label for="title">Título da Notificação</Label>
              <Input
                type="text"
                name="title"
                id="title"
                placeholder="Digite o título da notificação"
                value={notificationForm.title}
                onChange={handleInputChange}
                className="mb-3"
              />
            </FormGroup>
            <FormGroup>
              <Label for="message">Mensagem</Label>
              <Input
                type="textarea"
                name="message"
                id="message"
                rows="5"
                placeholder="Digite a mensagem da notificação"
                value={notificationForm.message}
                onChange={handleInputChange}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleNotificationModal}>Cancelar</Button>
          <Button color="primary" onClick={handleSendNotification}>Enviar Notificação</Button>
        </ModalFooter>
      </Modal>
      
      {/* Modal de Lançamento de Notas */}
      <Modal isOpen={gradesModal} toggle={toggleGradesModal} size="xl">
        <ModalHeader toggle={toggleGradesModal} className="bg-white text-black">
          <i className="mdi mdi-book-education me-2"></i>
          Registro de Notas - {selectedClass?.subject}
        </ModalHeader>
        <ModalBody>
          {showSuccess && (
            <Alert color="success" className="mb-4">
              Notas registradas com sucesso!
            </Alert>
          )}
          
          <div className="mb-4 p-3 bg-light rounded">
            <h5>Detalhes da Disciplina</h5>
            <div className="row">
              <div className="col-md-6">
                <p><strong>Turma:</strong> {selectedClass?.class}</p>
                <p><strong>Disciplina:</strong> {selectedClass?.subject}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Dia:</strong> {selectedClass?.day}</p>
                <p><strong>Horário:</strong> {selectedClass?.time}</p>
                <FormGroup>
                  <Label for="anoLetivo">Ano Letivo</Label>
                  <Input
                    type="select"
                    id="anoLetivo"
                    value={anoLetivo}
                    onChange={(e) => setAnoLetivo(e.target.value)}
                  >
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                  </Input>
                </FormGroup>
              </div>
            </div>
          </div>
          
          <h5>Registro de Notas</h5>
          <Table responsive bordered hover>
            <thead className="table-light">
              <tr>
                <th style={{ width: "3%" }}>#</th>
                <th style={{ width: "20%" }}>Nome</th>
                <th style={{ width: "10%" }}>Matrícula</th>
                <th style={{ width: "10%" }}>1ª Unidade</th>
                <th style={{ width: "10%" }}>2ª Unidade</th>
                <th style={{ width: "10%" }}>3ª Unidade</th>
                <th style={{ width: "10%" }}>4ª Unidade</th>
                <th style={{ width: "7%" }}>Média</th>
                <th style={{ width: "10%" }}>Status</th>
                <th style={{ width: "10%" }}>Observação</th>
              </tr>
            </thead>
            <tbody>
              {alunos.map((aluno, index) => {
                const media = calcularMedia(aluno.id);
                const status = getStatusAluno(media);
                
                return (
                  <tr key={aluno.id}>
                    <td>{index + 1}</td>
                    <td>{aluno.nome}</td>
                    <td>{aluno.matricula}</td>
                    <td>
                      <Input
                        type="text"
                        placeholder="0-10"
                        value={notas[aluno.id]?.unidade1 || ""}
                        onChange={(e) => handleNotaChange(aluno.id, "unidade1", e.target.value)}
                        className="text-center"
                        maxLength="4"
                      />
                    </td>
                    <td>
                      <Input
                        type="text"
                        placeholder="0-10"
                        value={notas[aluno.id]?.unidade2 || ""}
                        onChange={(e) => handleNotaChange(aluno.id, "unidade2", e.target.value)}
                        className="text-center"
                        maxLength="4"
                      />
                    </td>
                    <td>
                      <Input
                        type="text"
                        placeholder="0-10"
                        value={notas[aluno.id]?.unidade3 || ""}
                        onChange={(e) => handleNotaChange(aluno.id, "unidade3", e.target.value)}
                        className="text-center"
                        maxLength="4"
                      />
                    </td>
                    <td>
                      <Input
                        type="text"
                        placeholder="0-10"
                        value={notas[aluno.id]?.unidade4 || ""}
                        onChange={(e) => handleNotaChange(aluno.id, "unidade4", e.target.value)}
                        className="text-center"
                        maxLength="4"
                      />
                    </td>
                    <td className="text-center fw-bold">{media}</td>
                    <td>
                      <span className={`badge bg-${status.color} rounded-pill`}>
                        {status.text}
                      </span>
                    </td>
                    <td>
                      <Input
                        type="text"
                        placeholder="Observação"
                        value={notas[aluno.id]?.observacao || ""}
                        onChange={(e) => handleObservacaoChange(aluno.id, e.target.value)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleGradesModal}>
            Cancelar
          </Button>
          <Button color="primary" className="text-white" onClick={salvarNotas}>
            Salvar Notas
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default ClassesTab;
                           