import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import {
  Row,
  Col,
  Card,
  CardBody,
  Container,
  Badge,
  Input,
  FormGroup,
  Label,
} from "reactstrap";

// Componente de ícone individual simples
const IconItem = ({ name, prefix, className }) => (
  <Col xl="3" lg="4" sm="6" className="mb-3">
    <div className="icon-item p-3 border rounded text-center">
      <i className={`${prefix} fa-${name} fa-2x mb-2`}></i>
      <div className="small text-muted">
        {prefix} fa-{name}
      </div>
    </div>
  </Col>
);

// PropTypes para validação
IconItem.propTypes = {
  name: PropTypes.string.isRequired,
  prefix: PropTypes.string.isRequired,
  className: PropTypes.string,
};

const IconFontawesomeSimple = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Ícones organizados por categoria (usando classes CSS)
  const iconCategories = useMemo(() => {
    const solidIcons = [
      { name: "home", prefix: "fas" },
      { name: "user", prefix: "fas" },
      { name: "cog", prefix: "fas" },
      { name: "search", prefix: "fas" },
      { name: "heart", prefix: "fas" },
      { name: "star", prefix: "fas" },
      { name: "plus", prefix: "fas" },
      { name: "edit", prefix: "fas" },
      { name: "trash", prefix: "fas" },
      { name: "save", prefix: "fas" },
      { name: "download", prefix: "fas" },
      { name: "upload", prefix: "fas" },
      { name: "eye", prefix: "fas" },
      { name: "eye-slash", prefix: "fas" },
      { name: "lock", prefix: "fas" },
      { name: "unlock", prefix: "fas" },
      { name: "check", prefix: "fas" },
      { name: "times", prefix: "fas" },
      { name: "arrow-left", prefix: "fas" },
      { name: "arrow-right", prefix: "fas" },
      { name: "arrow-up", prefix: "fas" },
      { name: "arrow-down", prefix: "fas" },
      { name: "bars", prefix: "fas" },
      { name: "info", prefix: "fas" },
      { name: "exclamation", prefix: "fas" },
      { name: "question", prefix: "fas" },
      { name: "warning", prefix: "fas" },
      { name: "bell", prefix: "fas" },
      { name: "envelope", prefix: "fas" },
      { name: "phone", prefix: "fas" },
      { name: "calendar", prefix: "fas" },
      { name: "clock", prefix: "fas" },
      { name: "map-marker", prefix: "fas" },
      { name: "globe", prefix: "fas" },
      { name: "link", prefix: "fas" },
      { name: "image", prefix: "fas" },
      { name: "file", prefix: "fas" },
      { name: "folder", prefix: "fas" },
      { name: "database", prefix: "fas" },
      { name: "server", prefix: "fas" },
      { name: "cloud", prefix: "fas" },
      { name: "wifi", prefix: "fas" },
      { name: "bluetooth", prefix: "fas" },
      { name: "play", prefix: "fas" },
      { name: "pause", prefix: "fas" },
      { name: "stop", prefix: "fas" },
      { name: "refresh", prefix: "fas" },
      { name: "sync", prefix: "fas" },
      { name: "spinner", prefix: "fas" },
      { name: "circle", prefix: "fas" },
      { name: "square", prefix: "fas" },
    ];

    const regularIcons = [
      { name: "heart", prefix: "far" },
      { name: "star", prefix: "far" },
      { name: "user", prefix: "far" },
      { name: "envelope", prefix: "far" },
      { name: "file", prefix: "far" },
      { name: "folder", prefix: "far" },
      { name: "circle", prefix: "far" },
      { name: "square", prefix: "far" },
    ];

    const brandIcons = [
      { name: "github", prefix: "fab" },
      { name: "twitter", prefix: "fab" },
      { name: "facebook", prefix: "fab" },
      { name: "instagram", prefix: "fab" },
      { name: "linkedin", prefix: "fab" },
      { name: "youtube", prefix: "fab" },
      { name: "google", prefix: "fab" },
      { name: "apple", prefix: "fab" },
      { name: "microsoft", prefix: "fab" },
      { name: "amazon", prefix: "fab" },
      { name: "spotify", prefix: "fab" },
      { name: "discord", prefix: "fab" },
      { name: "slack", prefix: "fab" },
      { name: "docker", prefix: "fab" },
      { name: "git", prefix: "fab" },
      { name: "gitlab", prefix: "fab" },
      { name: "bitbucket", prefix: "fab" },
      { name: "stack-overflow", prefix: "fab" },
      { name: "reddit", prefix: "fab" },
      { name: "pinterest", prefix: "fab" },
      { name: "snapchat", prefix: "fab" },
      { name: "tiktok", prefix: "fab" },
      { name: "whatsapp", prefix: "fab" },
      { name: "telegram", prefix: "fab" },
      { name: "skype", prefix: "fab" },
      { name: "zoom", prefix: "fab" },
      { name: "dropbox", prefix: "fab" },
      { name: "google-drive", prefix: "fab" },
      { name: "paypal", prefix: "fab" },
    ];

    return {
      solid: solidIcons,
      regular: regularIcons,
      brands: brandIcons,
    };
  }, []);

  // Filtrar ícones baseado na busca e categoria
  const filteredIcons = useMemo(() => {
    let icons = [];

    if (selectedCategory === "all") {
      icons = [
        ...iconCategories.solid,
        ...iconCategories.regular,
        ...iconCategories.brands,
      ];
    } else {
      icons = iconCategories[selectedCategory] || [];
    }

    if (searchTerm) {
      icons = icons.filter((icon) =>
        icon.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return icons;
  }, [iconCategories, searchTerm, selectedCategory]);

  //meta title
  React.useEffect(() => {
    document.title =
      "Font Awesome | Skote - Vite React Admin & Dashboard Template";
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Icons" breadcrumbItem="Font Awesome" />

          {/* Filtros */}
          <Row className="mb-4">
            <Col md="6">
              <FormGroup>
                <Label for="search">Buscar ícones</Label>
                <Input
                  type="text"
                  id="search"
                  placeholder="Digite o nome do ícone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="category">Categoria</Label>
                <Input
                  type="select"
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">Todos</option>
                  <option value="solid">Solid</option>
                  <option value="regular">Regular</option>
                  <option value="brands">Brands</option>
                </Input>
              </FormGroup>
            </Col>
          </Row>

          {/* Resultados */}
          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <h4 className="card-title">
                    Ícones FontAwesome ({filteredIcons.length} encontrados)
                  </h4>
                  <p className="card-title-desc mb-2">
                    Use <code>&lt;i className="fas fa-home"&gt;&lt;/i&gt;</code>{" "}
                    <Badge color="success">v 5.13.0</Badge>.
                  </p>

                  {filteredIcons.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-muted">Nenhum ícone encontrado.</p>
                    </div>
                  ) : (
                    <Row className="icon-demo-content">
                      {filteredIcons.map((icon, index) => (
                        <IconItem
                          key={`${icon.prefix}-${icon.name}-${index}`}
                          name={icon.name}
                          prefix={icon.prefix}
                        />
                      ))}
                    </Row>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default IconFontawesomeSimple;
