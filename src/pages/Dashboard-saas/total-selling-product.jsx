import React, { useState } from "react";
import { Col, Card, CardBody, Table } from "reactstrap";
import ReactApexChart from "react-apexcharts";

const TotalSellngProduct = () => {
  // Dados fictícios para planos de assinatura
  const initialSellingData = [
    {
      id: 1,
      name: "Plano Premium",
      desc: "Acesso completo a todas as funcionalidades",
      value: 85,
      price: "R$ 999,90",
      schools: 12
    },
    {
      id: 2,
      name: "Plano Standard",
      desc: "Funcionalidades essenciais para gestão escolar",
      value: 65,
      price: "R$ 599,90",
      schools: 28
    },
    {
      id: 3,
      name: "Plano Básico",
      desc: "Funcionalidades básicas para começar",
      value: 45,
      price: "R$ 299,90",
      schools: 15
    }
  ];

  const [sellingData, setSellingData] = useState(initialSellingData);
  const [selectedMonth, setSelectedMonth] = useState("jan");

  const getChartOptions = index => {
    var options = {
      chart: { sparkline: { enabled: !0 } },
      dataLabels: { enabled: !1 },
      colors: ["#556ee6"],
      plotOptions: {
        radialBar: {
          hollow: { margin: 0, size: "60%" },
          track: { margin: 0 },
          dataLabels: { show: !1 },
        },
      },
    };
    switch (index) {
      case 1:
        options["colors"][0] = "#34c38f"; // Verde para Premium
        break;
      case 2:
        options["colors"][0] = "#556ee6"; // Azul para Standard
        break;
      case 3:
        options["colors"][0] = "#f1b44c"; // Amarelo para Básico
        break;
      default:
        break;
    }
    return options;
  };

  const onChangeMonth = value => {
    setSelectedMonth(value);
  };

  // Calcular total de receita mensal
  const totalRevenue = sellingData.reduce((acc, plan) => {
    return acc + (parseFloat(plan.price.replace('R$ ', '').replace(',', '.')) * plan.schools);
  }, 0);

  return (
    <React.Fragment>
      <Col xl="4">
        <Card>
          <CardBody>
            <div className="clearfix">
              <div className="float-end">
                <div className="input-group input-group-sm">
                  <select
                    className="form-select form-select-sm"
                    value={selectedMonth}
                    onChange={e => onChangeMonth(e.target.value)}
                  >
                    <option value="jan">Janeiro</option>
                    <option value="dec">Dezembro</option>
                    <option value="nov">Novembro</option>
                    <option value="oct">Outubro</option>
                  </select>
                  <label className="input-group-text">Mês</label>
                </div>
              </div>
              <h4 className="card-title mb-4">Desempenho dos Planos</h4>
            </div>

            <div className="text-muted text-center">
              <p className="mb-2">Receita Mensal Total</p>
              <h4>R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h4>
              <p className="mt-4 mb-0">
                <span className="badge badge-soft-success font-size-11 me-2">
                  +12.5% <i className="mdi mdi-arrow-up" />
                </span>
                Em relação ao mês anterior
              </p>
            </div>

            <div className="table-responsive mt-4">
              <Table className="table align-middle mb-0">
                <tbody>
                  {sellingData.map((data, key) => {
                    const options = getChartOptions(key + 1);
                    return (
                      <tr key={key}>
                        <td>
                          <h5 className="font-size-14 mb-1">{data.name}</h5>
                          <p className="text-muted mb-0">{data.desc}</p>
                        </td>
                        <td>
                          <div id={`radialchart-${key}`}>
                            <ReactApexChart
                              options={options}
                              series={[data.value]}
                              type="radialBar"
                              height={60}
                              width={60}
                              className="apex-charts"
                            />
                          </div>
                        </td>
                        <td>
                          <p className="text-muted mb-1">Escolas Ativas</p>
                          <h5 className="mb-0">{data.schools}</h5>
                          <p className="text-muted mb-0">{data.price}/mês</p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default TotalSellngProduct;
