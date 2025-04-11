import { useEffect, useState } from "react";
import {
  Container,
  Card,
  CardBody,
  Table,
  Button,
  Input,
} from "reactstrap";
import { useParams, useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/Common/Breadcrumb";
import { useActivityManagement } from "../../hooks/useActivityManagement";
import useClassData from "../../hooks/useClassData";

const Activity = () => {
  const { id, classId, lessonId } = useParams();
  const navigate = useNavigate();
  const { getActivityById } = useActivityManagement();
  const { students } = useClassData(classId);

  const [activity, setActivity] = useState(null);
  const [responses, setResponses] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const activityData = await getActivityById(classId, lessonId, id);
				setActivity(activityData);
			} catch (err) {
				console.error("Erro ao carregar dados:", err);
			}
		};
	
		fetchData();
	
		if (students.length > 0 && responses.length === 0) {
			const responses = students.map((student) => ({
				studentId: student.id,
				studentName: student.name,
				delivered: false,
				score: null,
			}));
			setResponses(responses);
		}
	}, [id, classId, lessonId, getActivityById, students, responses.length]);
		
	
	

	const handleResponseChange = (index, field, value) => {
		setResponses((prev) =>
			prev.map((r, i) => {
				if (i !== index) return r;
	
				if (field === "delivered") {
					console.log('clicado')
					return {
						...r,
						delivered: value,
						score: value ? r.score : null,
					};
				}
				
	
				if (field === "score") {
					let numeric = Number(value);
				
					// Impede valores menores que 0 ou maiores que a nota máxima
					if (isNaN(numeric)) return r;
					if (numeric < 0) numeric = 0;
					if (numeric > activity.score) numeric = activity.score;
				
					return {
						...r,
						score: value === "" ? null : numeric,
					};
				}
				
	
				return r;
			})
		);
	};
		

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
                <p>
                  Tipo de Atividade:{" "}
                  <strong className="text-uppercase">{activity.activityType}</strong>
                </p>
                <p>Data de Início: {formatDateBr(activity.startDate)}</p>
                <p>Data de Término: {formatDateBr(activity.endDate)}</p>
                {activity.score && <p>Nota Máxima: {activity.score}</p>}
                {activity.description && <p>Descrição: {activity.description}</p>}
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Table responsive bordered className="text-center align-middle">
                  <thead>
                    <tr>
                      <th className="text-center align-middle">Aluno</th>
                      <th className="text-center align-middle">Entregue</th>
                      {activity.score && <th className="text-center align-middle">Nota</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {responses.map((res, index) => (
                      <tr key={res.studentId}>
                        <td className="text-center align-middle">{res.studentName}</td>
                        <td className="text-center align-middle">
												{typeof res.delivered === "boolean" && (
													<Input
														type="checkbox"
														value={res.delivered}
														onChange={(e) =>
															handleResponseChange(index, "delivered", e.target.checked)
														}
													/>
												)}
												</td>
												{activity.score && (
													<td className="text-center align-middle">
														<Input
															type="number"
															min={0}
															max={activity.score}
															value={res.score ?? ""}
															onChange={(e) =>
																handleResponseChange(index, "score", e.target.value)
															}
															disabled={res.delivered}
														/>
													</td>
												)}
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <div className="d-flex justify-content-end gap-2 mt-3">
                  <Button color="primary" onClick={handleSave}>
                    Salvar Respostas
                  </Button>
                  <Button color="secondary" onClick={() => navigate("/activities")}>
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
