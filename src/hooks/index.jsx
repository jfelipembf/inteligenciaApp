import { AuthProvider } from "./auth/auth.jsx";
import { RolesProvider } from "./roles/roles.jsx";
import { PermissionsProvider } from "./permissions/permissions.jsx";
import PropTypes from "prop-types";

export function AppProvider({ children }) {
  return (
    <AuthProvider>
      <PermissionsProvider>
        <RolesProvider>{children}</RolesProvider>
      </PermissionsProvider>
    </AuthProvider>
  );
}

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
