import React, { useState } from "react";
import { Card, CardBody, Col, Row, Badge } from "reactstrap";
import TableContainer from "../../../components/Common/TableContainer";
import StudentProfile from "./StudentProfile";

const Students = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isViewingDetails, setIsViewingDetails] = useState(false);

  const [students] = useState([
    {
      name: "João Silva",
      registration: "2024001",
      class: "9º Ano A",
      status: "active",
      birthDate: "2009-05-15",
      cpf: "123.456.789-00",
      email: "joao.silva@email.com",
      phone: "(79) 99999-1111",
      grade: "9º Ano",
      hasApp: true,
      lastAccess: "2024-03-15T10:30:00",
      grades: [
        { subject: "Matemática", b1: 8.5, b2: 7.5, b3: 9.0, b4: 8.0 },
        { subject: "Português", b1: 7.0, b2: 8.0, b3: 7.5, b4: 8.5 },
        { subject: "História", b1: 9.0, b2: 8.5, b3: 9.0, b4: 9.5 },
      ],
      activities: [
        {
          date: "2024-03-15T10:30:00",
          type: "Mensagem",
          description: "Visualizou comunicado sobre a reunião de pais",
          status: "read",
        },
        {
          date: "2024-03-14T15:45:00",
          type: "Atividade",
          description: "Entregou trabalho de matemática",
          status: "completed",
        },
      ],
    },
    {
      name: "Maria Santos",
      registration: "2024002",
      class: "7º Ano B",
      status: "active",
    },
    {
      name: "Pedro Oliveira",
      registration: "2024003",
      class: "8º Ano A",
      status: "inactive",
    },
    {
      name: "Ana Costa",
      registration: "2024004",
      class: "6º Ano C",
      status: "active",
    },
    {
      name: "Lucas Ferreira",
      registration: "2024005",
      class: "9º Ano B",
      status: "active",
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
      header: "Turma",
      accessorKey: "class",
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
        <div className="text-end" style={{ marginRight: "30px" }}>
          Ações
        </div>
      ),
      accessorKey: "actions",
      enableColumnFilter: false,
      enableSorting: false,
      cell: (cellProps) => {
        const student = cellProps.row.original;
        return (
          <div
            className="d-flex gap-2 justify-content-end"
            style={{ marginRight: "-5px" }}
          >
            <button
              type="button"
              className="btn btn-success btn-sm rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: "32px", height: "32px" }}
              title="WhatsApp"
              onClick={() => {
                window.open(
                  `https://wa.me/55${student.phone?.replace(/\D/g, "")}`,
                  "_blank"
                );
              }}
            >
              <i className="bx bxl-whatsapp font-size-14"></i>
            </button>
            <button
              type="button"
              className="btn btn-info btn-sm rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: "32px", height: "32px" }}
              title="Email"
              onClick={() => {
                window.location.href = `mailto:${student.email}`;
              }}
            >
              <i className="bx bx-envelope font-size-14"></i>
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: "32px", height: "32px" }}
              title="Ver Detalhes"
              onClick={() => {
                setSelectedStudent(student);
                setIsViewingDetails(true);
              }}
            >
              <i className="bx bx-detail font-size-14"></i>
            </button>
          </div>
        );
      },
    },
  ];

  if (isViewingDetails && selectedStudent) {
    return (
      <StudentProfile
        student={selectedStudent}
        onBack={() => {
          setIsViewingDetails(false);
          setSelectedStudent(null);
        }}
      />
    );
  }

  return (
    <React.Fragment>
      <Row>
        <Col lg={12}>
          <Card>
            <CardBody>
              <div className="d-flex flex-wrap align-items-center mb-4">
                <h5 className="card-title me-2">Alunos</h5>
              </div>
              <TableContainer
                columns={columns}
                data={students}
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

export default Students;
