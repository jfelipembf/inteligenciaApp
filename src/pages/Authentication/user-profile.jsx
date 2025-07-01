import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Button,
  Label,
  Input,
  FormFeedback,
  Form,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

import * as Yup from "yup";
import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import withRouter from "../../components/Common/withRouter";
import Breadcrumb from "../../components/Common/Breadcrumb";
import avatar from "../../assets/images/users/avatar-1.jpg";
import profileImg from "../../assets/images/profile-img.png";
import { editProfile, resetProfileFlag } from "/src/store/actions";
import { getFirebaseBackend } from "../../helpers/firebase_helper";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import useUserAvatar from "../../hooks/useUserAvatar";
import PersonCircle from "react-bootstrap-icons/dist/icons/person-circle";
import useUser from "../../hooks/useUser";
import { format, parseISO } from "date-fns";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";

const UserProfile = () => {
  document.title = "Perfil";
  const dispatch = useDispatch();
  const [email, setemail] = useState("");
  const [name, setname] = useState("");
  const [idx, setidx] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [userData, setUserData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    cpf: "",
    rg: "",
    birthDate: "",
    specialization: "",
    gender: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    cep: "",
    country: "",
  });

  const {
    updateUserProfile,
    loading: updating,
    error: updateError,
  } = useUpdateUserProfile();
  const { userDetails } = useUser();
  const avatarUrl = useUserAvatar(userDetails, userDetails?.schoolId);
  const userEmail = userDetails?.personalInfo.email || "";

  const ProfileProperties = createSelector(
    (state) => state.Profile,
    (profile) => ({
      error: profile.error,
      success: profile.success,
    })
  );

  const { error, success } = useSelector(ProfileProperties);

  useEffect(() => {
    const loadUserData = async () => {
      const currentUser = firebase.auth().currentUser;
      console.log(currentUser);
      const userDoc = await firebase
        .firestore()
        .collection("users")
        .doc(currentUser.uid)
        .get();
      let firestoreUser = userDoc.data();

      // Se não tiver dados do Firestore, busca novamente
      if (!firestoreUser) {
        firestoreUser = await getFirebaseBackend().getUserData(currentUser.uid);
      }

      setname(currentUser.displayName);
      setemail(currentUser.email);
      setidx(currentUser.uid);
      setUserData(firestoreUser || {});
    };

    loadUserData();
  }, []);

  useEffect(() => {
    if (error) {
      setAlertMessage(error);
    } else if (success) {
      setAlertMessage("Perfil atualizado com sucesso!");
    }

    if (error || success) {
      setTimeout(() => {
        dispatch(resetProfileFlag());
        setAlertMessage("");
      }, 3000);
    }
  }, [dispatch, error, success]);

  useEffect(() => {
    if (userData) {
      setEditForm({
        name: userData.personalInfo?.name || "",
        cpf: userData.personalInfo?.cpf || "",
        rg: userData.personalInfo?.rg || "",
        birthDate: userData.personalInfo?.birthDate || "",
        specialization: userData.professionalInfo?.specialization || "",
        gender: userData.personalInfo?.gender || "",
        street: userData.address?.street || "",
        number: userData.address?.number || "",
        complement: userData.address?.complement || "",
        neighborhood: userData.address?.neighborhood || "",
        city: userData.address?.city || "",
        state: userData.address?.state || "",
        cep: userData.address?.cep || "",
        country: userData.address?.country || "",
      });
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      let birthDateISO = editForm.birthDate;
      if (birthDateISO && birthDateISO.includes("/")) {
        const [day, month, year] = birthDateISO.split("/");
        birthDateISO = `${year}-${month.padStart(2, "0")}-${day.padStart(
          2,
          "0"
        )}`;
      }

      const requiredFields = [
        "name",
        "cpf",
        "rg",
        "birthDate",
        "gender",
        "street",
        "number",
        "neighborhood",
        "city",
        "state",
        "cep",
      ];
      for (const field of requiredFields) {
        if (!editForm[field]) {
          setAlertMessage("Preencha todos os campos obrigatórios.");
          return;
        }
      }

      const updateData = {
        personalInfo: {
          ...userData.personalInfo,
          name: editForm.name,
          cpf: editForm.cpf,
          rg: editForm.rg,
          birthDate: birthDateISO,
          gender: editForm.gender,
        },
        address: {
          ...userData.address,
          street: editForm.street,
          number: editForm.number,
          complement: editForm.complement,
          neighborhood: editForm.neighborhood,
          city: editForm.city,
          state: editForm.state,
          cep: editForm.cep,
        },
        professionalInfo: {
          ...userData.professionalInfo,
          specialization: editForm.specialization,
        },
      };

      const success = await updateUserProfile(updateData);
      if (success) {
        setIsEditing(false);
        setUserData((prev) => ({
          ...prev,
          personalInfo: { ...prev.personalInfo, ...updateData.personalInfo },
          address: { ...prev.address, ...updateData.address },
          professionalInfo: {
            ...prev.professionalInfo,
            ...updateData.professionalInfo,
          },
        }));
        setAlertMessage("Perfil atualizado com sucesso!");
        setTimeout(() => setAlertMessage(""), 3000);
      } else {
        setAlertMessage("Erro ao atualizar perfil. Tente novamente.");
        setTimeout(() => setAlertMessage(""), 3000);
      }
    } catch (error) {
      setAlertMessage("Erro ao atualizar perfil. Tente novamente.");
      setTimeout(() => setAlertMessage(""), 3000);
    }
  };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      username: name || "",
      idx: idx || "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Por favor, insira seu nome de usuário"),
    }),
    onSubmit: (values) => {
      dispatch(editProfile({ username: values.username, uid: values.idx }));
    },
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Skote" breadcrumbItem="Perfil" />

          {alertMessage && (
            <Alert
              color={alertMessage.includes("sucesso") ? "success" : "danger"}
              className="mb-4"
              fade={true}
              transition={{ timeout: 500 }}
            >
              {alertMessage}
            </Alert>
          )}

          <Row>
            <Col lg={12}>
              <Card className="overflow-hidden">
                <div className="bg-primary-subtle" style={{ width: "100%" }}>
                  <Row className="g-0">
                    <Col xs="7">
                      <div className="text-primary p-3">
                        <h5 className="text-primary">Bem-vindo de Volta!</h5>
                        <p>Painel do Usuário</p>
                      </div>
                    </Col>
                    <Col xs="5" className="align-self-end">
                      <img src={profileImg} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0" style={{ background: "#fff" }}>
                  <Row>
                    <Col sm="4">
                      <div
                        className="avatar-md profile-user-wid mb-4 bg-primary-subtle"
                        style={{
                          width: "75px",
                          height: "75px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",

                          borderRadius: "50%",
                          border: "1px solid #dee2e6",
                        }}
                      >
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt=""
                            className="img-thumbnail rounded-circle"
                            style={{
                              width: "75px",
                              height: "75px",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          // Ícone padrão de avatar
                          <PersonCircle size={75} color="#f7f7fa" />
                        )}
                      </div>
                      <h5 className="font-size-15 text-truncate">
                        {userData.personalInfo?.name || "N/A"}
                      </h5>
                      <p className="text-muted mb-0 text-truncate">
                        Email: {email || "N/A"}
                      </p>
                    </Col>

                    <Col sm="8" className="text-end">
                      <div className="pt-2">
                        <Button
                          color="primary"
                          size="sm"
                          onClick={() => setIsEditing(!isEditing)}
                        >
                          <i
                            className={`bx ${
                              isEditing ? "bx-x" : "bx-edit"
                            } me-1`}
                          ></i>
                          {isEditing ? "Cancelar Edição" : "Editar Perfil"}
                        </Button>
                        {isEditing && (
                          <Button
                            color="success"
                            size="sm"
                            className="ms-2"
                            onClick={handleSubmit}
                          >
                            <i className="bx bx-save me-1"></i>
                            Salvar
                          </Button>
                        )}
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>

            <Col lg={12}>
              <Row>
                <Col md={12}>
                  <Card>
                    <CardBody>
                      <h5 className="card-title mb-4">
                        <i className="bx bx-user-circle me-2"></i>
                        Informações Pessoais
                      </h5>
                      <Row>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label>Nome Completo</Label>
                            <Input
                              type="text"
                              name="name"
                              value={
                                isEditing
                                  ? editForm.name
                                  : userData.personalInfo?.name || ""
                              }
                              onChange={handleInputChange}
                              disabled={!isEditing}
                            />
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label>CPF</Label>
                            <Input
                              type="text"
                              name="cpf"
                              value={
                                isEditing
                                  ? editForm.cpf
                                  : userData.personalInfo?.cpf || ""
                              }
                              disabled={true}
                            />
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label>RG</Label>
                            <Input
                              type="text"
                              name="rg"
                              value={
                                isEditing
                                  ? editForm.rg
                                  : userData.personalInfo?.rg || ""
                              }
                              disabled={true}
                            />
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label>Data de Nascimento</Label>
                            {isEditing ? (
                              <Input
                                type="date"
                                name="birthDate"
                                value={editForm.birthDate}
                                onChange={handleInputChange}
                                required
                              />
                            ) : (
                              <Input
                                type="text"
                                name="birthDate"
                                value={
                                  userData.personalInfo?.birthDate
                                    ? format(
                                        parseISO(
                                          userData.personalInfo.birthDate
                                        ),
                                        "dd/MM/yyyy"
                                      )
                                    : ""
                                }
                                disabled
                                readOnly
                              />
                            )}
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label>Gênero</Label>
                            {isEditing ? (
                              <Input
                                type="select"
                                name="gender"
                                value={editForm.gender}
                                onChange={handleInputChange}
                                required
                              >
                                <option value="">Selecione...</option>
                                <option value="masculino">Masculino</option>
                                <option value="feminino">Feminino</option>
                                <option value="outro">Outro</option>
                              </Input>
                            ) : (
                              <Input
                                type="text"
                                name="gender"
                                value={userData.personalInfo?.gender || ""}
                                disabled
                                readOnly
                              />
                            )}
                          </div>
                        </Col>
                        <Col md={6}></Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>

                <Col lg={12}>
                  <Row>
                    <Col md={12}>
                      <Card>
                        <CardBody>
                          <h5 className="card-title mb-4">
                            <i className="bx bx-user-circle me-2"></i>
                            Informações profissionais
                          </h5>
                          <Row>
                            <Col md={6}>
                              <div className="mb-3">
                                <Label>Especialização</Label>
                                <Input
                                  type="text"
                                  name="specialization"
                                  value={
                                    isEditing
                                      ? editForm.specialization
                                      : userData.professionalInfo
                                          ?.specialization || ""
                                  }
                                  onChange={handleInputChange}
                                  disabled={!isEditing}
                                />
                              </div>
                            </Col>
                            <Col md={6}>
                              <div className="mb-3">
                                <Label>Matricula</Label>
                                <Input
                                  type="text"
                                  name="registration"
                                  value={
                                    isEditing
                                      ? editForm.registration
                                      : userData.professionalInfo
                                          ?.registration || ""
                                  }
                                  disabled={true}
                                />
                              </div>
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </Col>

                <Col md={12}>
                  <Card>
                    <CardBody>
                      <h5 className="card-title mb-4">
                        <i className="bx bx-map me-2"></i>
                        Endereço
                      </h5>
                      <Row>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label>Rua</Label>
                            <Input
                              type="text"
                              name="address"
                              value={
                                isEditing
                                  ? editForm.street
                                  : userData.address?.street || ""
                              }
                              onChange={handleInputChange}
                              disabled={!isEditing}
                            />
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label>Número</Label>
                            <Input
                              type="text"
                              name="number"
                              value={
                                isEditing
                                  ? editForm.number
                                  : userData.address?.number || ""
                              }
                              onChange={handleInputChange}
                              disabled={!isEditing}
                            />
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label>Complemento</Label>
                            <Input
                              type="text"
                              name="complement"
                              value={
                                isEditing
                                  ? editForm.complement
                                  : userData.address?.complement || ""
                              }
                              onChange={handleInputChange}
                              disabled={!isEditing}
                            />
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label>Bairro</Label>
                            <Input
                              type="text"
                              name="neighborhood"
                              value={
                                isEditing
                                  ? editForm.neighborhood
                                  : userData.address?.neighborhood || ""
                              }
                              onChange={handleInputChange}
                              disabled={!isEditing}
                            />
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label>Cidade</Label>
                            <Input
                              type="text"
                              name="city"
                              value={
                                isEditing
                                  ? editForm.city
                                  : userData.address?.city || ""
                              }
                              onChange={handleInputChange}
                              disabled={!isEditing}
                            />
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label>Estado</Label>
                            <Input
                              type="text"
                              name="state"
                              value={
                                isEditing
                                  ? editForm.state
                                  : userData.address?.state || ""
                              }
                              onChange={handleInputChange}
                              disabled={!isEditing}
                            />
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label>CEP</Label>
                            <Input
                              type="text"
                              name="cep"
                              value={
                                isEditing
                                  ? editForm.cep
                                  : userData.address?.cep || ""
                              }
                              onChange={handleInputChange}
                              disabled={!isEditing}
                            />
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(UserProfile);
