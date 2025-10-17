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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUser,
  faCog,
  faSearch,
  faHeart,
  faStar,
  faPlus,
  faEdit,
  faTrash,
  faSave,
  faDownload,
  faUpload,
  faEye,
  faEyeSlash,
  faLock,
  faUnlock,
  faCheck,
  faTimes,
  faArrowLeft,
  faArrowRight,
  faArrowUp,
  faArrowDown,
  faBars,
  faTimes as faTimesCircle,
  faInfo,
  faExclamation,
  faQuestion,
  faWarning,
  faBell,
  faEnvelope,
  faPhone,
  faCalendar,
  faClock,
  faMapMarker,
  faGlobe,
  faLink,
  faImage,
  faFile,
  faFolder,
  faDatabase,
  faServer,
  faCloud,
  faWifi,
  faBluetooth,
  faBatteryFull,
  faBatteryHalf,
  faBatteryEmpty,
  faVolumeUp,
  faVolumeDown,
  faVolumeMute,
  faPlay,
  faPause,
  faStop,
  faForward,
  faBackward,
  faRedo,
  faUndo,
  faRefresh,
  faSync,
  faSpinner,
  faCircle,
  faSquare,
  faTriangle,
  faDiamond,
} from "@fortawesome/free-solid-svg-icons";
import {
  faHeart as faHeartRegular,
  faStar as faStarRegular,
  faUser as faUserRegular,
  faEnvelope as faEnvelopeRegular,
  faFile as faFileRegular,
  faFolder as faFolderRegular,
  faCircle as faCircleRegular,
  faSquare as faSquareRegular,
  faTriangle as faTriangleRegular,
  faDiamond as faDiamondRegular,
} from "@fortawesome/free-regular-svg-icons";
import {
  faGithub,
  faTwitter,
  faFacebook,
  faInstagram,
  faLinkedin,
  faYoutube,
  faGoogle,
  faApple,
  faMicrosoft,
  faAmazon,
  faSpotify,
  faDiscord,
  faSlack,
  faTrello,
  faFigma,
  faSketch,
  faAdobe,
  faDocker,
  faGit,
  faGitlab,
  faBitbucket,
  faStackOverflow,
  faReddit,
  faPinterest,
  faSnapchat,
  faTiktok,
  faWhatsapp,
  faTelegram,
  faViber,
  faSkype,
  faZoom,
  faTeams,
  faDropbox,
  faGoogleDrive,
  faOneDrive,
  faBox,
  faSalesforce,
  faHubspot,
  faMailchimp,
  faStripe,
  faPaypal,
  faVisa,
  faMastercard,
  faAmex,
  faDiscover,
  faJcb,
  faDinersClub,
} from "@fortawesome/free-brands-svg-icons";

// Componente de ícone individual
const IconItem = ({ icon, name, prefix }) => (
  <Col xl="3" lg="4" sm="6" className="mb-3">
    <div className="icon-item p-3 border rounded text-center">
      <FontAwesomeIcon icon={icon} size="2x" className="mb-2" />
      <div className="small text-muted">
        {prefix} fa-{name}
      </div>
    </div>
  </Col>
);

// PropTypes para validação
IconItem.propTypes = {
  icon: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  prefix: PropTypes.string.isRequired,
};

