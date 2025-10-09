import React from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";

const IconTest = () => {
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Icons" breadcrumbItem="Test" />

          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <h4 className="card-title">Teste de Ícones</h4>
                  <p className="card-title-desc mb-2">
                    Este é um componente de teste para verificar se a aplicação
                    está funcionando.
                  </p>

                  <div className="text-center py-4">
                    <p className="text-success">
                      ✅ Componente funcionando corretamente!
                    </p>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default IconTest;
