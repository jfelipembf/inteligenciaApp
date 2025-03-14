import React, { useState } from "react";
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/Common/Breadcrumb";
import InputMask from "react-input-mask";
import ImageUploader from "../../components/Common/ImageUploader";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const AddStudent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    birthDate: "",
    registration: "",
    grade: "",
    class: "",
    gender: "",
    profileImage: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Get current user to access schoolId
      const currentUser = firebase.auth().currentUser;
      const userDoc = await firebase.firestore().collection('users').doc(currentUser.uid).get();
      const schoolId = userDoc.data().schoolId;

      // Create user with email and password
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(formData.email, formData.registration);
      const user = userCredential.user;

      // Upload profile image if exists
      let profileImageUrl = null;
      if (formData.profileImage) {
        const storageRef = firebase.storage().ref();
        const imageRef = storageRef.child(`profile_images/${user.uid}`);
        await imageRef.put(formData.profileImage);
        profileImageUrl = await imageRef.getDownloadURL();
      }

      // Save user data to Firestore
      await firebase.firestore().collection('users').doc(user.uid).set({
        role: "aluno",
        schoolId: schoolId,
        personalInfo: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          birthDate: formData.birthDate,
          gender: formData.gender,
          profileImage: profileImageUrl
        },
        academicInfo: {
          registration: formData.registration,
          grade: formData.grade,
          class: formData.class
        },
        metadata: {
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }
      });

      // Navigate to students list
      navigate("/students");
    } catch (error) {
      console.error("Error creating student:", error);
      alert("Erro ao criar aluno: " + error.message);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Alunos" breadcrumbItem="Novo Aluno" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <h4 className="card-title mb-4">Cadastro de Novo Aluno</h4>
                  <Form onSubmit={handleSubmit}>
                    {/* Foto de Perfil */}
                    <FormGroup className="mb-4">
                      <Label>Foto de Perfil</Label>
                      <div className="d-flex align-items-center">
                        <ImageUploader
                          image={formData.profileImage}
                          onImageChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setFormData(prev => ({
                                ...prev,
                                profileImage: file
                              }));
                            }
                          }}
                        />
                      </div>
                    </FormGroup>

                    <h5 className="font-size-14 mb-3">Dados do Aluno</h5>
                    <Row>
                      <Col md={6}>
                        <FormGroup className="mb-3">
                          <Label>Nome Completo</Label>
                          <Input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup className="mb-3">
                          <Label>Email</Label>
                          <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup className="mb-3">
                          <Label>Telefone</Label>
                          <InputMask
                            mask="(99) 99999-9999"
                            value={formData.phone}
                            onChange={handleInputChange}
                          >
                            {(inputProps) => (
                              <Input
                                {...inputProps}
                                type="text"
                                name="phone"
                                required
                              />
                            )}
                          </InputMask>
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup className="mb-3">
                          <Label>Data de Nascimento</Label>
                          <Input
                            type="date"
                            name="birthDate"
                            value={formData.birthDate}
                            onChange={handleInputChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup className="mb-3">
                          <Label>Matrícula</Label>
                          <Input
                            type="text"
                            name="registration"
                            value={formData.registration}
                            onChange={handleInputChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup className="mb-3">
                          <Label>Sexo</Label>
                          <Input
                            type="select"
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Selecione...</option>
                            <option value="masculino">Masculino</option>
                            <option value="feminino">Feminino</option>
                            <option value="outros">Outros</option>
                          </Input>
                        </FormGroup>
                      </Col>
                    </Row>

                    <h5 className="font-size-14 mb-3 mt-4">Dados Escolares</h5>
                    <Row>
                      <Col md={6}>
                        <FormGroup className="mb-3">
                          <Label>Série</Label>
                          <Input
                            type="select"
                            name="grade"
                            value={formData.grade}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Selecione...</option>
                            <option value="5º Ano">5º Ano</option>
                            <option value="6º Ano">6º Ano</option>
                            <option value="7º Ano">7º Ano</option>
                            <option value="8º Ano">8º Ano</option>
                            <option value="9º Ano">9º Ano</option>
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup className="mb-3">
                          <Label>Turma</Label>
                          <Input
                            type="select"
                            name="class"
                            value={formData.class}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Selecione...</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                          </Input>
                        </FormGroup>
                      </Col>
                    </Row>

                    <div className="d-flex justify-content-end gap-2 mt-4">
                      <Button type="button" color="secondary" tag={Link} to="/students">
                        Cancelar
                      </Button>
                      <Button type="submit" color="primary">
                        Cadastrar
                      </Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AddStudent;
