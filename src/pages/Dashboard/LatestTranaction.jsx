import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import withRouter from "../../components/Common/withRouter";

import { Badge, Button, Card, CardBody } from "reactstrap";
import EcommerceOrdersModal from "../Ecommerce/EcommerceOrders/EcommerceOrdersModal";

import TableContainer from "../../components/Common/TableContainer";
import { latestTransaction } from "../../common/data";
import { Link } from "react-router-dom";

const LatestTransaction = () => {

  const [modal1, setModal1] = useState(false);
  const toggleViewModal = () => setModal1(!modal1);

  const [transaction, setTransaction] = useState("")

  const columns = useMemo(
    () => [
      {
        header: () => <input type="checkbox" className="form-check-input" />,
        accessorKey: "id",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return <input type="checkbox" className="form-check-input" />;
        },
      },
      {
        header: "ID Escola",
        accessorKey: "orderId",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return <Link to="#" className="text-body fw-bold">{cellProps.row.original.orderId}</Link>;
        },
      },
      {
        header: "Nome da Escola",
        accessorKey: "billingName",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Data de Adesão",
        accessorKey: "orderDate",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Mensalidade",
        accessorKey: "total",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Status do Pagamento",
        accessorKey: "paymentStatus",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return <Badge className={"font-size-11 badge-soft-" +
            (cellProps.row.original.paymentStatus === "Paid" ? "success" : "danger" && cellProps.row.original.paymentStatus === "Refund" ? "warning" : "danger")}
          >
            {cellProps.row.original.paymentStatus === "Paid" ? "Pago" : 
             cellProps.row.original.paymentStatus === "Refund" ? "Reembolso" : "Pendente"}
          </Badge>;
        },
      },
      {
        header: "Forma de Pagamento",
        accessorKey: "paymentMethod",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return <span>
            <i className={
              (cellProps.row.original.paymentMethod === "Paypal" ? "fab fa-cc-paypal me-1" : "" ||
                cellProps.row.original.paymentMethod === "COD" ? "fab fas fa-money-bill-alt me-1" : "" ||
                  cellProps.row.original.paymentMethod === "Mastercard" ? "fab fa-cc-mastercard me-1" : "" ||
                    cellProps.row.original.paymentMethod === "Visa" ? "fab fa-cc-visa me-1" : ""
              )}
            /> {cellProps.row.original.paymentMethod}
          </span>;
        },
      },
      {
        header: "Detalhes",
        enableColumnFilter: false,
        enableSorting: true,
        accessorKey: "view",
        cell: (cellProps) => {
          return (
            <Button type="button" color="primary" className="btn-sm btn-rounded" onClick={() => { toggleViewModal(); setTransaction(cellProps.row.original) }}>
              Ver Detalhes
            </Button>
          );
        },
      },
    ],
    []
  );

  return (
    <React.Fragment>
      <EcommerceOrdersModal isOpen={modal1} toggle={toggleViewModal} transaction={transaction} />
      <Card>
        <CardBody>
          <div className="mb-4 h4 card-title">Últimas Escolas Cadastradas</div>
          <TableContainer
            columns={columns}
            data={latestTransaction}
            isGlobalFilter={false}
            tableClass="align-middle table-nowrap mb-0"
            theadClass="table-light"
          />
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

LatestTransaction.propTypes = {
  latestTransaction: PropTypes.array,
};

export default withRouter(LatestTransaction)
