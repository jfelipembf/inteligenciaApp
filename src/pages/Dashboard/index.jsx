import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  Spinner,
} from "reactstrap";
import { Link } from "react-router-dom";

import classNames from "classnames";

//import Charts
import StackedColumnChart from "./StackedColumnChart";

//import action
import { getChartsData as onGetChartsData } from "/src/store/actions";

import modalimage1 from "../../assets/images/product/img-7.png";
import modalimage2 from "../../assets/images/product/img-4.png";

// Pages Components
import WelcomeComp from "./WelcomeComp";
import MonthlyEarning from "./MonthlyEarning";
import SocialSource from "./SocialSource";
import ActivityComp from "./ActivityComp";
import TopCities from "./TopCities";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

//i18n
import { withTranslation } from "react-i18next";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import LatestTranactions from "./LatestTranaction";

const Dashboard = (props) => {
  const [modal, setmodal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const DashboardProperties = createSelector(
    (state) => state.Dashboard,
    (dashboard) => ({
      chartsData: dashboard.chartsData
    })
  );

  const { chartsData } = useSelector(DashboardProperties);

  const reports = [
    { title: "Escolas ativas", iconClass: "bx-copy-alt", description: "2" },
    { title: "Novas escolas", iconClass: "bx-archive-in", description: "95" },
    { title: "Alunos ativos", iconClass: "bx-purchase-tag-alt", description: "230" },
  ];

  const [periodData, setPeriodData] = useState([]);
  const [periodType, setPeriodType] = useState("Year");

  useEffect(() => {
    setPeriodData(chartsData);
  }, [chartsData]);

  const onChangeChartPeriod = pType => {
    setPeriodType(pType);
    dispatch(onGetChartsData(pType));
  };

  const dispatch = useDispatch();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(onGetChartsData("Year"));
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

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

  //meta title
  document.title = "Dashboard | Skote - Vite React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs title={props.t("Dashboards")} breadcrumbItem={props.t("Dashboard")} />

          <Row>
            <Col xl="4">
              <WelcomeComp />
              <MonthlyEarning />
            </Col>
            <Col xl="8">
              <Row>
                {/* Reports Render */}
                {(reports || [])?.map((report, key) => (
                  <Col md="4" key={"_col_" + key}>
                    <Card className="mini-stats-wid">
                      <CardBody>
                        <div className="d-flex">
                          <div className="flex-grow-1">
                            <p className="text-muted fw-medium">
                              {report.title}
                            </p>
                            <h4 className="mb-0">{report.description}</h4>
                          </div>
                          <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                            <span className="avatar-title rounded-circle bg-primary">
                              <i className={"bx " + report.iconClass + " font-size-24"}></i>
                            </span>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                ))}
              </Row>

              <Card>
                <CardBody>
                  <div className="d-sm-flex flex-wrap">
                    <h4 className="card-title mb-4">E-mails Enviados</h4>
                    <div className="ms-auto">
                      <ul className="nav nav-pills">
                        <li className="nav-item">
                          <Link to="#" className={classNames({ active: periodType === "Week" }, "nav-link")} onClick={() => { onChangeChartPeriod("Week"); }} id="one_month">
                            Semana
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link to="#" className={classNames({ active: periodType === "Month" }, "nav-link")} onClick={() => { onChangeChartPeriod("Month"); }} id="one_month">
                            Mês
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link to="#" className={classNames({ active: periodType === "Year" }, "nav-link")} onClick={() => { onChangeChartPeriod("Year"); }} id="one_month">
                            Ano
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* <div className="clearfix"></div> */}
                  <StackedColumnChart periodData={periodData} dataColors='["--bs-primary", "--bs-warning", "--bs-success"]' />
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg="12">
              <LatestTranactions />
            </Col>
          </Row>
        </Container>
      </div>

      <Modal
        isOpen={modal}
        role="dialog"
        autoFocus={true}
        centered={true}
        className="exampleModal"
        tabIndex="-1"
        toggle={() => {
          setmodal(!modal);
        }}
      >
        <div>
          <ModalHeader
            toggle={() => {
              setmodal(!modal);
            }}
          >
            Detalhes do Pedido
          </ModalHeader>
          <ModalBody>
            <p className="mb-2">
              ID do Produto: <span className="text-primary">#SK2540</span>
            </p>
            <p className="mb-4">
              Nome do Cliente: <span className="text-primary">Neal Matthews</span>
            </p>

            <div className="table-responsive">
              <Table className="table table-centered table-nowrap">
                <thead>
                  <tr>
                    <th scope="col">Produto</th>
                    <th scope="col">Nome do Produto</th>
                    <th scope="col">Preço</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">
                      <div>
                        <img src={modalimage1} alt="" className="avatar-sm" />
                      </div>
                    </th>
                    <td>
                      <div>
                        <h5 className="text-truncate font-size-14">
                          Fone de Ouvido Sem Fio (Preto)
                        </h5>
                        <p className="text-muted mb-0">R$ 225 x 1</p>
                      </div>
                    </td>
                    <td>R$ 255</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <div>
                        <img src={modalimage2} alt="" className="avatar-sm" />
                      </div>
                    </th>
                    <td>
                      <div>
                        <h5 className="text-truncate font-size-14">
                          Moletom (Azul)
                        </h5>
                        <p className="text-muted mb-0">R$ 145 x 1</p>
                      </div>
                    </td>
                    <td>R$ 145</td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <h6 className="m-0 text-end">Sub Total:</h6>
                    </td>
                    <td>R$ 400</td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <h6 className="m-0 text-end">Frete:</h6>
                    </td>
                    <td>Grátis</td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <h6 className="m-0 text-end">Total:</h6>
                    </td>
                    <td>R$ 400</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              type="button"
              color="secondary"
              onClick={() => {
                setmodal(!modal);
              }}
            >
              Fechar
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    </React.Fragment>
  );
};

Dashboard.propTypes = {
  t: PropTypes.any,
  chartsData: PropTypes.any,
  onGetChartsData: PropTypes.func,
};

export default withTranslation()(Dashboard);
