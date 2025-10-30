/**
 * Service de Auth
 * Lógica de negócio para autenticação
 */

import { authRepository } from "../../repositories/auth/authRepository";
import { usersRepository } from "../../repositories/users/usersRepository";
import { permissionsCacheService } from "../cache/permissionsCacheService";
import { rolesRepository } from "../../repositories/roles/rolesRepository";

class AuthService {
  /**
   * Fazer login completo (auth + buscar dados do usuário)
   */
  async signIn(email, password) {
    try {
      // 1. Fazer login no Firebase Auth
      const authResult = await authRepository.signInWithEmailPassword(
        email,
        password
      );

      if (!authResult.success) {
        return authResult;
      }

      const firebaseUser = authResult.data;

      // 2. Buscar dados do usuário no Firestore
      const userResult = await usersRepository.getUserById(firebaseUser.uid);

      if (!userResult.success) {
        // Usuário não existe no Firestore, criar com dados básicos
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

      // 3. Buscar escolas do usuário
      const schools = user.schools || [];
      const currentSchoolId = user.currentSchoolId || schools[0]?.schoolId;

      // 4. Se tem escola atual, buscar permissões
      let permissions = [];
      if (currentSchoolId) {
        const schoolData = schools.find((s) => s.schoolId === currentSchoolId);
        if (schoolData) {
          // Buscar role para obter permissionIds
          const roleResult = await rolesRepository.getRoleByName(
            currentSchoolId,
            schoolData.role
          );

          if (roleResult.success && roleResult.data) {
            const rolePermissionIds = roleResult.data.permissionIds || [];
            // Buscar permissões do cache ou resolver
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

  /**
   * Fazer logout
   */
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

  /**
   * Obter usuário atual
   */
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

      // Buscar dados do usuário no Firestore
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

  /**
   * Observar mudanças no estado de autenticação
   */
  onAuthStateChange(callback) {
    try {
      return authRepository.onAuthStateChange(async (firebaseUser) => {
        if (!firebaseUser) {
          callback(null);
          return;
        }

        // Buscar dados do usuário no Firestore
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

  /**
   * Criar conta (registro)
   */
  async createAccount(email, password, userData) {
    try {
      // 1. Criar usuário no Firebase Auth
      const authResult = await authRepository.createUserWithEmailPassword(
        email,
        password
      );

      if (!authResult.success) {
        return authResult;
      }

      const firebaseUser = authResult.data;

      // 2. Criar perfil no Firestore
      const userResult = await usersRepository.createUser({
        email,
        ...userData,
      });

      if (!userResult.success) {
        // Se falhar, remover usuário do Auth
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

  /**
   * Enviar email de redefinição de senha
   */
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
