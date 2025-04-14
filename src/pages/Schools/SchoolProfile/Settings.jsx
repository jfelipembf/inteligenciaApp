import React, { useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Row,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";

const Settings = ({ school }) => {
  const [formData, setFormData] = useState({
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
    privacy: {
      showContactInfo: true,
      showFinancialInfo: false,
    },
    integration: {
      enableAPI: false,
      enableWebhooks: false,
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implementar atualização das configurações
    console.log("Configurações atualizadas:", formData);
  };

  const handleChange = (section, field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
      }
    }));
  };

  return (
    <React.Fragment>
      <Row>
        <Col lg={12}>
          <Card>
            <CardBody>
              <h4 className="card-title mb-4">Configurações da Escola</h4>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Card>
                      <CardBody>
                        <h5 className="font-size-15 mb-3">Notificações</h5>
                        <FormGroup check className="mb-3">
                          <Input
                            type="checkbox"
                            id="emailNotif"
                            checked={formData.notifications.email}
                            onChange={handleChange('notifications', 'email')}
                          />
                          <Label check for="emailNotif">
                            Notificações por Email
                          </Label>
                        </FormGroup>
                        <FormGroup check className="mb-3">
                          <Input
                            type="checkbox"
                            id="smsNotif"
                            checked={formData.notifications.sms}
                            onChange={handleChange('notifications', 'sms')}
                          />
                          <Label check for="smsNotif">
                            Notificações por SMS
                          </Label>
                        </FormGroup>
                        <FormGroup check>
                          <Input
                            type="checkbox"
                            id="pushNotif"
                            checked={formData.notifications.push}
                            onChange={handleChange('notifications', 'push')}
                          />
                          <Label check for="pushNotif">
                            Notificações Push
                          </Label>
                        </FormGroup>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card>
                      <CardBody>
                        <h5 className="font-size-15 mb-3">Privacidade</h5>
                        <FormGroup check className="mb-3">
                          <Input
                            type="checkbox"
                            id="showContact"
                            checked={formData.privacy.showContactInfo}
                            onChange={handleChange('privacy', 'showContactInfo')}
                          />
                          <Label check for="showContact">
                            Mostrar Informações de Contato
                          </Label>
                        </FormGroup>
                        <FormGroup check>
                          <Input
                            type="checkbox"
                            id="showFinancial"
                            checked={formData.privacy.showFinancialInfo}
                            onChange={handleChange('privacy', 'showFinancialInfo')}
                          />
                          <Label check for="showFinancial">
                            Mostrar Informações Financeiras
                          </Label>
                        </FormGroup>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
                <Row className="mt-4">
                  <Col md={12}>
                    <Card>
                      <CardBody>
                        <h5 className="font-size-15 mb-3">Integrações</h5>
                        <FormGroup check className="mb-3">
                          <Input
                            type="checkbox"
                            id="enableAPI"
                            checked={formData.integration.enableAPI}
                            onChange={handleChange('integration', 'enableAPI')}
                          />
                          <Label check for="enableAPI">
                            Habilitar API
                          </Label>
                        </FormGroup>
                        <FormGroup check>
                          <Input
                            type="checkbox"
                            id="enableWebhooks"
                            checked={formData.integration.enableWebhooks}
                            onChange={handleChange('integration', 'enableWebhooks')}
                          />
                          <Label check for="enableWebhooks">
                            Habilitar Webhooks
                          </Label>
                        </FormGroup>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
                <div className="text-end mt-4">
                  <Button type="submit" color="primary">
                    Salvar Configurações
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Settings; 