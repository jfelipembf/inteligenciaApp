import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Table,
  Button,
  Spinner,
  Input,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/Common/Breadcrumb";
import { useActivityManagement } from "../../hooks/useActivityManagement";
import DeleteActivityModal from "./DeleteActivityModal";

const Activities = () => {
  const { getActivities, deleteActivity, loading, error } = useActivityManagement();
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const maxPagesToShow = 5;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivities = async () => {
      const data = await getActivities();
      setActivities(data);
    };

    fetchActivities();
  }, [getActivities]);

  // Atualiza as atividades filtradas sempre que o termo de busca ou a lista mudar
	useEffect(() => {
		const filtered = activities.filter((activity) =>
			activity.name.toLowerCase().includes(searchTerm.toLowerCase())
		);
		setFilteredActivities(filtered);
	}, [searchTerm, activities]);

	// Reseta a página apenas quando o termo de busca mudar
	useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm]);


  const handleEdit = (id) => {
    navigate(`/activities/edit-activity/${id}`);
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleDeleteClick = (activity) => {
    setSelectedActivity(activity);
    toggleModal();
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteActivity(selectedActivity.id);
      setActivities((prev) => prev.filter((act) => act.id !== selectedActivity.id));
      toggleModal();
      alert("Atividade apagada com sucesso!");
    } catch (err) {
      alert("Erro ao apagar atividade.");
      console.error(err);
    }
  };

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedActivities = filteredActivities.slice(startIndex, startIndex + itemsPerPage);

  const renderPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          color={i === currentPage ? "primary" : "light"}
          onClick={() => setCurrentPage(i)}
          className="me-1"
        >
          {i}
        </Button>
      );
    }

    return pages;
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb title="Atividades" breadcrumbItem="Lista de Atividades" />

        <Row className="mb-3">
          <Col md={6}>
            <Input
              type="text"
              placeholder="Buscar atividade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col className="text-end">
            <Button color="primary" onClick={() => navigate("/activities/add-activity")}>Nova Atividade</Button>
          </Col>
        </Row>

        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                {loading ? (
                  <div className="text-center my-5">
                    <Spinner color="primary" />
                  </div>
                ) : error ? (
                  <div className="alert alert-danger">{error}</div>
                ) : filteredActivities.length === 0 ? (
                  <div className="text-center text-muted py-4">
                    Nenhuma atividade cadastrada.
                  </div>
                ) : (
                  <>
                    <Table bordered hover responsive className="mb-0 text-center align-middle">
                      <thead>
                        <tr>
                          <th className="align-middle">Nome</th>
                          <th className="align-middle">Disciplina</th>
                          <th className="align-middle">Turma</th>
                          <th className="align-middle">Início</th>
                          <th className="align-middle">Fim</th>
                          <th className="align-middle">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedActivities.map((activity) => (
                          <tr key={activity.id}>
                            <td className="align-middle">{activity.name}</td>
                            <td className="align-middle">{activity.subject?.label || "-"}</td>
                            <td className="align-middle">{activity.class?.label || "-"}</td>
                            <td className="align-middle">{activity.startDate}</td>
                            <td className="align-middle">{activity.endDate}</td>
                            <td className="align-middle">
                              <Button
                                color="primary"
                                size="sm"
                                className="me-2"
                                onClick={() => handleEdit(activity.id)}
                              >
                                <i className="bx bx-edit-alt"></i>
                              </Button>
                              <Button
                                color="danger"
                                size="sm"
                                onClick={() => handleDeleteClick(activity)}
                              >
                                <i className="bx bx-trash-alt"></i>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>

                    <div className="d-flex justify-content-center align-items-center mt-4">
                      <Button color="light" onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="me-1">
                        Início
                      </Button>
                      <Button color="light" onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))} className="me-1">
                        &lt;
                      </Button>
                      {renderPageNumbers()}
                      <Button color="light" onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))} className="ms-1">
                        &gt;
                      </Button>
                      <Button color="light" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="ms-1">
                        Fim
                      </Button>
                    </div>
                  </>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      <DeleteActivityModal
        isOpen={isModalOpen}
        toggle={toggleModal}
        onConfirm={handleConfirmDelete}
        activityName={selectedActivity?.name || ""}
      />
    </div>
  );
};

export default Activities;
