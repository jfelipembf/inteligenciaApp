import React, { useState, useEffect } from "react";
import { Container, Row, Col, Spinner } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

//Import Components
import CardUser from "./card-user";
import CardWelcome from "./card-welcome";
import MiniWidget from "./mini-widget";
import Earning from "./earning";
import SalesAnalytics from "./sales-analytics";
import TotalSellingProduct from "./total-selling-product";
import Tasks from "./tasks";

const DashboardFinanceiro = () => {
  const [isLoading, setIsLoading] = useState(true);

  //meta title
  document.title = "Dashboard Financeiro | InteliTec";

  // Simular carregamento de dados
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Aqui você pode adicionar suas chamadas de API reais
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="page-content d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="text-center">
          <Spinner color="primary" className="mb-2">
            Loading...
          </Spinner>
          <p className="text-muted">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Dashboards" breadcrumbItem="Financeiro" />

          <Row>
            <CardWelcome />

            <Col xl="8">
              <Row>
                <MiniWidget />
              </Row>
            </Col>
          </Row>

          <Row>
            <Earning dataColors='["--bs-primary"]' />

            <SalesAnalytics dataColors='["--bs-primary", "--bs-success", "--bs-danger"]' />
          </Row>

          <Row>
            <TotalSellingProduct />

            <Tasks />
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DashboardFinanceiro; 