import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Button,
  Alert,
  Input,
  Label,
  Spinner,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import {
  seedPermissions,
  seedDefaultRolesForSchool,
  seedCeoAccount,
  runFullAccessControlSeed,
} from "../../utils/seed/initializeAccessControl";

const SeedPage = () => {
  document.title = "Seed de Desenvolvimento | InteliTec";
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const [seedData, setSeedData] = useState({
    ceoEmail: "ceo@example.com",
    ceoPassword: "SenhaForte123!",
    accountName: "Conta Master",
    schoolId: "",
    createdBy: "",
  });

  const handleSeedPermissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await seedPermissions();
      setResults({ permissions: result });
      console.log("Resultado permissões:", result);
    } catch (err) {
      setError(err.message);
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedRoles = async () => {
    if (!seedData.schoolId) {
      setError("schoolId é obrigatório para criar roles");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const result = await seedDefaultRolesForSchool(
        seedData.schoolId,
        seedData.createdBy || null
      );
      setResults({ roles: result });
      console.log("Resultado roles:", result);
    } catch (err) {
      setError(err.message);
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedCeo = async () => {
    if (!seedData.ceoEmail || !seedData.ceoPassword || !seedData.accountName) {
      setError("Email, senha e nome da conta são obrigatórios");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const result = await seedCeoAccount({
        email: seedData.ceoEmail,
        password: seedData.ceoPassword,
        accountName: seedData.accountName,
      });
      setResults({ ceo: result });
      console.log("Resultado CEO:", result);
    } catch (err) {
      setError(err.message);
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFullSeed = async () => {
    if (!seedData.ceoEmail || !seedData.ceoPassword || !seedData.accountName) {
      setError("Email, senha e nome da conta são obrigatórios");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const result = await runFullAccessControlSeed({
        ceoEmail: seedData.ceoEmail,
        ceoPassword: seedData.ceoPassword,
        accountName: seedData.accountName,
        schoolId: seedData.schoolId || undefined,
        createdBy: seedData.createdBy || undefined,
      });
      setResults({ full: result });
      console.log("Resultado seed completo:", result);
    } catch (err) {
      setError(err.message);
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs
          title="Seed de Desenvolvimento"
          breadcrumbItem="Controle de Acesso"
        />

        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <CardTitle tag="h4" className="mb-4">
                  🌱 Seed de Desenvolvimento - Controle de Acesso
                </CardTitle>

                <Alert color="warning" className="mb-4">
                  <strong>Atenção:</strong> Esta página é apenas para
                  desenvolvimento. Use apenas em ambiente de testes.
                </Alert>

                <Row className="mb-4">
                  <Col md={6}>
                    <Label>Email do CEO</Label>
                    <Input
                      type="email"
                      value={seedData.ceoEmail}
                      onChange={(e) =>
                        setSeedData({ ...seedData, ceoEmail: e.target.value })
                      }
                      placeholder="ceo@example.com"
                    />
                  </Col>
                  <Col md={6}>
                    <Label>Senha do CEO</Label>
                    <Input
                      type="password"
                      value={seedData.ceoPassword}
                      onChange={(e) =>
                        setSeedData({
                          ...seedData,
                          ceoPassword: e.target.value,
                        })
                      }
                      placeholder="SenhaForte123!"
                    />
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col md={6}>
                    <Label>Nome da Conta</Label>
                    <Input
                      type="text"
                      value={seedData.accountName}
                      onChange={(e) =>
                        setSeedData({
                          ...seedData,
                          accountName: e.target.value,
                        })
                      }
                      placeholder="Conta Master"
                    />
                  </Col>
                  <Col md={6}>
                    <Label>School ID (Opcional - para roles)</Label>
                    <Input
                      type="text"
                      value={seedData.schoolId}
                      onChange={(e) =>
                        setSeedData({ ...seedData, schoolId: e.target.value })
                      }
                      placeholder="ID da escola"
                    />
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col md={6}>
                    <Label>Created By (Opcional - UID do criador)</Label>
                    <Input
                      type="text"
                      value={seedData.createdBy}
                      onChange={(e) =>
                        setSeedData({ ...seedData, createdBy: e.target.value })
                      }
                      placeholder="UID do usuário criador"
                    />
                  </Col>
                </Row>

                <hr className="my-4" />

                <Row>
                  <Col md={6} className="mb-3">
                    <Button
                      color="primary"
                      block
                      onClick={handleSeedPermissions}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Carregando...
                        </>
                      ) : (
                        "1️⃣ Popular Permissões"
                      )}
                    </Button>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Button
                      color="info"
                      block
                      onClick={handleSeedRoles}
                      disabled={loading || !seedData.schoolId}
                    >
                      {loading ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Carregando...
                        </>
                      ) : (
                        "2️⃣ Criar Roles Padrão"
                      )}
                    </Button>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Button
                      color="success"
                      block
                      onClick={handleSeedCeo}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Carregando...
                        </>
                      ) : (
                        "3️⃣ Criar Conta CEO"
                      )}
                    </Button>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Button
                      color="danger"
                      block
                      onClick={handleFullSeed}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Carregando...
                        </>
                      ) : (
                        "🚀 Seed Completo (Tudo)"
                      )}
                    </Button>
                  </Col>
                </Row>

                {error && (
                  <Alert color="danger" className="mt-4">
                    <strong>Erro:</strong> {error}
                  </Alert>
                )}

                {results && (
                  <Alert color="success" className="mt-4">
                    <strong>Resultado:</strong>
                    <pre style={{ whiteSpace: "pre-wrap", marginTop: "10px" }}>
                      {JSON.stringify(results, null, 2)}
                    </pre>
                  </Alert>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SeedPage;
