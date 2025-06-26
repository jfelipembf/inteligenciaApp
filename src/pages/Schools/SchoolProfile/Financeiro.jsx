import React, { useState } from "react";
import { Card, CardBody, Col, Row, Badge } from "reactstrap";
import TableContainer from "../../../components/Common/TableContainer";

const Financeiro = () => {
  const [transactions] = useState([
    {
      id: "PAG2024001",
      student: "João Silva",
      description: "Mensalidade Março/2024",
      value: 800.00,
      dueDate: "2024-03-10",
      status: "paid", // paid, pending, late
      paymentDate: "2024-03-08",
      paymentMethod: "credit_card"
    },
    {
      id: "PAG2024002",
      student: "Maria Santos",
      description: "Mensalidade Março/2024",
      value: 800.00,
      dueDate: "2024-03-10",
      status: "pending",
      paymentDate: null,
      paymentMethod: null
    },
    {
      id: "PAG2024003",
      student: "Pedro Oliveira",
      description: "Mensalidade Fevereiro/2024",
      value: 800.00,
      dueDate: "2024-02-10",
      status: "late",
      paymentDate: null,
      paymentMethod: null
    }
  ]);

  const columns = [
    {
      header: "ID",
      accessorKey: "id",
      enableColumnFilter: false,
      enableSorting: true,
    },
    {
      header: "Aluno",
      accessorKey: "student",
      enableColumnFilter: false,
      enableSorting: true,
    },
    {
      header: "Descrição",
      accessorKey: "description",
      enableColumnFilter: false,
      enableSorting: true,
    },
    {
      header: "Valor",
      accessorKey: "value",
      enableColumnFilter: false,
      enableSorting: true,
      cell: (cellProps) => {
        return `R$ ${cellProps.getValue().toFixed(2)}`;
      }
    },
    {
      header: "Vencimento",
      accessorKey: "dueDate",
      enableColumnFilter: false,
      enableSorting: true,
      cell: (cellProps) => {
        return new Date(cellProps.getValue()).toLocaleDateString();
      }
    },
    {
      header: "Status",
      accessorKey: "status",
      enableColumnFilter: false,
      enableSorting: true,
      cell: (cellProps) => {
        const status = cellProps.getValue();
        const statusConfig = {
          paid: { color: "success", text: "Pago" },
          pending: { color: "warning", text: "Pendente" },
          late: { color: "danger", text: "Atrasado" }
        };

        return (
          <Badge className={`font-size-11 badge-soft-${statusConfig[status].color}`}>
            {statusConfig[status].text}
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
        const transaction = cellProps.row.original;
        return (
          <div className="d-flex gap-2 justify-content-end" style={{ marginRight: '-5px' }}>
            {/* Botão de Recibo/Comprovante - só aparece se estiver pago */}
            {transaction.status === 'paid' && (
              <button
                type="button"
                className="btn btn-info btn-sm rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '32px', height: '32px' }}
                title="Baixar Recibo"
                onClick={() => {
                  // TODO: Implementar download do recibo
                }}
              >
                <i className="bx bx-receipt font-size-14"></i>
              </button>
            )}

            {/* Botão de Boleto - aparece se estiver pendente ou atrasado */}
            {(transaction.status === 'pending' || transaction.status === 'late') && (
              <button
                type="button"
                className="btn btn-warning btn-sm rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '32px', height: '32px' }}
                title="Gerar Boleto"
                onClick={() => {
                  // TODO: Implementar geração de boleto
                }}
              >
                <i className="bx bx-barcode font-size-14"></i>
              </button>
            )}

            {/* Botão de Notificação - aparece se estiver atrasado */}
            {transaction.status === 'late' && (
              <button
                type="button"
                className="btn btn-danger btn-sm rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '32px', height: '32px' }}
                title="Enviar Lembrete"
                onClick={() => {
                  // TODO: Implementar envio de lembrete
                }}
              >
                <i className="bx bx-bell font-size-14"></i>
              </button>
            )}

            {/* Botão de Detalhes - sempre aparece */}
            <button
              type="button"
              className="btn btn-primary btn-sm rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: '32px', height: '32px' }}
              title="Ver Detalhes"
              onClick={() => {
                // TODO: Implementar visualização de detalhes
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
                <h5 className="card-title me-2">Financeiro</h5>
              </div>
              <TableContainer
                columns={columns}
                data={transactions}
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

export default Financeiro; 