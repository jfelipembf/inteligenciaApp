import PropTypes from "prop-types"
import React from "react"
import { Col, Card, CardBody, Row } from "reactstrap"

const MiniWidget = () => {
  const reports = [
    {
      icon: "bx bx-group",
      title: "Alunos Ativos",
      value: "12.584",
      badgeValue: "+ 3.5%",
      color: "success",
      desc: "Em relação ao mês anterior",
    },
    {
      icon: "bx bx-building-house",
      title: "Receita Mensal",
      value: "R$ 285.350",
      badgeValue: "+ 8.2%",
      color: "success",
      desc: "Em relação ao mês anterior",
    },
    {
      icon: "bx bx-chart",
      title: "Ticket Médio",
      value: "R$ 5.920",
      badgeValue: "+ 1.2%",
      color: "success",
      desc: "Em relação ao mês anterior",
    },
  ];

  const financialReports = [
    {
      icon: "bx bx-x-circle",
      title: "Cancelamentos",
      value: "23",
      badgeValue: "- 15%",
      color: "success",
      desc: "Em relação ao mês anterior",
    },
    {
      icon: "bx bx-error-circle",
      title: "Inadimplência",
      value: "4.2%",
      badgeValue: "+ 0.8%",
      color: "danger",
      desc: "Em relação ao mês anterior",
    },
    {
      icon: "bx bx-money",
      title: "Despesas",
      value: "R$ 84.250",
      badgeValue: "+ 2.3%",
      color: "warning",
      desc: "Em relação ao mês anterior",
    },
  ];

  const renderCards = (items) => {
    return items.map((report, key) => (
      <Col sm="4" key={key}>
        <Card>
          <CardBody>
            <div className="d-flex align-items-center mb-3">
              <div className="avatar-xs me-3">
                <span className="avatar-title rounded-circle bg-primary-subtle text-primary font-size-18">
                  <i className={report.icon} />
                </span>
              </div>
              <h5 className="font-size-14 mb-0">{report.title}</h5>
            </div>
            <div className="text-muted mt-4">
              <h4>
                {report.value}{" "}
                <i className={`mdi mdi-chevron-${report.color === 'success' ? 'up' : 'down'} ms-1 text-${report.color}`} />
              </h4>
              <div className="d-flex">
                <span className={`badge badge-soft-${report.color} font-size-12`}>
                  {report.badgeValue}
                </span>
                <span className="ms-2 text-truncate">{report.desc}</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    ));
  };

  return (
    <React.Fragment>
      <Row>
        {renderCards(reports)}
      </Row>
      <Row className="mt-3">
        {renderCards(financialReports)}
      </Row>
    </React.Fragment>
  );
};

MiniWidget.propTypes = {
  reports: PropTypes.array,
};

export default MiniWidget;
