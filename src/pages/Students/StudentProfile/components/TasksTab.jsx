import React, { useState } from "react";
import { Row, Col, Card, CardBody, Badge, Button } from "reactstrap";
import { Link } from "react-router-dom";

const TasksTab = () => {
  // Estado para filtrar tarefas
  const [taskFilter, setTaskFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  const tasks = [
    {
      id: 1,
      subject: "Matemática",
      title: "Tarefa de Matemática",
      description: "Completar exercícios 1-10 do Capítulo 5",
      dueDate: "15/03/2025",
      status: "pending",
      priority: "high",
      icon: "mdi-calculator",
      progress: 30
    },
    {
      id: 2,
      subject: "Ciências",
      title: "Projeto de Ciências",
      description: "Preparar apresentação sobre energia renovável",
      dueDate: "20/03/2025",
      status: "in-progress",
      priority: "medium",
      icon: "mdi-flask",
      progress: 60
    },
    {
      id: 3,
      subject: "História",
      title: "Redação de História",
      description: "Escrever uma redação de 500 palavras sobre a Segunda Guerra Mundial",
      dueDate: "18/03/2025",
      status: "pending",
      priority: "high",
      icon: "mdi-book-open-page-variant",
      progress: 0
    },
    {
      id: 4,
      subject: "Português",
      title: "Tarefa de Português",
      description: "Ler capítulos 7-9 e responder às questões",
      dueDate: "25/03/2025",
      status: "completed",
      priority: "low",
      icon: "mdi-book-open-variant",
      progress: 100
    },
    {
      id: 5,
      subject: "Artes",
      title: "Projeto de Artes",
      description: "Criar um autorretrato usando aquarelas",
      dueDate: "30/03/2025",
      status: "in-progress",
      priority: "medium",
      icon: "mdi-palette",
      progress: 45
    },
  ];
  
  // Simplificar filtro para apenas concluído e pendente
  const filteredTasks = tasks.filter(task => {
    // Tratar "in-progress" como "pending"
    const simplifiedStatus = task.status === "completed" ? "completed" : "pending";
    
    if (taskFilter === "all") {
      return true;
    } else if (taskFilter === "completed") {
      return simplifiedStatus === "completed";
    } else if (taskFilter === "pending") {
      return simplifiedStatus === "pending";
    }
    return true;
  });

  const getStatusBadge = (status) => {
    if (status === "completed") {
      return <Badge color="success">Concluído</Badge>;
    } else {
      return <Badge color="warning">Pendente</Badge>;
    }
  };

  // Função de prioridade removida
  
  const getStatusColor = (status) => {
    return status === "completed" ? "success" : "warning";
  };
  
  const getTaskCountByStatus = (status) => {
    return tasks.filter(task => task.status === status).length;
  };

  return (
    <Row>
      <Col lg={12}>
        <Card>
          <CardBody>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="card-title mb-0">Minhas Tarefas</h4>
              <div className="d-flex">
                <Button color={taskFilter === "all" ? "primary" : "light"} size="sm" className="me-2" onClick={() => setTaskFilter("all")}>
                  Todas
                </Button>
                <Button color={taskFilter === "pending" ? "warning" : "light"} size="sm" className="me-2" onClick={() => setTaskFilter("pending")}>
                  Pendentes
                </Button>
                <Button color={taskFilter === "completed" ? "success" : "light"} size="sm" onClick={() => setTaskFilter("completed")}>
                  Concluídas
                </Button>
              </div>
            </div>
            
            <div className="p-2">
              {filteredTasks.length === 0 ? (
                <div className="text-center p-4">

                  <h5>Nenhuma tarefa encontrada</h5>
                  <p className="text-muted">Tente ajustar seus filtros.</p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div key={task.id} className="border-bottom pb-3 mb-3">
                    <div className="d-flex align-items-start">
                      <div className="flex-grow-1">
                        <h5 className="font-size-15 mb-1">
                          <Link to="#" className="text-dark">
                            {task.title}{" "}
                            {getStatusBadge(task.status === "completed" ? "completed" : "pending")}
                          </Link>
                        </h5>
                        <p className="text-muted mb-2">
                          <strong>{task.subject}</strong> - {task.description}
                        </p>
                        <div className="font-size-12 text-muted">
                          Prazo: {task.dueDate}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="text-center mt-4">
              <Link to="#" className="btn btn-primary waves-effect waves-light btn-sm">
                Ver Todas
              </Link>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default TasksTab;