const IconFontawesomeTreeShaking = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Ícones organizados por categoria
  const iconCategories = useMemo(() => {
    const solidIcons = [
      { icon: faHome, name: "home", prefix: "fas" },
      { icon: faUser, name: "user", prefix: "fas" },
      { icon: faCog, name: "cog", prefix: "fas" },
      { icon: faSearch, name: "search", prefix: "fas" },
      { icon: faHeart, name: "heart", prefix: "fas" },
      { icon: faStar, name: "star", prefix: "fas" },
      { icon: faPlus, name: "plus", prefix: "fas" },
      { icon: faEdit, name: "edit", prefix: "fas" },
      { icon: faTrash, name: "trash", prefix: "fas" },
      { icon: faSave, name: "save", prefix: "fas" },
      { icon: faDownload, name: "download", prefix: "fas" },
      { icon: faUpload, name: "upload", prefix: "fas" },
      { icon: faEye, name: "eye", prefix: "fas" },
      { icon: faEyeSlash, name: "eye-slash", prefix: "fas" },
      { icon: faLock, name: "lock", prefix: "fas" },
      { icon: faUnlock, name: "unlock", prefix: "fas" },
      { icon: faCheck, name: "check", prefix: "fas" },
      { icon: faTimes, name: "times", prefix: "fas" },
      { icon: faArrowLeft, name: "arrow-left", prefix: "fas" },
      { icon: faArrowRight, name: "arrow-right", prefix: "fas" },
      { icon: faArrowUp, name: "arrow-up", prefix: "fas" },
      { icon: faArrowDown, name: "arrow-down", prefix: "fas" },
      { icon: faBars, name: "bars", prefix: "fas" },
      { icon: faTimesCircle, name: "times-circle", prefix: "fas" },
      { icon: faInfo, name: "info", prefix: "fas" },
      { icon: faExclamation, name: "exclamation", prefix: "fas" },
      { icon: faQuestion, name: "question", prefix: "fas" },
      { icon: faWarning, name: "warning", prefix: "fas" },
      { icon: faBell, name: "bell", prefix: "fas" },
      { icon: faEnvelope, name: "envelope", prefix: "fas" },
      { icon: faPhone, name: "phone", prefix: "fas" },
      { icon: faCalendar, name: "calendar", prefix: "fas" },
      { icon: faClock, name: "clock", prefix: "fas" },
      { icon: faMapMarker, name: "map-marker", prefix: "fas" },
      { icon: faGlobe, name: "globe", prefix: "fas" },
      { icon: faLink, name: "link", prefix: "fas" },
      { icon: faImage, name: "image", prefix: "fas" },
      { icon: faFile, name: "file", prefix: "fas" },
      { icon: faFolder, name: "folder", prefix: "fas" },
      { icon: faDatabase, name: "database", prefix: "fas" },
      { icon: faServer, name: "server", prefix: "fas" },
      { icon: faCloud, name: "cloud", prefix: "fas" },
      { icon: faWifi, name: "wifi", prefix: "fas" },
      { icon: faBluetooth, name: "bluetooth", prefix: "fas" },
      { icon: faBatteryFull, name: "battery-full", prefix: "fas" },
      { icon: faBatteryHalf, name: "battery-half", prefix: "fas" },
      { icon: faBatteryEmpty, name: "battery-empty", prefix: "fas" },
      { icon: faVolumeUp, name: "volume-up", prefix: "fas" },
      { icon: faVolumeDown, name: "volume-down", prefix: "fas" },
      { icon: faVolumeMute, name: "volume-mute", prefix: "fas" },
      { icon: faPlay, name: "play", prefix: "fas" },
      { icon: faPause, name: "pause", prefix: "fas" },
      { icon: faStop, name: "stop", prefix: "fas" },
      { icon: faForward, name: "forward", prefix: "fas" },
      { icon: faBackward, name: "backward", prefix: "fas" },
      { icon: faRedo, name: "redo", prefix: "fas" },
      { icon: faUndo, name: "undo", prefix: "fas" },
      { icon: faRefresh, name: "refresh", prefix: "fas" },
      { icon: faSync, name: "sync", prefix: "fas" },
      { icon: faSpinner, name: "spinner", prefix: "fas" },
      { icon: faCircle, name: "circle", prefix: "fas" },
      { icon: faSquare, name: "square", prefix: "fas" },
      { icon: faTriangle, name: "triangle", prefix: "fas" },
      { icon: faDiamond, name: "diamond", prefix: "fas" },
    ];

    const regularIcons = [
      { icon: faHeartRegular, name: "heart", prefix: "far" },
      { icon: faStarRegular, name: "star", prefix: "far" },
      { icon: faUserRegular, name: "user", prefix: "far" },
      { icon: faEnvelopeRegular, name: "envelope", prefix: "far" },
      { icon: faFileRegular, name: "file", prefix: "far" },
      { icon: faFolderRegular, name: "folder", prefix: "far" },
      { icon: faCircleRegular, name: "circle", prefix: "far" },
      { icon: faSquareRegular, name: "square", prefix: "far" },
      { icon: faTriangleRegular, name: "triangle", prefix: "far" },
      { icon: faDiamondRegular, name: "diamond", prefix: "far" },
    ];

    const brandIcons = [
      { icon: faGithub, name: "github", prefix: "fab" },
      { icon: faTwitter, name: "twitter", prefix: "fab" },
      { icon: faFacebook, name: "facebook", prefix: "fab" },
      { icon: faInstagram, name: "instagram", prefix: "fab" },
      { icon: faLinkedin, name: "linkedin", prefix: "fab" },
      { icon: faYoutube, name: "youtube", prefix: "fab" },
      { icon: faGoogle, name: "google", prefix: "fab" },
      { icon: faApple, name: "apple", prefix: "fab" },
      { icon: faMicrosoft, name: "microsoft", prefix: "fab" },
      { icon: faAmazon, name: "amazon", prefix: "fab" },
      { icon: faSpotify, name: "spotify", prefix: "fab" },
      { icon: faDiscord, name: "discord", prefix: "fab" },
      { icon: faSlack, name: "slack", prefix: "fab" },
      { icon: faTrello, name: "trello", prefix: "fab" },
      { icon: faFigma, name: "figma", prefix: "fab" },
      { icon: faSketch, name: "sketch", prefix: "fab" },
      { icon: faAdobe, name: "adobe", prefix: "fab" },
      { icon: faDocker, name: "docker", prefix: "fab" },
      { icon: faGit, name: "git", prefix: "fab" },
      { icon: faGitlab, name: "gitlab", prefix: "fab" },
      { icon: faBitbucket, name: "bitbucket", prefix: "fab" },
      { icon: faStackOverflow, name: "stack-overflow", prefix: "fab" },
      { icon: faReddit, name: "reddit", prefix: "fab" },
      { icon: faPinterest, name: "pinterest", prefix: "fab" },
      { icon: faSnapchat, name: "snapchat", prefix: "fab" },
      { icon: faTiktok, name: "tiktok", prefix: "fab" },
      { icon: faWhatsapp, name: "whatsapp", prefix: "fab" },
      { icon: faTelegram, name: "telegram", prefix: "fab" },
      { icon: faViber, name: "viber", prefix: "fab" },
      { icon: faSkype, name: "skype", prefix: "fab" },
      { icon: faZoom, name: "zoom", prefix: "fab" },
      { icon: faTeams, name: "teams", prefix: "fab" },
      { icon: faDropbox, name: "dropbox", prefix: "fab" },
      { icon: faGoogleDrive, name: "google-drive", prefix: "fab" },
      { icon: faOneDrive, name: "onedrive", prefix: "fab" },
      { icon: faBox, name: "box", prefix: "fab" },
      { icon: faSalesforce, name: "salesforce", prefix: "fab" },
      { icon: faHubspot, name: "hubspot", prefix: "fab" },
      { icon: faMailchimp, name: "mailchimp", prefix: "fab" },
      { icon: faStripe, name: "stripe", prefix: "fab" },
      { icon: faPaypal, name: "paypal", prefix: "fab" },
      { icon: faVisa, name: "cc-visa", prefix: "fab" },
      { icon: faMastercard, name: "cc-mastercard", prefix: "fab" },
      { icon: faAmex, name: "cc-amex", prefix: "fab" },
      { icon: faDiscover, name: "cc-discover", prefix: "fab" },
      { icon: faJcb, name: "cc-jcb", prefix: "fab" },
      { icon: faDinersClub, name: "cc-diners-club", prefix: "fab" },
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
                    Use <code>&lt;FontAwesomeIcon icon={faHome} /&gt;</code>{" "}
                    <Badge color="success">v 6.0.0</Badge>.
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
                          icon={icon.icon}
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

export default IconFontawesomeTreeShaking;
