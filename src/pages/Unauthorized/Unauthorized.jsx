import React from "react";
import { Container, Row, Col, Button, Card, CardBody } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import unauthorizedImg from "../../assets/images/unauthorized.png";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="Acesso Negado" breadcrumbItem="Não autorizado" />
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="text-center">
              <CardBody>
                <div className="mb-4">
                  <img
                    src={unauthorizedImg}
                    alt="Não autorizado"
                    style={{
                      maxWidth: 220,
                      marginBottom: 18,
                      userSelect: "none",
                      pointerEvents: "none",
                    }}
                    draggable={false}
                  />
                </div>
                <h3 className="mb-3">Acesso não autorizado</h3>
                <p className="text-muted mb-4">
                  Você não tem permissão para acessar esta página.
                </p>
                <Button
                  color="primary"
                  onClick={() => navigate("/home")}
                  className="me-2"
                >
                  <i className="bx bx-home-alt me-1"></i> Ir para Página Inicial
                </Button>
                <Link to="/">
                  <Button color="secondary" outline>
                    <i className="bx bx-arrow-back me-1"></i> Voltar
                  </Button>
                </Link>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Unauthorized;
