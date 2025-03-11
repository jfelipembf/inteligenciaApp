import React from "react";
import { Row, Col, Card, CardBody, Table, Badge } from "reactstrap";
import { Link } from "react-router-dom";

const FinancialTab = () => {
  const financialData = {
    tuition: {
      amount: "R$ 1.200,00",
      status: "paid",
      dueDate: "05/03/2025",
    },
    payments: [
      {
        id: 1,
        description: "Mensalidade - Março",
        amount: "R$ 1.200,00",
        date: "01/03/2025",
        status: "paid",
      },
      {
        id: 2,
        description: "Mensalidade - Fevereiro",
        amount: "R$ 1.200,00",
        date: "01/02/2025",
        status: "paid",
      },
      {
        id: 3,
        description: "Mensalidade - Janeiro",
        amount: "R$ 1.200,00",
        date: "01/01/2025",
        status: "paid",
      },
      {
        id: 4,
        description: "Taxa de Excursão Escolar",
        amount: "R$ 350,00",
        date: "15/02/2025",
        status: "paid",
      },
      {
        id: 5,
        description: "Taxa de Materiais de Laboratório",
        amount: "R$ 180,00",
        date: "10/01/2025",
        status: "paid",
      },
    ],
    pendingPayments: [
      {
        id: 1,
        description: "Mensalidade - Abril",
        amount: "R$ 1.200,00",
        dueDate: "05/04/2025",
        status: "pending",
      },
      {
        id: 2,
        description: "Taxa de Formatura",
        amount: "R$ 500,00",
        dueDate: "15/05/2025",
        status: "pending",
      },
    ],
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return <Badge color="success">Pago</Badge>;
      case "pending":
        return <Badge color="warning">Pendente</Badge>;
      case "overdue":
        return <Badge color="danger">Atrasado</Badge>;
      default:
        return <Badge color="secondary">Desconhecido</Badge>;
    }
  };

  return (
    <React.Fragment>
      <Row>
        <Col lg={6}>
          <Card>
            <CardBody>
              <h4 className="card-title mb-4">Mensalidade Atual</h4>
              <div className="table-responsive">
                <Table className="table-nowrap mb-0">
                  <tbody>
                    <tr>
                      <th scope="row">Valor:</th>
                      <td>{financialData.tuition.amount}</td>
                    </tr>
                    <tr>
                      <th scope="row">Status:</th>
                      <td>{getStatusBadge(financialData.tuition.status)}</td>
                    </tr>
                    <tr>
                      <th scope="row">Data de Vencimento:</th>
                      <td>{financialData.tuition.dueDate}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
              <div className="mt-4">
                <Link to="#" className="btn btn-primary waves-effect waves-light btn-sm">
                  Pay Now <i className="mdi mdi-arrow-right ms-1"></i>
                </Link>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col lg={6}>
          <Card>
            <CardBody>
              <h4 className="card-title mb-4">Pending Payments</h4>
              <div className="table-responsive">
                <Table className="table-nowrap mb-0">
                  <thead>
                    <tr>
                      <th scope="col">Description</th>
                      <th scope="col">Amount</th>
                      <th scope="col">Due Date</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financialData.pendingPayments.map((payment) => (
                      <tr key={payment.id}>
                        <td>{payment.description}</td>
                        <td>{payment.amount}</td>
                        <td>{payment.dueDate}</td>
                        <td>{getStatusBadge(payment.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <Card>
            <CardBody>
              <h4 className="card-title mb-4">Histórico de Pagamentos</h4>
              <div className="table-responsive">
                <Table className="table-nowrap mb-0">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Descrição</th>
                      <th scope="col">Valor</th>
                      <th scope="col">Data</th>
                      <th scope="col">Status</th>
                      <th scope="col">Recibo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financialData.payments.map((payment, index) => (
                      <tr key={payment.id}>
                        <th scope="row">{index + 1}</th>
                        <td>{payment.description}</td>
                        <td>{payment.amount}</td>
                        <td>{payment.date}</td>
                        <td>{getStatusBadge(payment.status)}</td>
                        <td>
                          <Link to="#" className="btn btn-primary btn-sm">
                            <i className="mdi mdi-download"></i>
                          </Link>
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
    </React.Fragment>
  );
};

export default FinancialTab;
