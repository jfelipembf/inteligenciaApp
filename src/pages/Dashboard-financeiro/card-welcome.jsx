import React from "react"
import { Row, Col, Card } from "reactstrap"

//Import Images
import profileImg from "../../assets/images/profile-img.png"

const CardWelcome = () => {
  return (
    <React.Fragment>
      <Col xl="4">
        <Card className="bg-primary bg-primary-subtle h-98">
          <div className="p-3">
            <Row className="align-items-center">
              <Col xs="7">
                <div className="text-primary py-4">
                  <h5 className="text-primary mb-3 fs-4">Bem-vindo!</h5>
                  <p className="fs-5 mb-4">Painel Administrativo InteliTec</p>

                  <ul className="ps-3 mb-0">
                    <li className="py-1">Gestão Escolar Completa</li>
                    <li className="py-1">Múltiplas Funcionalidades</li>
                    <li className="py-1">Relatórios Detalhados</li>
                    <li className="py-1">Suporte 24/7</li>
                  </ul>
                </div>
              </Col>
              <Col xs="5" className="align-self-end">
                <img src={profileImg} alt="" className="img-fluid" />
              </Col>
            </Row>
          </div>
        </Card>
      </Col>
    </React.Fragment>
  );
}

export default CardWelcome;