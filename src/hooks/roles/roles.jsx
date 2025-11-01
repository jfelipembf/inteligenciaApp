import React, { createContext, useContext, useState, useCallback } from "react";
import { rolesService } from "../../services/roles/rolesService";
import { useAuth } from "../auth/auth.jsx";

const RolesContext = createContext(undefined);

export function RolesProvider({ children }) {
  const { currentSchoolId, user } = useAuth();
  const [roles, setRoles] = useState([]);
  const [defaultRoles, setDefaultRoles] = useState([]);
  const [customRoles, setCustomRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadRoles = useCallback(async () => {
    if (!currentSchoolId) {
      setRoles([]);
      setDefaultRoles([]);
      setCustomRoles([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await rolesService.getRolesBySchool(currentSchoolId);

      if (result.success) {
        setRoles(result.data || []);
        const defaultRoles = (result.data || []).filter(
          (r) => r.type === "default"
        );
        const customRoles = (result.data || []).filter(
          (r) => r.type === "custom"
        );
        setDefaultRoles(defaultRoles);
        setCustomRoles(customRoles);
      } else {
        setError(result.error);
        setRoles([]);
        setDefaultRoles([]);
        setCustomRoles([]);
      }
    } catch (err) {
      console.error("Erro ao carregar roles:", err);
      setError(err.message || "Erro ao carregar roles");
      setRoles([]);
      setDefaultRoles([]);
      setCustomRoles([]);
    } finally {
      setLoading(false);
    }
  }, [currentSchoolId]);

  const loadDefaultRoles = useCallback(async () => {
    if (!currentSchoolId) {
      setDefaultRoles([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await rolesService.getDefaultRoles(currentSchoolId);

      if (result.success) {
        setDefaultRoles(result.data || []);
      } else {
        setError(result.error);
        setDefaultRoles([]);
      }
    } catch (err) {
      console.error("Erro ao carregar roles padrão:", err);
      setError(err.message || "Erro ao carregar roles padrão");
      setDefaultRoles([]);
    } finally {
      setLoading(false);
    }
  }, [currentSchoolId]);

  const loadCustomRoles = useCallback(async () => {
    if (!currentSchoolId) {
      setCustomRoles([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await rolesService.getCustomRoles(currentSchoolId);

      if (result.success) {
        setCustomRoles(result.data || []);
      } else {
        setError(result.error);
        setCustomRoles([]);
      }
    } catch (err) {
      console.error("Erro ao carregar roles customizados:", err);
      setError(err.message || "Erro ao carregar roles customizados");
      setCustomRoles([]);
    } finally {
      setLoading(false);
    }
  }, [currentSchoolId]);

  const getRoleById = useCallback(async (roleId) => {
    try {
      setLoading(true);
      setError(null);

      const result = await rolesService.getRoleById(roleId);

      if (result.success) {
        return result.data;
      } else {
        setError(result.error);
        return null;
      }
    } catch (err) {
      console.error("Erro ao buscar role:", err);
      setError(err.message || "Erro ao buscar role");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createRole = useCallback(
    async (roleData) => {
      if (!currentSchoolId) {
        setError("Escola não selecionada");
        return { success: false, error: "Escola não selecionada" };
      }

      if (!user?.id) {
        setError("Usuário não autenticado");
        return { success: false, error: "Usuário não autenticado" };
      }

      try {
        setLoading(true);
        setError(null);

        const result = await rolesService.createRole(
          currentSchoolId,
          roleData,
          user.id
        );

        if (result.success) {
          await loadRoles();
          return result;
        } else {
          setError(result.error);
          return result;
        }
      } catch (err) {
        console.error("Erro ao criar role:", err);
        const errorMsg = err.message || "Erro ao criar role";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [currentSchoolId, user?.id, loadRoles]
  );

  const updateRole = useCallback(
    async (roleId, roleData) => {
      try {
        setLoading(true);
        setError(null);

        const result = await rolesService.updateRole(roleId, roleData);

        if (result.success) {
          await loadRoles();
          return result;
        } else {
          setError(result.error);
          return result;
        }
      } catch (err) {
        console.error("Erro ao atualizar role:", err);
        const errorMsg = err.message || "Erro ao atualizar role";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [loadRoles]
  );

  const deleteRole = useCallback(
    async (roleId) => {
      try {
        setLoading(true);
        setError(null);

        const result = await rolesService.deleteRole(roleId);

        if (result.success) {
          await loadRoles();
          return result;
        } else {
          setError(result.error);
          return result;
        }
      } catch (err) {
        console.error("Erro ao deletar role:", err);
        const errorMsg = err.message || "Erro ao deletar role";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [loadRoles]
  );

  const initializeDefaultRoles = useCallback(async () => {
    if (!currentSchoolId) {
      setError("Escola não selecionada");
      return { success: false, error: "Escola não selecionada" };
    }

    if (!user?.id) {
      setError("Usuário não autenticado");
      return { success: false, error: "Usuário não autenticado" };
    }

    try {
      setLoading(true);
      setError(null);

      const result = await rolesService.initializeDefaultRoles(
        currentSchoolId,
        user.id
      );

      if (result.success) {
        await loadRoles();
        return result;
      } else {
        setError(result.error);
        return result;
      }
    } catch (err) {
      console.error("Erro ao inicializar roles padrão:", err);
      const errorMsg = err.message || "Erro ao inicializar roles padrão";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [currentSchoolId, user?.id, loadRoles]);

  const value = {
    roles,
    defaultRoles,
    customRoles,
    loading,
    error,
    currentSchoolId,
    loadRoles,
    loadDefaultRoles,
    loadCustomRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole,
    initializeDefaultRoles,
  };

  return (
    <RolesContext.Provider value={value}>{children}</RolesContext.Provider>
  );
}

export function useRoles() {
  const context = useContext(RolesContext);

  if (context === undefined) {
    throw new Error("useRoles deve ser usado dentro de RolesProvider");
  }

  return context;
}
