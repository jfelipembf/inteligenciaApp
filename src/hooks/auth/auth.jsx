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

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [schools, setSchools] = useState([]);
  const [currentSchoolId, setCurrentSchoolId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPermissions = useCallback(async (userId, schoolId, roleName) => {
    try {
      if (!userId || !schoolId || !roleName) {
        setPermissions([]);
        return;
      }

      const roleResult = await rolesRepository.getRoleByName(
        schoolId,
        roleName
      );

      if (!roleResult.success || !roleResult.data) {
        setPermissions([]);
        return;
      }

      const rolePermissionIds = roleResult.data.permissionIds || [];

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

  const loadUserData = useCallback(
    async (firebaseUser) => {
      try {
        setLoading(true);
        setError(null);

        const userResult = await usersRepository.getUserById(firebaseUser.uid);

        if (!userResult.success) {
          setError("Usuário não encontrado");
          setLoading(false);
          return;
        }

        const userData = userResult.data;

        const userSchools = userData.schools || [];
        setSchools(userSchools);

        const currentSchool =
          userData.currentSchoolId || userSchools[0]?.schoolId;
        setCurrentSchoolId(currentSchool);

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

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(async (authData) => {
      if (!authData || !authData.firebaseUser) {
        setFirebaseUser(null);
        setUser(null);
        setPermissions([]);
        setSchools([]);
        setCurrentSchoolId(null);
        setLoading(false);
        return;
      }

      setFirebaseUser(authData.firebaseUser);
      await loadUserData(authData.firebaseUser);
    });

    return () => {
      unsubscribe();
    };
  }, [loadUserData]);

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

  const switchSchool = useCallback(
    async (schoolId) => {
      try {
        if (!user || !schoolId) {
          return;
        }

        setLoading(true);
        setError(null);

        const updateResult = await usersRepository.updateCurrentSchool(
          user.id,
          schoolId
        );

        if (!updateResult.success) {
          setError(updateResult.error);
          setLoading(false);
          return;
        }

        setCurrentSchoolId(schoolId);

        const schoolData = schools.find((s) => s.schoolId === schoolId);
        if (schoolData) {
          await loadPermissions(user.id, schoolId, schoolData.role);
        } else {
          setPermissions([]);
        }

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

  const hasPermission = useCallback(
    (permissionName) => {
      if (!currentSchoolId) {
        return false;
      }
      return permissions.includes(permissionName);
    },
    [permissions, currentSchoolId]
  );

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

  const getCurrentRole = useCallback(() => {
    if (!currentSchoolId || !schools.length) {
      return null;
    }

    const schoolData = schools.find((s) => s.schoolId === currentSchoolId);
    return schoolData?.role || null;
  }, [currentSchoolId, schools]);

  const value = {
    firebaseUser,
    user,
    permissions,
    schools,
    currentSchoolId,
    loading,
    error,
    signIn,
    signOut,
    switchSchool,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getCurrentRole,
    isAuthenticated: !!firebaseUser && !!user,
    currentSchool: schools.find((s) => s.schoolId === currentSchoolId) || null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }

  return context;
}
