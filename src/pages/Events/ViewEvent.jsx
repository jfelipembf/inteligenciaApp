import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Button,
  Badge,
  ListGroup,
  ListGroupItem,
  Modal,
  ModalBody,
} from "reactstrap";
import Dropzone from "react-dropzone";
import { toast } from "react-toastify";
import uploadToFirebase from "../../utils/uploadToFirebase";
import useUser from "../../hooks/useUser";
import { useEventsContext } from "../../contexts/EventsContext";
import "react-toastify/dist/ReactToastify.css";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";

const ViewEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userDetails } = useUser();
  const schoolId = userDetails?.schoolId;

  const { events, loading, error, refetch } = useEventsContext();
  const event = events.find((ev) => ev.id === id);

  const [modalOpen, setModalOpen] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);

  console.log("Event:", event);
  console.log("events", events);
  const [gallery, setGallery] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      if (event && event.gallery && schoolId) {
        try {
          const storageRef = firebase
            .storage()
            .ref(`${schoolId}/events/${event.gallery}`);
          const result = await storageRef.listAll();
          const urls = await Promise.all(
            result.items.map((itemRef) => itemRef.getDownloadURL())
          );
          setGallery(urls);
        } catch (err) {
          toast.error("Erro ao buscar imagens da galeria: " + err.message);
          setGallery([]);
        }
      } else {
        setGallery([]);
      }
    };

    fetchGalleryImages();
  }, [event, schoolId]);

  const handleAddImages = async (files) => {
    if (!schoolId || !event?.gallery) {
      toast.error("schoolId ou gallery não encontrado.");
      return;
    }
    setUploading(true);
    try {
      for (const file of files) {
        // Salva na pasta correta
        await uploadToFirebase(file, `events/${event.gallery}`, schoolId);
      }
      toast.success("Imagens adicionadas com sucesso!");
      // Atualiza a galeria após upload
      const storageRef = firebase
        .storage()
        .ref(`${schoolId}/events/${event.gallery}`);
      const result = await storageRef.listAll();
      const urls = await Promise.all(
        result.items.map((itemRef) => itemRef.getDownloadURL())
      );
      setGallery(urls);
    } catch (err) {
      toast.error("Erro ao adicionar imagens: " + err.message);
    }
    setUploading(false);
  };

  if (loading) return <p>Carregando evento...</p>;
  if (error) return <p>Erro ao carregar evento: {error}</p>;
  if (!event) return <p>Evento não encontrado.</p>;

  return (
    <Container className="py-4">
      <Button color="light" onClick={() => navigate("/events")}>
        ← Voltar para eventos
      </Button>
      <Card className="mt-3">
        <CardBody>
          <CardTitle tag="h2">{event.name}</CardTitle>
          <Row>
            <Col md={8}>
              <p>
                <strong>Data:</strong>{" "}
                {event.startDate === event.endDate
                  ? event.startDate
                  : `${event.startDate} até ${event.endDate}`}
              </p>
              <p>
                <strong>Horário:</strong> {event.startTime} - {event.endTime}
              </p>
              <p>
                <strong>Local:</strong> {event.location}
              </p>
              <p>
                <strong>Valor:</strong> {event.value || "Gratuito"}
              </p>
              <p>
                <strong>Turmas participantes:</strong>{" "}
                {event.classes && event.classes.length > 0
                  ? event.classes.map((c) => c.label).join(", ")
                  : "-"}
              </p>
              {event.notes && (
                <p>
                  <strong>Informações adicionais:</strong> {event.notes}
                </p>
              )}
            </Col>
            <Col md={5} className="mt-5">
              <strong>Galeria de Imagens:</strong>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "16px",
                  marginTop: "16px",
                }}
              >
                {gallery.length > 0 ? (
                  gallery.map((img, idx) => (
                    <div
                      key={idx}
                      style={{
                        cursor: "pointer",
                        borderRadius: 12,
                        overflow: "hidden",
                        boxShadow: "0 2px 8px #0001",
                        border: "1px solid #eee",
                        background: "#fafafa",
                        height: 220,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onClick={() => {
                        setCurrentImg(idx);
                        setModalOpen(true);
                      }}
                    >
                      <img
                        src={img}
                        alt={`Imagem ${idx + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.2s",
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <span className="text-muted">Nenhuma imagem</span>
                )}
              </div>
              <Dropzone
                onDrop={handleAddImages}
                accept={{
                  "image/*": [".jpeg", ".jpg", ".png"],
                }}
                maxFiles={5}
                disabled={uploading}
              >
                {({ getRootProps, getInputProps }) => (
                  <div
                    {...getRootProps()}
                    className="mt-2 p-2 border rounded text-center"
                    style={{
                      cursor: uploading ? "not-allowed" : "pointer",
                      background: "#fafafa",
                      opacity: uploading ? 0.6 : 1,
                    }}
                  >
                    <input {...getInputProps()} />
                    <span>
                      {uploading
                        ? "Enviando imagens..."
                        : "Clique ou arraste para adicionar mais imagens"}
                    </span>
                  </div>
                )}
              </Dropzone>
              {/* Modal/Carrossel */}
              <Modal
                isOpen={modalOpen}
                toggle={() => setModalOpen(false)}
                centered
                size="lg"
              >
                <ModalBody
                  className="text-center"
                  style={{ background: "#222" }}
                >
                  <Button
                    color="light"
                    onClick={() =>
                      setCurrentImg(
                        (prev) => (prev - 1 + gallery.length) % gallery.length
                      )
                    }
                    style={{
                      position: "absolute",
                      left: 20,
                      top: "50%",
                      zIndex: 2,
                    }}
                  >
                    {"<"}
                  </Button>
                  <img
                    src={gallery[currentImg]}
                    alt={`Imagem ${currentImg + 1}`}
                    style={{
                      maxWidth: "90%",
                      maxHeight: "70vh",
                      borderRadius: 10,
                      boxShadow: "0 4px 24px #000a",
                      margin: "0 auto",
                      display: "block",
                    }}
                  />
                  <Button
                    color="light"
                    onClick={() =>
                      setCurrentImg((prev) => (prev + 1) % gallery.length)
                    }
                    style={{
                      position: "absolute",
                      right: 20,
                      top: "50%",
                      zIndex: 2,
                    }}
                  >
                    {">"}
                  </Button>
                  <div className="mt-2 text-white">
                    {currentImg + 1} / {gallery.length}
                  </div>
                </ModalBody>
              </Modal>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Container>
  );
};

export default ViewEvent;
