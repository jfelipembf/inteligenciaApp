import React from "react";
import { Row, Col, Card, CardHeader, CardBody, Badge, Button } from "reactstrap";
import { YEAR_TO_LEVEL_MAP, SCHOOL_YEAR_STATUS } from "../../../../constants/schoolYear";

const ClassHeader = ({ classData, onEditClass }) => {
  // Função para obter o nível de ensino com base no ano escolar
  const getEducationLevel = (year) => {
    return YEAR_TO_LEVEL_MAP[year] || "Não definido";
  };

  // Função para formatar o status da turma
  const formatStatus = (status) => {
    switch (status) {
      case SCHOOL_YEAR_STATUS.ACTIVE:
        return <Badge color="success">{SCHOOL_YEAR_STATUS.ACTIVE}</Badge>;
      case SCHOOL_YEAR_STATUS.PLANNED:
        return <Badge color="info">{SCHOOL_YEAR_STATUS.PLANNED}</Badge>;
      case SCHOOL_YEAR_STATUS.FINISHED:
        return <Badge color="secondary">{SCHOOL_YEAR_STATUS.FINISHED}</Badge>;
      case SCHOOL_YEAR_STATUS.CANCELED:
        return <Badge color="danger">{SCHOOL_YEAR_STATUS.CANCELED}</Badge>;
      default:
        return <Badge color="warning">Não definido</Badge>;
    }
  };

  // Formatar data para exibição
  const formatDate = (dateString) => {
    if (!dateString) return "Não definida";
    // Converter formato YYYY-MM-DD para DD/MM/YYYY
    if (dateString.includes("-")) {
      const [year, month, day] = dateString.split("-");
      return `${day}/${month}/${year}`;
    }
    return dateString;
  };

  return (
    <Card className="mb-4">
      <CardHeader className="d-flex justify-content-between align-items-center bg-primary text-white">
        <h4 className="mb-0">{classData.className}</h4>
        <Button color="light" size="sm" onClick={onEditClass}>
          <i className="bx bx-edit me-1"></i>
          Editar Turma
        </Button>
      </CardHeader>
      <CardBody>
        <Row>
          <Col md={6} lg={3}>
            <div className="mb-3">
              <h6 className="text-muted">Ano Escolar</h6>
              <p className="mb-0">{classData.year || "Não definido"}</p>
            </div>
          </Col>
          <Col md={6} lg={3}>
            <div className="mb-3">
              <h6 className="text-muted">Nível de Ensino</h6>
              <p className="mb-0">{getEducationLevel(classData.year)}</p>
            </div>
          </Col>
          <Col md={6} lg={3}>
            <div className="mb-3">
              <h6 className="text-muted">Período</h6>
              <p className="mb-0">{classData.period || "Não definido"}</p>
            </div>
          </Col>
          <Col md={6} lg={3}>
            <div className="mb-3">
              <h6 className="text-muted">Status</h6>
              <p className="mb-0">{formatStatus(classData.status)}</p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <div className="mb-3">
              <h6 className="text-muted">Data de Início</h6>
              <p className="mb-0">{formatDate(classData.startDate)}</p>
            </div>
          </Col>
          <Col md={6}>
            <div className="mb-3">
              <h6 className="text-muted">Data de Término</h6>
              <p className="mb-0">{formatDate(classData.endDate)}</p>
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default ClassHeader;
