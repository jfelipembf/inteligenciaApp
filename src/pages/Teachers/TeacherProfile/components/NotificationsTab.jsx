import React from "react";
import { Row, Col, Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import { teacherData } from "./data";

const NotificationsTab = () => {
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

  return (
    <React.Fragment>
      <Card>
        <CardBody>
          <h4 className="card-title mb-4">Atividades Recentes</h4>
          <ul className="verti-timeline list-unstyled">
            {teacherData.activities.map((activity, index) => (
              <li key={index} className="event-list">
                <div className="event-timeline-dot">
                  <i className={`bx ${activity.status === "completed" ? "bx-check-circle" : "bx-right-arrow-circle"} font-size-18 ${activity.status === "completed" ? "text-success" : "text-primary"}`}></i>
                </div>
                <div className="d-flex">
                  <div className="me-3">
                    <h5 className="font-size-14 mb-1">{activity.type}</h5>
                    <p className="text-muted">{formatDate(activity.date)}</p>
                  </div>
                  <div className="flex-grow-1">
                    <div>
                      {activity.description}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="text-center mt-4">
            <Link to="#" className="btn btn-primary waves-effect waves-light btn-sm">
              Ver Mais <i className="mdi mdi-arrow-right ms-1"></i>
            </Link>
          </div>
        </CardBody>
      </Card>
      
      <Card>
        <CardBody>
          <h4 className="card-title mb-4">Mensagens</h4>
          <div className="table-responsive">
            <table className="table table-centered table-nowrap mb-0">
              <thead className="table-light">
                <tr>
                  <th>Data</th>
                  <th>Remetente</th>
                  <th>Assunto</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>10/03/2025</td>
                  <td>Coordenação Pedagógica</td>
                  <td>Reunião de Planejamento</td>
                  <td>
                    <span className="badge bg-success font-size-12">Lida</span>
                  </td>
                  <td>
                    <div className="d-flex gap-3">
                      <a href="#" className="text-primary">
                        <i className="mdi mdi-eye font-size-18"></i>
                      </a>
                      <a href="#" className="text-danger">
                        <i className="mdi mdi-trash-can font-size-18"></i>
                      </a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>08/03/2025</td>
                  <td>Direção</td>
                  <td>Cronograma de Avaliações</td>
                  <td>
                    <span className="badge bg-success font-size-12">Lida</span>
                  </td>
                  <td>
                    <div className="d-flex gap-3">
                      <a href="#" className="text-primary">
                        <i className="mdi mdi-eye font-size-18"></i>
                      </a>
                      <a href="#" className="text-danger">
                        <i className="mdi mdi-trash-can font-size-18"></i>
                      </a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>05/03/2025</td>
                  <td>Sistema</td>
                  <td>Notas do 1º Bimestre</td>
                  <td>
                    <span className="badge bg-warning font-size-12">Não lida</span>
                  </td>
                  <td>
                    <div className="d-flex gap-3">
                      <a href="#" className="text-primary">
                        <i className="mdi mdi-eye font-size-18"></i>
                      </a>
                      <a href="#" className="text-danger">
                        <i className="mdi mdi-trash-can font-size-18"></i>
                      </a>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text-center mt-4">
            <Link to="#" className="btn btn-primary waves-effect waves-light btn-sm">
              Ver Todas as Mensagens <i className="mdi mdi-arrow-right ms-1"></i>
            </Link>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default NotificationsTab;
