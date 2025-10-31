import { authRepository } from "../../repositories/auth/authRepository";
import { usersRepository } from "../../repositories/users/usersRepository";
import { permissionsCacheService } from "../cache/permissionsCacheService";
import { rolesRepository } from "../../repositories/roles/rolesRepository";

class AuthService {
  async signIn(email, password) {
    try {
      const authResult = await authRepository.signInWithEmailPassword(
        email,
        password
      );

      if (!authResult.success) {
        return authResult;
      }

      const firebaseUser = authResult.data;

      const userResult = await usersRepository.getUserById(firebaseUser.uid);

      if (!userResult.success) {
        const newUserResult = await usersRepository.createUser({
          email: firebaseUser.email,
          personalInfo: {
            name: firebaseUser.displayName || firebaseUser.email,
          },
          schools: [],
          currentSchoolId: null,
        });

        if (!newUserResult.success) {
          return {
            success: false,
            error: "Erro ao criar perfil do usuário",
          };
        }

        return {
          success: true,
          data: {
            firebaseUser,
            user: newUserResult.data,
            permissions: [],
            schools: [],
          },
        };
      }

      const user = userResult.data;

      const schools = user.schools || [];
      const currentSchoolId = user.currentSchoolId || schools[0]?.schoolId;

      let permissions = [];
      if (currentSchoolId) {
        const schoolData = schools.find((s) => s.schoolId === currentSchoolId);
        if (schoolData) {
          const roleResult = await rolesRepository.getRoleByName(
            currentSchoolId,
            schoolData.role
          );

          if (roleResult.success && roleResult.data) {
            const rolePermissionIds = roleResult.data.permissionIds || [];
            const permissionsResult =
              await permissionsCacheService.getPermissions(
                user.id,
                currentSchoolId,
                rolePermissionIds
              );

            if (permissionsResult.success) {
              permissions = permissionsResult.data || [];
            }
          }
        }
      }

      return {
        success: true,
        data: {
          firebaseUser,
          user,
          permissions,
          schools,
          currentSchoolId,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao fazer login",
      };
    }
  }

  async signOut() {
    try {
      return await authRepository.signOut();
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao fazer logout",
      };
    }
  }

  async getCurrentUser() {
    try {
      const authResult = authRepository.getCurrentUser();

      if (!authResult.success || !authResult.data) {
        return {
          success: false,
          data: null,
          error: "Nenhum usuário autenticado",
        };
      }

      const firebaseUser = authResult.data;

      const userResult = await usersRepository.getUserById(firebaseUser.uid);

      if (!userResult.success) {
        return {
          success: false,
          data: null,
          error: "Usuário não encontrado no Firestore",
        };
      }

      return {
        success: true,
        data: {
          firebaseUser,
          user: userResult.data,
        },
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || "Erro ao obter usuário atual",
      };
    }
  }

  onAuthStateChange(callback) {
    try {
      return authRepository.onAuthStateChange(async (firebaseUser) => {
        if (!firebaseUser) {
          callback(null);
          return;
        }

        const userResult = await usersRepository.getUserById(firebaseUser.uid);

        if (userResult.success) {
          callback({
            firebaseUser,
            user: userResult.data,
          });
        } else {
          callback({
            firebaseUser,
            user: null,
          });
        }
      });
    } catch (error) {
      console.error("Erro ao observar mudanças de auth:", error);
      return () => {};
    }
  }

  async createAccount(email, password, userData) {
    try {
      const authResult = await authRepository.createUserWithEmailPassword(
        email,
        password
      );

      if (!authResult.success) {
        return authResult;
      }

      const firebaseUser = authResult.data;

      const userResult = await usersRepository.createUser({
        email,
        ...userData,
      });

      if (!userResult.success) {
        await authRepository.signOut();
        return userResult;
      }

      return {
        success: true,
        data: {
          firebaseUser,
          user: userResult.data,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao criar conta",
      };
    }
  }

  async sendPasswordResetEmail(email) {
    try {
      return await authRepository.sendPasswordResetEmail(email);
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erro ao enviar email",
      };
    }
  }
}

export const authService = new AuthService();
