import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Badge,
  Form,
  FormGroup,
  Label,
  Input,
  Spinner,
} from "reactstrap";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import { getFirebaseBackend } from "../../../helpers/firebase_helper";

const Caixa = () => {
  document.title = "Caixa | InteliTec";
  
  const [loading, setLoading] = useState(true);
  const [caixaAberto, setCaixaAberto] = useState(false);
  const [dadosCaixa, setDadosCaixa] = useState({
    dataAbertura: null,
    valorInicial: 0,
    valorFinal: 0,
    operador: "",
    status: "fechado",
    movimentacoes: []
  });

  useEffect(() => {
    const verificarCaixa = async () => {
      setLoading(true);
      try {
        const caixaRef = await getFirebaseBackend().verificarCaixa();
        if (caixaRef) {
          setDadosCaixa(caixaRef);
          setCaixaAberto(caixaRef.status === "aberto");
        }
      } catch (error) {
        console.error("Erro ao verificar caixa:", error);
      } finally {
        setTimeout(() => setLoading(false), 1000);
      }
    };

    verificarCaixa();
  }, []);

  const handleAbrirCaixa = async (e) => {
    e.preventDefault();
    try {
      const dados = {
        valorInicial: parseFloat(e.target.valorInicial.value),
        operador: e.target.operador.value,
        dataAbertura: new Date(),
        status: "aberto"
      };
      await getFirebaseBackend().abrirCaixa(dados);
      setDadosCaixa(dados);
      setCaixaAberto(true);
    } catch (error) {
      console.error("Erro ao abrir caixa:", error);
    }
  };

  const handleFecharCaixa = async (e) => {
    e.preventDefault();
    try {
      const dados = {
        ...dadosCaixa,
        valorFinal: parseFloat(e.target.valorFinal.value),
        observacoes: e.target.observacoes.value,
        dataFechamento: new Date(),
        status: "fechado"
      };
      await getFirebaseBackend().fecharCaixa(dados);
      setDadosCaixa(dados);
      setCaixaAberto(false);
    } catch (error) {
      console.error("Erro ao fechar caixa:", error);
    }
  };

  if (loading) {
    return (
      <div className="page-content">
        <Container fluid>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
            <div className="text-center">
              <Spinner style={{ width: '3rem', height: '3rem' }} color="primary">
                Loading...
              </Spinner>
              <div className="mt-3">
                <p className="text-muted mb-0">Carregando dados...</p>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Financeiro" breadcrumbItem="Caixa" />
          
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="card-title">Controle de Caixa</h4>
                    <Badge color={caixaAberto ? "success" : "danger"} className="font-size-14 p-2">
                      {caixaAberto ? "Caixa Aberto" : "Caixa Fechado"}
                    </Badge>
                  </div>

                  {!caixaAberto ? (
                    <Card>
                      <CardBody>
                        <h5 className="card-title mb-4">Abertura de Caixa</h5>
                        <Form onSubmit={handleAbrirCaixa}>
                          <Row>
                            <Col md={6}>
                              <FormGroup>
                                <Label>Valor Inicial (R$)</Label>
                                <Input
                                  type="number"
                                  name="valorInicial"
                                  step="0.01"
                                  required
                                  placeholder="0,00"
                                />
                              </FormGroup>
                            </Col>
                            <Col md={6}>
                              <FormGroup>
                                <Label>Operador</Label>
                                <Input
                                  type="text"
                                  name="operador"
                                  required
                                  placeholder="Nome do operador"
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <div className="text-end mt-4">
                            <Button color="success" type="submit">
                              <i className="bx bx-check-circle me-1"></i> Abrir Caixa
                            </Button>
                          </div>
                        </Form>
                      </CardBody>
                    </Card>
                  ) : (
                    <>
                      <Card className="mb-4">
                        <CardBody>
                          <h5 className="card-title mb-3">Informações do Caixa</h5>
                          <Row>
                            <Col md={3}>
                              <p className="mb-2"><strong>Data de Abertura:</strong></p>
                              <p>{new Date(dadosCaixa.dataAbertura).toLocaleDateString()}</p>
                            </Col>
                            <Col md={3}>
                              <p className="mb-2"><strong>Hora de Abertura:</strong></p>
                              <p>{new Date(dadosCaixa.dataAbertura).toLocaleTimeString()}</p>
                            </Col>
                            <Col md={3}>
                              <p className="mb-2"><strong>Valor Inicial:</strong></p>
                              <p>R$ {dadosCaixa.valorInicial.toFixed(2)}</p>
                            </Col>
                            <Col md={3}>
                              <p className="mb-2"><strong>Operador:</strong></p>
                              <p>{dadosCaixa.operador}</p>
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>

                      <Card>
                        <CardBody>
                          <h5 className="card-title mb-4">Fechamento de Caixa</h5>
                          <Form onSubmit={handleFecharCaixa}>
                            <Row>
                              <Col md={6}>
                                <FormGroup>
                                  <Label>Valor em Caixa (R$)</Label>
                                  <Input
                                    type="number"
                                    name="valorFinal"
                                    step="0.01"
                                    required
                                    placeholder="0,00"
                                  />
                                </FormGroup>
                              </Col>
                              <Col md={6}>
                                <FormGroup>
                                  <Label>Observações</Label>
                                  <Input
                                    type="textarea"
                                    name="observacoes"
                                    placeholder="Observações sobre o fechamento"
                                    rows="3"
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                            <div className="text-end mt-4">
                              <Button color="danger" type="submit">
                                <i className="bx bx-lock me-1"></i> Fechar Caixa
                              </Button>
                            </div>
                          </Form>
                        </CardBody>
                      </Card>
                    </>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Caixa; 