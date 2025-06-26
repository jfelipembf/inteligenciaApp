import React from "react";
import { Row, Col, Card, CardBody } from "reactstrap";
import { Bar } from "react-chartjs-2";
import { useParams } from "react-router-dom";
import useTeacherProfileStatistics from "../../../../hooks/useTeacherProfileStatistics";

const PerformanceTab = () => {
  const { id } = useParams();
  const { classAverages, attendancePerClass, loading, error } =
    useTeacherProfileStatistics(id);

  const averageLabels = Object.keys(classAverages);
  const averageValues = Object.values(classAverages).map((v) =>
    Number(Number(v).toFixed(1))
  );

  const performanceChartData = {
    labels: averageLabels,
    datasets: [
      {
        label: "Média da Turma",
        backgroundColor: "rgba(52, 195, 143, 0.8)",
        borderColor: "rgba(52, 195, 143, 0.8)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(52, 195, 143, 0.9)",
        hoverBorderColor: "rgba(52, 195, 143, 0.9)",
        data: averageValues,
      },
    ],
  };

  // Opções para os gráficos
  const barOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        ticks: {
          callback: function (value) {
            return value.toFixed(1);
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `Média: ${context.raw.toFixed(1)}`;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  const attendanceLabels = attendancePerClass.map((item) => item.label);
  const attendanceValues = attendancePerClass.map((item) =>
    Number(Number(item.frequencia).toFixed(0))
  );

  const attendanceData = {
    labels: attendanceLabels,
    datasets: [
      {
        label: "Frequência (%)",
        backgroundColor: "rgba(52, 152, 219, 0.8)",
        borderColor: "rgba(52, 152, 219, 0.8)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(52, 152, 219, 0.9)",
        hoverBorderColor: "rgba(52, 152, 219, 0.9)",
        data: attendanceValues,
      },
    ],
  };

  const attendanceOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function (value) {
            return value + "%";
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `Frequência: ${context.raw}%`;
          },
        },
      },
    },
    maintainAspectRatio: false,
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
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(classAverages).map((className) => {
                      const media = Number(
                        Number(classAverages[className]).toFixed(1)
                      );
                      const attendanceObj = attendancePerClass.find(
                        (a) => a.label === className
                      );
                      const frequencia = attendanceObj
                        ? Number(Number(attendanceObj.frequencia).toFixed(0))
                        : 0;

                      return (
                        <tr key={className}>
                          <td>{className}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div
                                className="progress progress-sm mx-3"
                                style={{ width: "100px" }}
                              >
                                <div
                                  className={`progress-bar ${
                                    media >= 7
                                      ? "bg-success"
                                      : media >= 5
                                      ? "bg-warning"
                                      : "bg-danger"
                                  }`}
                                  role="progressbar"
                                  style={{ width: `${(media / 10) * 100}%` }}
                                  aria-valuenow={media}
                                  aria-valuemin="0"
                                  aria-valuemax="10"
                                ></div>
                              </div>
                              <div>{media}</div>
                            </div>
                          </td>
                          <td>{frequencia}%</td>
                        </tr>
                      );
                    })}
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
