import React, { useState } from "react";
import { Row, Col, Card, CardBody, Badge, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Link } from "react-router-dom";
import { teacherData } from "./data";

const NotificationsTab = () => {
  const [taskDetailModal, setTaskDetailModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Função para formatar a data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Função para formatar a data de vencimento (sem hora)
  const formatDueDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric'
    });
  };

  // Função para abrir o modal de detalhes da tarefa
  const openTaskDetail = (task) => {
    setSelectedTask(task);
    setTaskDetailModal(true);
  };

  // Função para fechar o modal
  const toggleTaskDetailModal = () => {
    setTaskDetailModal(!taskDetailModal);
  };

  return (
    <React.Fragment>
      {/* Tarefas Enviadas */}
      <Card>
        <CardBody>
          <h4 className="card-title mb-4">Tarefas Enviadas</h4>
          <div className="table-responsive">
            <table className="table table-centered table-nowrap mb-0">
              <thead className="table-light">
                <tr>
                  <th>Data de Envio</th>
                  <th>Título</th>
                  <th>Tipo</th>
                  <th>Turma</th>
                  <th>Entrega</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {teacherData.sentTasks.map((task) => (
                  <tr key={task.id}>
                    <td>{formatDate(task.date)}</td>
                    <td>{task.title}</td>
                    <td>{task.type}</td>
                    <td>{task.class}</td>
                    <td>{formatDueDate(task.dueDate)}</td>
                    <td>
                      <Badge 
                        color={task.status === "Concluída" ? "success" : "warning"} 
                        className="font-size-12"
                      >
                        {task.status}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-3">
                        <a href="#" className="text-primary" onClick={(e) => { e.preventDefault(); openTaskDetail(task); }}>
                          <i className="mdi mdi-eye font-size-18"></i>
                        </a>
                        <a href="#" className="text-warning">
                          <i className="mdi mdi-pencil font-size-18"></i>
                        </a>
                        <a href="#" className="text-danger">
                          <i className="mdi mdi-trash-can font-size-18"></i>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-center mt-4">
            <Link to="#" className="btn btn-primary waves-effect waves-light btn-sm">
              Ver Todas as Tarefas <i className="mdi mdi-arrow-right ms-1"></i>
            </Link>
          </div>
        </CardBody>
      </Card>

      {/* Modal de Detalhes da Tarefa */}
      <Modal isOpen={taskDetailModal} toggle={toggleTaskDetailModal} centered={true}>
        <ModalHeader toggle={toggleTaskDetailModal} className="bg-primary text-white">
          Detalhes da Tarefa
        </ModalHeader>
        <ModalBody>
          {selectedTask && (
            <div>
              <h5 className="mb-3">{selectedTask.title}</h5>
              <div className="mb-3">
                <strong>Tipo:</strong> {selectedTask.type}
              </div>
              <div className="mb-3">
                <strong>Turma:</strong> {selectedTask.class}
              </div>
              <div className="mb-3">
                <strong>Descrição:</strong> {selectedTask.description}
              </div>
              <div className="mb-3">
                <strong>Data de Envio:</strong> {formatDate(selectedTask.date)}
              </div>
              <div className="mb-3">
                <strong>Data de Entrega:</strong> {formatDueDate(selectedTask.dueDate)}
              </div>
              <div className="mb-3">
                <strong>Status:</strong> 
                <Badge 
                  color={selectedTask.status === "Concluída" ? "success" : "warning"} 
                  className="font-size-12 ms-2"
                >
                  {selectedTask.status}
                </Badge>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleTaskDetailModal}>
            Fechar
          </Button>
          <Button color="primary">
            Editar Tarefa
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default NotificationsTab;
