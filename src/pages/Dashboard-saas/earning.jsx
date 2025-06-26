import React, { useState } from "react";
import { Row, Col, Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import ReactApexChart from "react-apexcharts";
import getChartColorsArray from "../../components/Common/ChartsDynamicColor";

const Earning = ({ dataColors }) => {
  const apexlineColors = getChartColorsArray(dataColors);
  const [selectedMonth, setSelectedMonth] = useState("jan");

  // Dados fictícios de faturamento mensal
  const earningData = {
    jan: [42500, 47800, 45200, 51300, 52900, 58200, 55400, 56800, 59100, 62400, 65200, 68500],
    dec: [41200, 43500, 44800, 46700, 48900, 51200, 52800, 54500, 56700, 58900, 61200, 63500],
    nov: [39800, 42100, 43400, 45600, 47800, 49100, 50700, 52400, 54600, 56800, 59100, 61400],
    oct: [38500, 40800, 42100, 44300, 46500, 47800, 49400, 51100, 53300, 55500, 57800, 60100]
  };

  const options = {
    chart: {
      toolbar: "false",
      dropShadow: {
        enabled: true,
        color: "#000",
        top: 18,
        left: 7,
        blur: 8,
        opacity: 0.2,
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: apexlineColors,
    stroke: {
      curve: "smooth",
      width: 3,
    },
    xaxis: {
      categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      title: {
        text: 'Dia do Mês'
      }
    },
    yaxis: {
      title: {
        text: 'Faturamento (R$)'
      }
    }
  };

  const series = [
    {
      name: "Faturamento Diário",
      data: earningData[selectedMonth],
    },
  ];

  const onChangeMonth = (value) => {
    setSelectedMonth(value);
  };

  return (
    <React.Fragment>
      <Col xl="8">
        <Card>
          <CardBody>
            <div className="clearfix">
              <div className="float-end">
                <div className="input-group input-group-sm">
                  <select
                    className="form-select form-select-sm"
                    value={selectedMonth}
                    onChange={(e) => onChangeMonth(e.target.value)}
                  >
                    <option value="jan">Janeiro</option>
                    <option value="dec">Dezembro</option>
                    <option value="nov">Novembro</option>
                    <option value="oct">Outubro</option>
                  </select>
                  <label className="input-group-text">Mês</label>
                </div>
              </div>
              <h4 className="card-title mb-4">Faturamento</h4>
            </div>

            <Row>
              <Col lg="4">
                <div className="text-muted">
                  <div className="mb-4">
                    <p>Este mês</p>
                    <h4>R$ 68.500,00</h4>
                    <div>
                      <span className="badge badge-soft-success font-size-12 me-1">
                        + 12.5%
                      </span>
                      Em relação ao período anterior
                    </div>
                  </div>

                  <div>
                    <Link to="#" className="btn btn-primary btn-sm">
                      Ver Detalhes
                      <i className="mdi mdi-chevron-right ms-1"></i>
                    </Link>
                  </div>

                  <div className="mt-4">
                    <p className="mb-2">Mês anterior</p>
                    <h5>R$ 60.850,00</h5>
                  </div>
                </div>
              </Col>

              <Col lg="8">
                <div id="line-chart" dir="ltr">
                  <ReactApexChart
                    series={series}
                    options={options}
                    type="line"
                    height={320}
                    className="apex-charts"
                  />
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default Earning;
