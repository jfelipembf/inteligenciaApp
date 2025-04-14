import React, { useState } from "react"
import {
  Col,
  Card,
  CardBody,
  Nav,
  NavItem,
  NavLink,
  Table,
  Input,
  Label,
  CardFooter,
} from "reactstrap"
import { Link } from "react-router-dom"
import classnames from "classnames"

//Simple bar
import SimpleBar from "simplebar-react"

const Tasks = () => {
  const [activeTab, setActiveTab] = useState("1")

  // Dados fictícios de tarefas
  const tasksData = [
    {
      id: 1,
      task: "Implementar módulo de boletim online",
      assignedTo: "Equipe Dev",
      priority: "Alta",
      status: "Em Andamento"
    },
    {
      id: 2,
      task: "Atualizar sistema de mensagens",
      assignedTo: "Time Frontend",
      priority: "Média",
      status: "Em Andamento"
    },
    {
      id: 3,
      task: "Integrar API de pagamentos",
      assignedTo: "Time Backend",
      priority: "Alta",
      status: "Em Andamento"
    },
    {
      id: 4,
      task: "Treinamento para novas escolas",
      assignedTo: "Equipe Suporte",
      priority: "Média",
      status: "Próxima"
    },
    {
      id: 5,
      task: "Otimizar performance do app",
      assignedTo: "Equipe Dev",
      priority: "Alta",
      status: "Próxima"
    },
    {
      id: 6,
      task: "Implementar relatórios avançados",
      assignedTo: "Time BI",
      priority: "Média",
      status: "Próxima"
    }
  ];

  const toggleTab = tab => {
    if (activeTab !== tab) {
      setActiveTab(tab)
    }
  }

  return (
    <React.Fragment>
      <Col xl="4">
        <Card>
          <CardBody>
            <h4 className="card-title mb-4">Tarefas</h4>
            <Nav pills className="bg-light rounded">
              <NavItem>
                <NavLink 
                  className={classnames({ active: activeTab === "1" })} 
                  onClick={() => { toggleTab("1") }}
                >
                  Em Andamento
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink 
                  className={classnames({ active: activeTab === "2" })} 
                  onClick={() => { toggleTab("2") }}
                >
                  Próximas
                </NavLink>
              </NavItem>
            </Nav>

            <div className="mt-4">
              <SimpleBar style={{ maxHeight: "250px" }}>
                <div className="table-responsive">
                  <Table className="table table-nowrap align-middle table-hover mb-0">
                    <tbody>
                      {tasksData
                        .filter(item => 
                          activeTab === "1" 
                            ? item.status === "Em Andamento"
                            : item.status === "Próxima"
                        )
                        .map((item, index) => (
                          <tr key={index}>
                            <td style={{ width: "50px" }}>
                              <div className="form-check">
                                <Input 
                                  type="checkbox" 
                                  className="form-check-input" 
                                  id={`task-${item.id}`} 
                                />
                                <Label 
                                  className="form-check-label" 
                                  htmlFor={`task-${item.id}`}
                                />
                              </div>
                            </td>
                            <td>
                              <h5 className="text-truncate font-size-14 mb-1">
                                <Link to="#" className="text-dark">
                                  {item.task}
                                </Link>
                              </h5>
                              <p className="text-muted mb-0">
                                Responsável: {item.assignedTo}
                                <span className={`badge badge-soft-${
                                  item.priority === "Alta" ? "danger" : "warning"
                                } ms-2`}>
                                  {item.priority}
                                </span>
                              </p>
                            </td>
                            <td style={{ width: "90px" }}>
                              <div>
                                <ul className="list-inline mb-0 font-size-16">
                                  <li className="list-inline-item">
                                    <Link to="#" className="text-success p-1">
                                      <i className="bx bxs-edit-alt" />
                                    </Link>
                                  </li>
                                  <li className="list-inline-item">
                                    <Link to="#" className="text-danger p-1">
                                      <i className="bx bxs-trash" />
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </Table>
                </div>
              </SimpleBar>
            </div>
          </CardBody>

          <CardFooter className="bg-transparent border-top">
            <div className="text-center">
              <Link to="#" className="btn btn-primary">
                Adicionar Nova Tarefa
              </Link>
            </div>
          </CardFooter>
        </Card>
      </Col>
    </React.Fragment>
  )
}

export default Tasks
