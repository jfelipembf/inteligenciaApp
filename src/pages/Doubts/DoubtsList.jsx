import React from "react";
import { Card, CardBody, Table, Button } from "reactstrap";
import { useDoubts } from "../../hooks/useDoubts";
import { useNavigate } from "react-router-dom";
import useUser from "../../hooks/useUser"; // Importa o hook do usuário

function summarize(text, maxLength = 60) {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

const DoubtsList = () => {
  const { userDetails } = useUser();
  const schoolId = userDetails?.schoolId;
  const userId = userDetails?.uid;
  const { doubts, loading } = useDoubts(schoolId, userId);
  const navigate = useNavigate();

  return (
    <Card>
      <CardBody>
        <h4 className="card-title mb-4">Dúvidas Recebidas</h4>
        {loading ? (
          <div>Carregando...</div>
        ) : (
          <Table responsive>
            <thead>
              <tr>
                <th>Dúvida</th>
                <th>Remetente</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {doubts.map((doubt) => (
                <tr key={doubt.id}>
                  <td>
                    <span
                      style={{ cursor: "pointer", color: "#007bff" }}
                      onClick={() => navigate(`/doubts/${doubt.id}`)}
                    >
                      {summarize(doubt.doubt)}
                    </span>
                  </td>
                  <td>{doubt.remetente.label}</td>
                  <td>
                    <Button
                      color="primary"
                      size="sm"
                      title="Visualizar"
                      onClick={() => navigate(`/doubts/${doubt.id}`)}
                    >
                      <i className="bx bx-show"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </CardBody>
    </Card>
  );
};

export default DoubtsList;
