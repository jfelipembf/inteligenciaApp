import { createContext, useContext, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { permissionsService } from "../../services/permissions/permissionsService";

const PermissionsContext = createContext(undefined);

export function PermissionsProvider({ children }) {
  const [permissions, setPermissions] = useState([]);
  const [permissionsByModule, setPermissionsByModule] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadAllPermissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await permissionsService.getAllPermissions();

      if (result.success) {
        const permissionsList = result.data || [];
        setPermissions(permissionsList);

        const grouped = permissionsList.reduce((acc, permission) => {
          const module = permission.module || "other";
          if (!acc[module]) {
            acc[module] = [];
          }
          acc[module].push(permission);
          return acc;
        }, {});

        setPermissionsByModule(grouped);
      } else {
        setError(result.error);
        setPermissions([]);
        setPermissionsByModule({});
      }
    } catch (err) {
      console.error("Erro ao carregar permissões:", err);
      setError(err.message || "Erro ao carregar permissões");
      setPermissions([]);
      setPermissionsByModule({});
    } finally {
      setLoading(false);
    }
  }, []);

  const getPermissionsByModule = useCallback(
    (module) => {
      return permissionsByModule[module] || [];
    },
    [permissionsByModule]
  );

  const getPermissionById = useCallback(async (permissionId) => {
    try {
      setLoading(true);
      setError(null);

      const result = await permissionsService.getPermission(permissionId);

      if (result.success) {
        return result.data;
      } else {
        setError(result.error);
        return null;
      }
    } catch (err) {
      console.error("Erro ao buscar permissão:", err);
      setError(err.message || "Erro ao buscar permissão");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const resolvePermissions = useCallback(async (permissionIds) => {
    try {
      setLoading(true);
      setError(null);

      const result = await permissionsService.resolvePermissions(permissionIds);

      if (result.success) {
        return result.data || [];
      } else {
        setError(result.error);
        return [];
      }
    } catch (err) {
      console.error("Erro ao resolver permissões:", err);
      setError(err.message || "Erro ao resolver permissões");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPermissionsByModule = useCallback(async (module) => {
    try {
      setLoading(true);
      setError(null);

      const result = await permissionsService.getPermissionsByModule(module);

      if (result.success) {
        return result.data || [];
      } else {
        setError(result.error);
        return [];
      }
    } catch (err) {
      console.error("Erro ao buscar permissões por módulo:", err);
      setError(err.message || "Erro ao buscar permissões por módulo");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    permissions,
    permissionsByModule,
    loading,
    error,
    loadAllPermissions,
    getPermissionById,
    getPermissionsByModule,
    resolvePermissions,
    loadPermissionsByModule,
  };

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
}

PermissionsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function usePermissions() {
  const context = useContext(PermissionsContext);

  if (context === undefined) {
    throw new Error(
      "usePermissions deve ser usado dentro de PermissionsProvider"
    );
  }

  return context;
}
