/**
 * Auth Hook + Context + Provider
 * Padrão: Context API + Custom Hook (igual ao mobile)
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { authService } from "../../services/auth/authService";
import { permissionsCacheService } from "../../services/cache/permissionsCacheService";
import { rolesRepository } from "../../repositories/roles/rolesRepository";
import { usersRepository } from "../../repositories/users/usersRepository";

// 1. Criar o Context
const AuthContext = createContext(undefined);

// 2. Provider (gerencia estado e chama services)
export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [schools, setSchools] = useState([]);
  const [currentSchoolId, setCurrentSchoolId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Carregar permissões do usuário
   */
  const loadPermissions = useCallback(async (userId, schoolId, roleName) => {
    try {
      if (!userId || !schoolId || !roleName) {
        setPermissions([]);
        return;
      }

      // Buscar role para obter permissionIds
      const roleResult = await rolesRepository.getRoleByName(
        schoolId,
        roleName
      );

      if (!roleResult.success || !roleResult.data) {
        setPermissions([]);
        return;
      }

      const rolePermissionIds = roleResult.data.permissionIds || [];

      // Buscar permissões do cache ou resolver
      const permissionsResult = await permissionsCacheService.getPermissions(
        userId,
        schoolId,
        rolePermissionIds
      );

      if (permissionsResult.success) {
        setPermissions(permissionsResult.data || []);
      } else {
        setPermissions([]);
      }
    } catch (err) {
      console.error("Erro ao carregar permissões:", err);
      setPermissions([]);
    }
  }, []);

  /**
   * Carregar dados completos do usuário
   */
  const loadUserData = useCallback(
    async (firebaseUser) => {
      try {
        setLoading(true);
        setError(null);

        // Buscar dados do usuário no Firestore
        const userResult = await usersRepository.getUserById(firebaseUser.uid);

        if (!userResult.success) {
          setError("Usuário não encontrado");
          setLoading(false);
          return;
        }

        const userData = userResult.data;

        // Carregar escolas
        const userSchools = userData.schools || [];
        setSchools(userSchools);

        // Definir escola atual
        const currentSchool =
          userData.currentSchoolId || userSchools[0]?.schoolId;
        setCurrentSchoolId(currentSchool);

        // Carregar permissões se tiver escola atual
        if (currentSchool) {
          const schoolData = userSchools.find(
            (s) => s.schoolId === currentSchool
          );
          if (schoolData) {
            await loadPermissions(userData.id, currentSchool, schoolData.role);
          }
        } else {
          setPermissions([]);
        }

        setUser(userData);
      } catch (err) {
        console.error("Erro ao carregar dados do usuário:", err);
        setError(err.message || "Erro ao carregar dados do usuário");
      } finally {
        setLoading(false);
      }
    },
    [loadPermissions]
  );

  /**
   * Observar mudanças no estado de autenticação
   */
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(async (authData) => {
      if (!authData || !authData.firebaseUser) {
        // Logout
        setFirebaseUser(null);
        setUser(null);
        setPermissions([]);
        setSchools([]);
        setCurrentSchoolId(null);
        setLoading(false);
        return;
      }

      // Login
      setFirebaseUser(authData.firebaseUser);
      await loadUserData(authData.firebaseUser);
    });

    return () => {
      unsubscribe();
    };
  }, [loadUserData]);

  /**
   * Fazer login
   */
  const signIn = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const result = await authService.signIn(email, password);

      if (!result.success) {
        setError(result.error);
        setLoading(false);
        return;
      }

      const {
        firebaseUser: fbUser,
        user: userData,
        permissions: userPermissions,
        schools: userSchools,
        currentSchoolId: currentSchool,
      } = result.data;

      setFirebaseUser(fbUser);
      setUser(userData);
      setPermissions(userPermissions || []);
      setSchools(userSchools || []);
      setCurrentSchoolId(currentSchool);

      setLoading(false);
    } catch (err) {
      console.error("Erro ao fazer login:", err);
      setError(err.message || "Erro ao fazer login");
      setLoading(false);
    }
  }, []);

  /**
   * Fazer logout
   */
  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      await authService.signOut();

      setFirebaseUser(null);
      setUser(null);
      setPermissions([]);
      setSchools([]);
      setCurrentSchoolId(null);

      setLoading(false);
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
      setError(err.message || "Erro ao fazer logout");
      setLoading(false);
    }
  }, []);

  /**
   * Trocar escola atual
   */
  const switchSchool = useCallback(
    async (schoolId) => {
      try {
        if (!user || !schoolId) {
          return;
        }

        setLoading(true);
        setError(null);

        // Atualizar escola atual no Firestore
        const updateResult = await usersRepository.updateCurrentSchool(
          user.id,
          schoolId
        );

        if (!updateResult.success) {
          setError(updateResult.error);
          setLoading(false);
          return;
        }

        // Atualizar estado local
        setCurrentSchoolId(schoolId);

        // Carregar permissões da nova escola
        const schoolData = schools.find((s) => s.schoolId === schoolId);
        if (schoolData) {
          await loadPermissions(user.id, schoolId, schoolData.role);
        } else {
          setPermissions([]);
        }

        // Atualizar user no estado
        setUser({
          ...user,
          currentSchoolId: schoolId,
        });

        setLoading(false);
      } catch (err) {
        console.error("Erro ao trocar escola:", err);
        setError(err.message || "Erro ao trocar escola");
        setLoading(false);
      }
    },
    [user, schools, loadPermissions]
  );

  /**
   * Verificar se usuário tem uma permissão específica
   */
  const hasPermission = useCallback(
    (permissionName) => {
      if (!currentSchoolId) {
        return false;
      }
      return permissions.includes(permissionName);
    },
    [permissions, currentSchoolId]
  );

  /**
   * Verificar se usuário tem pelo menos uma das permissões
   */
  const hasAnyPermission = useCallback(
    (permissionNames) => {
      if (!Array.isArray(permissionNames)) {
        return false;
      }
      return permissionNames.some((permission) =>
        permissions.includes(permission)
      );
    },
    [permissions]
  );

  /**
   * Verificar se usuário tem todas as permissões
   */
  const hasAllPermissions = useCallback(
    (permissionNames) => {
      if (!Array.isArray(permissionNames)) {
        return false;
      }
      return permissionNames.every((permission) =>
        permissions.includes(permission)
      );
    },
    [permissions]
  );

  /**
   * Obter role do usuário na escola atual
   */
  const getCurrentRole = useCallback(() => {
    if (!currentSchoolId || !schools.length) {
      return null;
    }

    const schoolData = schools.find((s) => s.schoolId === currentSchoolId);
    return schoolData?.role || null;
  }, [currentSchoolId, schools]);

  // Valor do Context
  const value = {
    // Estado
    firebaseUser,
    user,
    permissions,
    schools,
    currentSchoolId,
    loading,
    error,

    // Métodos
    signIn,
    signOut,
    switchSchool,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getCurrentRole,

    // Helpers
    isAuthenticated: !!firebaseUser && !!user,
    currentSchool: schools.find((s) => s.schoolId === currentSchoolId) || null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 3. Hook customizado para consumir o Context
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }

  return context;
}
