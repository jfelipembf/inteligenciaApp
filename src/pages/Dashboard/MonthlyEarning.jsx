import React from "react";

import { Row, Col, Card, CardBody, CardTitle } from "reactstrap";
import { Link } from "react-router-dom";

import ApexRadial from "./ApexRadial";

const MonthlyEarning = () => {
  return (
    <React.Fragment>
      {" "}
      <Card>
        <CardBody>
          <CardTitle className="mb-4">Meta Financeira</CardTitle>
          <Row>
            <Col sm="6">
              <p className="text-muted">Este mês</p>
              <h3>R$ 34.252</h3>
              <p className="text-muted">
                <span className="text-success me-2">
                  {" "}
                  12% <i className="mdi mdi-arrow-up"></i>{" "}
                </span>{" "}
                Do período anterior
              </p>
              <div className="mt-4">
                <Link
                  to=""
                  className="btn btn-primary waves-effect waves-light btn-sm"
                >
                  Ver Mais <i className="mdi mdi-arrow-right ms-1"></i>
                </Link>
              </div>
            </Col>
            <Col sm="6">
              <div className="mt-4 mt-sm-0">
                <ApexRadial dataColors='["--bs-primary"]' />
              </div>
            </Col>
          </Row>
          <p className="text-muted mb-0">
            Acompanhamento das metas financeiras mensais.
          </p>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default MonthlyEarning;
