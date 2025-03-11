import React from "react";
import { Card, CardBody, Col, Row } from "reactstrap";

const Messages = () => {
  const messages = [
    {
      id: 1,
      title: "Reunião de Pais",
      content: "Reunião marcada para próxima semana",
      date: "2024-03-20",
      status: "read"
    },
    // ... outras mensagens
  ];

  return (
    <React.Fragment>
      <Row>
        <Col lg={12}>
          <Card>
            <CardBody>
              <h4 className="card-title mb-4">Mensagens</h4>
              {/* Renderizar mensagens aqui */}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Messages; 