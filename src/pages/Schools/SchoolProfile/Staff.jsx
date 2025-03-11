import React, { useState } from "react";
import { Card, CardBody, Col, Row, Badge } from "reactstrap";
import TableContainer from "../../../components/Common/TableContainer";

const Staff = () => {
  const [staff] = useState([
    {
      name: "Maria Oliveira",
      registration: "PROF2024001",
      role: "Professor",
      subject: "Matemática",
      status: "active",
      email: "maria.oliveira@escola.com",
      phone: "(79) 99999-2222",
    },
    {
      name: "João Santos",
      registration: "PROF2024002",
      role: "Professor",
      subject: "Português",
      status: "active",
      email: "joao.santos@escola.com",
      phone: "(79) 99999-3333",
    },
    {
      name: "Ana Silva",
      registration: "COORD2024001",
      role: "Coordenador",
      subject: null,
      status: "active",
      email: "ana.silva@escola.com",
      phone: "(79) 99999-4444",
    },
    {
      name: "Pedro Costa",
      registration: "PROF2024003",
      role: "Professor",
      subject: "História",
      status: "inactive",
      email: "pedro.costa@escola.com",
      phone: "(79) 99999-5555",
    },
  ]);

  const columns = [
    {
      header: "Nome",
      accessorKey: "name",
      enableColumnFilter: false,
      enableSorting: true,
    },
    {
      header: "Matrícula",
      accessorKey: "registration",
      enableColumnFilter: false,
      enableSorting: true,
    },
    {
      header: "Cargo",
      accessorKey: "role",
      enableColumnFilter: false,
      enableSorting: true,
    },
    {
      header: "Status",
      accessorKey: "status",
      enableColumnFilter: false,
      enableSorting: true,
      cell: (cellProps) => {
        return (
          <Badge
            className={`font-size-11 badge-soft-${
              cellProps.getValue() === "active" ? "success" : "danger"
            }`}
          >
            {cellProps.getValue() === "active" ? "Ativo" : "Inativo"}
          </Badge>
        );
      },
    },
    {
      header: () => (
        <div className="text-end" style={{ marginRight: '30px' }}>Ações</div>
      ),
      accessorKey: "actions",
      enableColumnFilter: false,
      enableSorting: false,
      cell: (cellProps) => {
        const staffMember = cellProps.row.original;
        return (
          <div className="d-flex gap-2 justify-content-end" style={{ marginRight: '-5px' }}>
            <button
              type="button"
              className="btn btn-success btn-sm rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: '32px', height: '32px' }}
              title="WhatsApp"
              onClick={() => {
                window.open(`https://wa.me/55${staffMember.phone?.replace(/\D/g, '')}`, '_blank');
              }}
            >
              <i className="bx bxl-whatsapp font-size-14"></i>
            </button>
            <button
              type="button"
              className="btn btn-info btn-sm rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: '32px', height: '32px' }}
              title="Email"
              onClick={() => {
                window.location.href = `mailto:${staffMember.email}`;
              }}
            >
              <i className="bx bx-envelope font-size-14"></i>
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: '32px', height: '32px' }}
              title="Ver Detalhes"
              onClick={() => {
                // TODO: Implementar visualização de detalhes do colaborador
              }}
            >
              <i className="bx bx-detail font-size-14"></i>
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <React.Fragment>
      <Row>
        <Col lg={12}>
          <Card>
            <CardBody>
              <div className="d-flex flex-wrap align-items-center mb-4">
                <h5 className="card-title me-2">Colaboradores</h5>
              </div>
              <TableContainer
                columns={columns}
                data={staff}
                isGlobalFilter={true}
                customPageSize={10}
                className="custom-header-css"
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Staff; 