import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Badge,
  Spinner,
} from "reactstrap";
import Breadcrumb from "../../components/Common/Breadcrumb";
import { getFirebaseBackend } from "../../helpers/firebase_helper";
import TableContainer from "../../components/Common/TableContainer";
import { Link } from "react-router-dom";

const Clients = () => {
  document.title = "Clientes | InteliTec";
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchools = async () => {
      setLoading(true);
      try {
        const schoolsRef = await getFirebaseBackend().getSchools();
        console.log("Escolas:", schoolsRef);
        setSchools(schoolsRef);
      } catch (error) {
        console.error("Erro ao buscar escolas:", error);
      } finally {
        setTimeout(() => setLoading(false), 1000);
      }
    };

    fetchSchools();
  }, []);

  const columns = useMemo(
    () => [
      {
        header: "Logo",
        accessorKey: "logo",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (cellProps) => {
          const logo = cellProps.row.original.logo;
          return (
            <div className="avatar-xs">
              {logo ? (
                <img 
                  src={logo} 
                  alt="" 
                  className="avatar-title rounded-circle"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.parentNode.innerHTML = '<span class="avatar-title rounded-circle bg-light text-body"><i class="bx bx-camera font-size-16"></i></span>';
                  }}
                />
              ) : (
                <span className="avatar-title rounded-circle bg-light text-body">
                  <i className="bx bx-camera font-size-16"></i>
                </span>
              )}
            </div>
          );
        },
      },
      {
        header: "Nome da Escola",
        accessorKey: "name",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          const schoolName = cellProps.row.original.name || "Nome não disponível";
          return (
            <div className="d-flex align-items-center">
              <div className="font-size-14 mb-1">
                <Link to="#" className="text-dark">
                  {schoolName}
                </Link>
              </div>
            </div>
          );
        },
      },
      {
        header: "CNPJ",
        accessorKey: "cnpj",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Cidade/UF",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          const addressInfo = cellProps.row.original.addressInfo;
          if (!addressInfo) return "-";
          return `${addressInfo.city}/${addressInfo.state}`;
        },
      },
      
      {
        header: "Status",
        accessorKey: "status",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return <Badge className={
            "font-size-11 badge-soft-" +
            (cellProps.value === "active" ? "success" : "danger")
          }>
            {cellProps.value === "active" ? "Ativo" : "Inativo"}
          </Badge>;
        },
      },
      {
        header: "Detalhes",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (cellProps) => {
          return (
            <Button
              type="button"
              color="primary"
              className="btn-sm btn-rounded"
              onClick={() => {
                const data = cellProps.row.original;
                // toggleViewModal();
                // setTransaction(data);
              }}
            >
              Ver Detalhes
            </Button>
          );
        },
      },
    ],
    []
  );

  if (loading) {
    return (
      <div className="page-content">
        <Container fluid>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '70vh' 
          }}>
            <div className="text-center">
              <Spinner 
                style={{ width: '3rem', height: '3rem' }} 
                color="primary"
              >
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
          <Breadcrumb title="InteliTec" breadcrumbItem="Clientes" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div className="mb-4 h4 card-title">Lista de Escolas</div>
                  <TableContainer
                    columns={columns}
                    data={schools}
                    isGlobalFilter={true}
                    tableClass="align-middle table-nowrap"
                    theadClass="table-light"
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Clients; 