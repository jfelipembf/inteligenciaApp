import React from "react";
import { Row, Col, Card, CardBody } from "reactstrap";
import { Bar } from "react-chartjs-2";
import { performanceChartData, attendanceData } from "./data";

const PerformanceTab = () => {
  // Opções para os gráficos
  const barOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        ticks: {
          callback: function(value) {
            return value.toFixed(1);
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Média: ${context.raw.toFixed(1)}`;
          }
        }
      }
    },
    maintainAspectRatio: false
  };

  const attendanceOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Frequência: ${context.raw}%`;
          }
        }
      }
    },
    maintainAspectRatio: false
  };

  return (
    <React.Fragment>
      <Row>
        <Col lg={6}>
          <Card>
            <CardBody>
              <h4 className="card-title mb-4">Desempenho por Turma</h4>
              <div style={{ height: "300px" }}>
                <Bar data={performanceChartData} options={barOptions} />
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col lg={6}>
          <Card>
            <CardBody>
              <h4 className="card-title mb-4">Frequência por Turma</h4>
              <div style={{ height: "300px" }}>
                <Bar data={attendanceData} options={attendanceOptions} />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <Card>
            <CardBody>
              <h4 className="card-title mb-4">Resumo de Desempenho</h4>
              
              <div className="table-responsive">
                <table className="table table-centered table-nowrap mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Turma</th>
                      <th>Média da Turma</th>
                      <th>Frequência</th>
                      <th>Alunos Aprovados</th>
                      <th>Alunos em Recuperação</th>
                      <th>Alunos Reprovados</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>9º Ano A</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="progress progress-sm mx-3" style={{ width: "100px" }}>
                            <div className="progress-bar bg-success" role="progressbar" style={{ width: "78%" }} aria-valuenow="78" aria-valuemin="0" aria-valuemax="100"></div>
                          </div>
                          <div>7.8</div>
                        </div>
                      </td>
                      <td>95%</td>
                      <td>18</td>
                      <td>5</td>
                      <td>2</td>
                    </tr>
                    <tr>
                      <td>9º Ano B</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="progress progress-sm mx-3" style={{ width: "100px" }}>
                            <div className="progress-bar bg-success" role="progressbar" style={{ width: "82%" }} aria-valuenow="82" aria-valuemin="0" aria-valuemax="100"></div>
                          </div>
                          <div>8.2</div>
                        </div>
                      </td>
                      <td>92%</td>
                      <td>20</td>
                      <td>3</td>
                      <td>2</td>
                    </tr>
                    <tr>
                      <td>8º Ano A</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="progress progress-sm mx-3" style={{ width: "100px" }}>
                            <div className="progress-bar bg-warning" role="progressbar" style={{ width: "75%" }} aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                          </div>
                          <div>7.5</div>
                        </div>
                      </td>
                      <td>88%</td>
                      <td>15</td>
                      <td>7</td>
                      <td>3</td>
                    </tr>
                    <tr>
                      <td>7º Ano C</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="progress progress-sm mx-3" style={{ width: "100px" }}>
                            <div className="progress-bar bg-success" role="progressbar" style={{ width: "80%" }} aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
                          </div>
                          <div>8.0</div>
                        </div>
                      </td>
                      <td>90%</td>
                      <td>17</td>
                      <td>6</td>
                      <td>2</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default PerformanceTab;
