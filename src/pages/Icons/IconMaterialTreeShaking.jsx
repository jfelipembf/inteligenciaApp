import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Badge,
  Input,
  FormGroup,
  Label,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Icon } from "@mdi/react";
import {
  mdiHome,
  mdiAccount,
  mdiCog,
  mdiMagnify,
  mdiHeart,
  mdiStar,
  mdiPlus,
  mdiPencil,
  mdiDelete,
  mdiContentSave,
  mdiDownload,
  mdiUpload,
  mdiEye,
  mdiEyeOff,
  mdiLock,
  mdiLockOpen,
  mdiCheck,
  mdiClose,
  mdiArrowLeft,
  mdiArrowRight,
  mdiArrowUp,
  mdiArrowDown,
  mdiMenu,
  mdiCloseCircle,
  mdiInformation,
  mdiAlert,
  mdiHelp,
  mdiAlertCircle,
  mdiBell,
  mdiEmail,
  mdiPhone,
  mdiCalendar,
  mdiClock,
  mdiMapMarker,
  mdiWeb,
  mdiLink,
  mdiImage,
  mdiFile,
  mdiFolder,
  mdiDatabase,
  mdiServer,
  mdiCloud,
  mdiWifi,
  mdiBluetooth,
  mdiBattery,
  mdiVolumeHigh,
  mdiVolumeLow,
  mdiVolumeOff,
  mdiPlay,
  mdiPause,
  mdiStop,
  mdiSkipForward,
  mdiSkipBackward,
  mdiRedo,
  mdiUndo,
  mdiRefresh,
  mdiSync,
  mdiLoading,
  mdiCircle,
  mdiSquare,
  mdiTriangle,
  mdiDiamond,
  mdiCircleOutline,
  mdiSquareOutline,
  mdiTriangleOutline,
  mdiDiamondOutline,
} from "@mdi/js";

// Componente de ícone individual
const IconItem = ({ icon, name }) => (
  <Col xl="3" lg="4" sm="6" className="mb-3">
    <div className="icon-item p-3 border rounded text-center">
      <Icon path={icon} size={2} className="mb-2" />
      <div className="small text-muted">mdi-{name}</div>
    </div>
  </Col>
);

// PropTypes para validação
IconItem.propTypes = {
  icon: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

const IconMaterialTreeShaking = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Ícones organizados por categoria
  const iconCategories = useMemo(() => {
    const basicIcons = [
      { icon: mdiHome, name: "home" },
      { icon: mdiAccount, name: "account" },
      { icon: mdiCog, name: "cog" },
      { icon: mdiMagnify, name: "magnify" },
      { icon: mdiHeart, name: "heart" },
      { icon: mdiStar, name: "star" },
      { icon: mdiPlus, name: "plus" },
      { icon: mdiPencil, name: "pencil" },
      { icon: mdiDelete, name: "delete" },
      { icon: mdiContentSave, name: "content-save" },
      { icon: mdiDownload, name: "download" },
      { icon: mdiUpload, name: "upload" },
      { icon: mdiEye, name: "eye" },
      { icon: mdiEyeOff, name: "eye-off" },
      { icon: mdiLock, name: "lock" },
      { icon: mdiLockOpen, name: "lock-open" },
      { icon: mdiCheck, name: "check" },
      { icon: mdiClose, name: "close" },
      { icon: mdiArrowLeft, name: "arrow-left" },
      { icon: mdiArrowRight, name: "arrow-right" },
      { icon: mdiArrowUp, name: "arrow-up" },
      { icon: mdiArrowDown, name: "arrow-down" },
      { icon: mdiMenu, name: "menu" },
      { icon: mdiCloseCircle, name: "close-circle" },
      { icon: mdiInformation, name: "information" },
      { icon: mdiAlert, name: "alert" },
      { icon: mdiHelp, name: "help" },
      { icon: mdiAlertCircle, name: "alert-circle" },
      { icon: mdiBell, name: "bell" },
      { icon: mdiEmail, name: "email" },
      { icon: mdiPhone, name: "phone" },
      { icon: mdiCalendar, name: "calendar" },
      { icon: mdiClock, name: "clock" },
      { icon: mdiMapMarker, name: "map-marker" },
      { icon: mdiWeb, name: "web" },
      { icon: mdiLink, name: "link" },
      { icon: mdiImage, name: "image" },
      { icon: mdiFile, name: "file" },
      { icon: mdiFolder, name: "folder" },
      { icon: mdiDatabase, name: "database" },
      { icon: mdiServer, name: "server" },
      { icon: mdiCloud, name: "cloud" },
      { icon: mdiWifi, name: "wifi" },
      { icon: mdiBluetooth, name: "bluetooth" },
      { icon: mdiBattery, name: "battery" },
      { icon: mdiVolumeHigh, name: "volume-high" },
      { icon: mdiVolumeLow, name: "volume-low" },
      { icon: mdiVolumeOff, name: "volume-off" },
      { icon: mdiPlay, name: "play" },
      { icon: mdiPause, name: "pause" },
      { icon: mdiStop, name: "stop" },
      { icon: mdiSkipForward, name: "skip-forward" },
      { icon: mdiSkipBackward, name: "skip-backward" },
      { icon: mdiRedo, name: "redo" },
      { icon: mdiUndo, name: "undo" },
      { icon: mdiRefresh, name: "refresh" },
      { icon: mdiSync, name: "sync" },
      { icon: mdiLoading, name: "loading" },
      { icon: mdiCircle, name: "circle" },
      { icon: mdiSquare, name: "square" },
      { icon: mdiTriangle, name: "triangle" },
      { icon: mdiDiamond, name: "diamond" },
      { icon: mdiCircleOutline, name: "circle-outline" },
      { icon: mdiSquareOutline, name: "square-outline" },
      { icon: mdiTriangleOutline, name: "triangle-outline" },
      { icon: mdiDiamondOutline, name: "diamond-outline" },
    ];

    return {
      basic: basicIcons,
    };
  }, []);

  // Filtrar ícones baseado na busca e categoria
  const filteredIcons = useMemo(() => {
    let icons = iconCategories.basic;

    if (searchTerm) {
      icons = icons.filter((icon) =>
        icon.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return icons;
  }, [iconCategories, searchTerm]);

  //meta title
  React.useEffect(() => {
    document.title =
      "Material Design Icons | Skote - Vite React Admin & Dashboard Template";
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Icons" breadcrumbItem="MDI" />

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
          </Row>

          {/* Resultados */}
          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <h4 className="card-title">
                    Ícones Material Design ({filteredIcons.length} encontrados)
                  </h4>
                  <p className="card-title-desc mb-2">
                    Use{" "}
                    <code>
                      &lt;Icon path={mdiHome} size={2} /&gt;
                    </code>{" "}
                    <Badge color="success">v 7.0.0</Badge>.
                  </p>

                  {filteredIcons.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-muted">Nenhum ícone encontrado.</p>
                    </div>
                  ) : (
                    <Row className="icon-demo-content">
                      {filteredIcons.map((icon, index) => (
                        <IconItem
                          key={`${icon.name}-${index}`}
                          icon={icon.icon}
                          name={icon.name}
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

export default IconMaterialTreeShaking;
