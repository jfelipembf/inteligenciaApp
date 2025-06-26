import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  FormGroup,
  Label,
  Input,
  Alert,
  InputGroup
} from "reactstrap";

const GradesModal = ({ isOpen, toggle, turma, categoria, aula, professor, horario, diaSemana }) => {
  // Estado para armazenar a lista de alunos
  const [alunos, setAlunos] = useState([]);
  // Estado para armazenar as notas
  const [notas, setNotas] = useState({});
  // Estado para mensagem de sucesso
  const [showSuccess, setShowSuccess] = useState(false);
  // Estado para ano letivo
  const [anoLetivo, setAnoLetivo] = useState(new Date().getFullYear().toString());

  // Dados fictícios de alunos para demonstração
  useEffect(() => {
    // Em um cenário real, você buscaria os alunos da turma de uma API
    const alunosFicticios = [
      { id: 1, nome: "Ana Silva", matricula: "2023001" },
      { id: 2, nome: "Bruno Santos", matricula: "2023002" },
      { id: 3, nome: "Carla Oliveira", matricula: "2023003" },
      { id: 4, nome: "Daniel Pereira", matricula: "2023004" },
      { id: 5, nome: "Eduarda Costa", matricula: "2023005" },
      { id: 6, nome: "Felipe Souza", matricula: "2023006" },
      { id: 7, nome: "Gabriela Lima", matricula: "2023007" },
      { id: 8, nome: "Henrique Martins", matricula: "2023008" },
      { id: 9, nome: "Isabela Ferreira", matricula: "2023009" },
      { id: 10, nome: "João Rodrigues", matricula: "2023010" },
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
  }, [turma]);

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
    
    // Calcular a média apenas das notas preenchidas
    const soma = valores.reduce((acc, curr) => acc + curr, 0);
    return (soma / notasPreenchidas).toFixed(1);
  };

  // Função para determinar o status do aluno
  const getStatusAluno = (media) => {
    if (media === "-") return { text: "Pendente", color: "secondary" };
    const mediaNum = parseFloat(media);
    if (mediaNum >= 7) return { text: "Aprovado", color: "success" };
    if (mediaNum >= 5) return { text: "Recuperação", color: "warning" };
    return { text: "Reprovado", color: "danger" };
  };

  // Função para salvar as notas
  const salvarNotas = () => {
    // Em um cenário real, você enviaria os dados para uma API
    console.log("Dados de notas:", {
      turma,
      categoria,
      aula,
      professor,
      anoLetivo,
      notas
    });
    
    // Mostra mensagem de sucesso
    setShowSuccess(true);
    
    // Esconde a mensagem após 3 segundos
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle} className="bg-dark text-white">
        <i className="mdi mdi-book-education-outline me-2"></i>
        Registro de Notas - {aula}
      </ModalHeader>
      <ModalBody>
        {showSuccess && (
          <Alert color="success" className="mb-4">
            Notas registradas com sucesso!
          </Alert>
        )}
        
        <div className="mb-4">
          <h5>Detalhes da Disciplina</h5>
          <div className="row">
            <div className="col-md-6">
              <p><strong>Turma:</strong> {turma}</p>
              <p><strong>Disciplina:</strong> {aula}</p>
              <p><strong>Professor:</strong> {professor}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Horário:</strong> {horario}</p>
              <p><strong>Dia:</strong> {diaSemana}</p>
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
        <Button color="secondary" onClick={toggle}>
          Cancelar
        </Button>
        <Button color="dark" className="text-white" onClick={salvarNotas}>
          Salvar Notas
        </Button>
      </ModalFooter>
    </Modal>
  );
};

GradesModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  turma: PropTypes.string,
  categoria: PropTypes.string,
  aula: PropTypes.string,
  professor: PropTypes.string,
  horario: PropTypes.string,
  diaSemana: PropTypes.string
};

export default GradesModal;
