import {
  UncontrolledAccordion,
  AccordionItem,
  AccordionHeader,
  AccordionBody,
  Badge,
} from "reactstrap";
import PropTypes from "prop-types";
import PermissionItem from "./PermissionItem";

const PermissionModule = ({ moduleName, permissions, defaultOpen = false }) => {
  if (!permissions || permissions.length === 0) {
    return null;
  }

  const moduleTranslations = {
    access_control: "Controle de Acesso",
    subjects: "Disciplinas",
    classes: "Turmas",
    lessons_activities: "Aulas e Atividades",
    communication: "Comunicação",
    reports_analytics: "Relatórios e Analytics",
  };

  const formatModuleName = (name) => {
    if (moduleTranslations[name]) {
      return moduleTranslations[name];
    }

    return name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formattedModuleName = formatModuleName(moduleName);
  const moduleId = `module-${moduleName}`;

  return (
    <UncontrolledAccordion
      defaultOpen={defaultOpen ? moduleId : undefined}
      flush
      className="mb-3"
    >
      <AccordionItem>
        <AccordionHeader targetId={moduleId}>
          <div className="d-flex justify-content-between align-items-center w-100 me-3">
            <span className="fw-semibold">{formattedModuleName}</span>
            <Badge color="primary" className="ms-2">
              {permissions.length}
            </Badge>
          </div>
        </AccordionHeader>
        <AccordionBody accordionId={moduleId}>
          <div className="mt-2">
            {permissions.map((permission) => (
              <PermissionItem
                key={permission.id || permission.name}
                permission={permission}
              />
            ))}
          </div>
        </AccordionBody>
      </AccordionItem>
    </UncontrolledAccordion>
  );
};

PermissionModule.propTypes = {
  moduleName: PropTypes.string.isRequired,
  permissions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      description: PropTypes.string,
      module: PropTypes.string,
      action: PropTypes.string,
    })
  ).isRequired,
  defaultOpen: PropTypes.bool,
};

export default PermissionModule;
