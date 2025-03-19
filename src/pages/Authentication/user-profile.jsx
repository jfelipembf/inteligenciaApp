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

const UserProfile = () => {
  document.title = "Perfil | Skote";
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
    dateOfBirth: "",
    gender: "",
    address: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    cep: "",
    country: ""
  });

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
      if (localStorage.getItem("authUser")) {
        const obj = JSON.parse(localStorage.getItem("authUser"));
        let firestoreUser = JSON.parse(localStorage.getItem("firestoreUser"));

        // Se não tiver dados do Firestore, busca novamente
        if (!firestoreUser) {
          firestoreUser = await getFirebaseBackend().getUserData(obj.uid);
        }

        console.log("Dados do Auth:", obj);
        console.log("Dados do Firestore:", firestoreUser);

        setname(obj.displayName);
        setemail(obj.email);
        setidx(obj.uid);
        setUserData(firestoreUser || {});
      }
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
        dateOfBirth: userData.personalInfo?.dateOfBirth || "",
        gender: userData.personalInfo?.gender || "",
        address: userData.addressInfo?.address || "",
        number: userData.addressInfo?.number || "",
        complement: userData.addressInfo?.complement || "",
        neighborhood: userData.addressInfo?.neighborhood || "",
        city: userData.addressInfo?.city || "",
        state: userData.addressInfo?.state || "",
        cep: userData.addressInfo?.cep || "",
        country: userData.addressInfo?.country || ""
      });
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const updateData = {
        personalInfo: {
          ...userData.personalInfo,
          name: editForm.name,
          cpf: editForm.cpf,
          rg: editForm.rg,
          dateOfBirth: editForm.dateOfBirth,
          gender: editForm.gender
        },
        addressInfo: {
          address: editForm.address,
          number: editForm.number,
          complement: editForm.complement,
          neighborhood: editForm.neighborhood,
          city: editForm.city,
          state: editForm.state,
          cep: editForm.cep,
          country: editForm.country
        }
      };

      await getFirebaseBackend().updateUserData(idx, updateData);
      setIsEditing(false);
      
      // Recarrega os dados do usuário
      const updatedUser = await getFirebaseBackend().getUserData(idx);
      setUserData(updatedUser);
      
      // Mostra mensagem de sucesso
      setAlertMessage("Perfil atualizado com sucesso!");
      
      // Remove a mensagem após 3 segundos
      setTimeout(() => {
        setAlertMessage("");
      }, 3000);
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
      // Mostra mensagem de erro
      setAlertMessage("Erro ao atualizar perfil. Tente novamente.");
      
      // Remove a mensagem após 3 segundos
      setTimeout(() => {
        setAlertMessage("");
      }, 3000);
    }
  };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      username: name || '',
      idx: idx || '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Por favor, insira seu nome de usuário"),
    }),
    onSubmit: (values) => {
      dispatch(editProfile({ username: values.username, uid: values.idx }));
    }
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
            <Col xl={4}>
              <Card className="overflow-hidden">
                <div className="bg-primary-subtle">
                  <Row>
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
                <CardBody className="pt-0">
                  <Row>
                    <Col sm="4">
                      <div className="avatar-md profile-user-wid mb-4">
                        <img
                          src={userData.personalInfo?.img || avatar}
                          alt=""
                          className="img-thumbnail rounded-circle"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = avatar;
                          }}
                        />
                      </div>
                    </Col>

                    <Col sm="8">
                      <div className="pt-2">
                        <h5 className="font-size-15">{userData.personalInfo?.name || name}</h5>
                        <p className="text-muted mb-0">{email}</p>
                        <div className="mt-4">
                          <Button
                            color="primary"
                            size="sm"
                            onClick={() => setIsEditing(!isEditing)}
                          >
                            <i className={`bx ${isEditing ? 'bx-x' : 'bx-edit'} me-1`}></i>
                            {isEditing ? 'Cancelar Edição' : 'Editar Perfil'}
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
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>

            <Col lg={8}>
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
                              value={isEditing ? editForm.name : (userData.personalInfo?.name || '')}
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
                              value={isEditing ? editForm.cpf : (userData.personalInfo?.cpf || '')}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                            />
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label>RG</Label>
                            <Input
                              type="text"
                              name="rg"
                              value={isEditing ? editForm.rg : (userData.personalInfo?.rg || '')}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                            />
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label>Data de Nascimento</Label>
                            <Input
                              type="text"
                              name="dateOfBirth"
                              value={isEditing ? editForm.dateOfBirth : (userData.personalInfo?.birthDate || '')}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                            />
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label>Gênero</Label>
                            <Input
                              type="text"
                              name="gender"
                              value={isEditing ? editForm.gender : (userData.personalInfo?.gender || '')}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                            >
                              <option value="">Selecione...</option>
                              <option value="male">Masculino</option>
                              <option value="female">Feminino</option>
                            </Input>
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
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
                              value={isEditing ? editForm.address : (userData.address?.street || '')}
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
                              value={isEditing ? editForm.number : (userData.address?.number || '')}
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
                              value={isEditing ? editForm.complement : (userData.address?.complement || '')}
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
                              value={isEditing ? editForm.neighborhood : (userData.address?.neighborhood || '')}
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
                              value={isEditing ? editForm.city : (userData.address?.city || '')}
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
                              value={isEditing ? editForm.state : (userData.address?.state || '')}
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
                              value={isEditing ? editForm.cep : (userData.address?.cep || '')}
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
