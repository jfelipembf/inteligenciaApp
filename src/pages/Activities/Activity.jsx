import { useEffect, useState } from "react";
import { Container, Card, CardBody, Table, Button, Input } from "reactstrap";
import { useParams, useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/Common/Breadcrumb";
import { useActivityManagement } from "../../hooks/useActivityManagement";
import useClassData from "../../hooks/useClassData";
import useFetchOnce from "../../hooks/useFetchOnce";

const Activity = () => {
  const { id, classId, lessonId } = useParams();
  const navigate = useNavigate();
  const { getActivityById } = useActivityManagement();
  const { students } = useClassData(classId);

  const [activity, setActivity] = useState(null);
  const [responses, setResponses] = useState([]);
  const fetchOnce = useFetchOnce(getActivityById);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const activityData = await fetchOnce(
          `${classId}-${lessonId}-${id}`,
          classId,
          lessonId,
          id
        );
        setActivity(activityData);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      }
    };

    fetchData();
  }, [classId, lessonId, id, fetchOnce]);

  useEffect(() => {
    if (students.length > 0 && responses.length === 0) {
      const initialResponses = students.map((student) => ({
        studentId: student.id,
        studentName: student.name,
        delivered: false,
      }));
      setResponses(initialResponses);
    }
  }, [students, responses.length]);

  const handleSave = () => {
    console.log("Respostas salvas:", responses);
    alert("Respostas salvas com sucesso!");
  };

  const formatDateBr = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb title="Atividade" breadcrumbItem="Atividades" />

        {activity && (
          <>
            <Card className="mb-4">
              <CardBody>
                <h5>Turma: {activity.class.name}</h5>
                <p>Disciplina: {activity.subject.name}</p>
                <p>Atividade: {activity.name}</p>
                <p>Data de Início: {formatDateBr(activity.startDate)}</p>
                <p>Data de Término: {formatDateBr(activity.endDate)}</p>
                {activity.score && <p>Pontuação: {activity.score}</p>}
                {activity.description && (
                  <p>Descrição: {activity.description}</p>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Table responsive bordered className="text-center align-middle">
                  <thead>
                    <tr>
                      <th className="text-center align-middle">Aluno</th>
                      <th className="text-center align-middle">Entregue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {responses.map((res, index) => (
                      <tr key={res.studentId}>
                        <td className="text-center align-middle">
                          {res.studentName}
                        </td>
                        <td className="text-center align-middle">
                          {typeof res.delivered === "boolean" && (
                            <Input
                              type="checkbox"
                              onChange={(e) => {
                                setResponses((prevResponses) =>
                                  prevResponses.map((response, i) =>
                                    i === index
                                      ? {
                                          ...response,
                                          delivered: e.target.checked,
                                        }
                                      : response
                                  )
                                );
                              }}
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <div className="d-flex justify-content-end gap-2 mt-3">
                  <Button color="primary" onClick={handleSave}>
                    Salvar Respostas
                  </Button>
                  <Button
                    color="secondary"
                    onClick={() => navigate("/activities")}
                  >
                    Voltar
                  </Button>
                </div>
              </CardBody>
            </Card>
          </>
        )}
      </Container>
    </div>
  );
};

export default Activity;
