import firebase from "firebase/compat/app";
import "firebase/compat/auth";

class AuthClient {
  get auth() {
    if (firebase.apps.length === 0) {
      throw new Error(
        "Firebase não foi inicializado. Chame initializeApp() primeiro."
      );
    }
    return firebase.auth();
  }

  async signInWithEmailPassword(email, password) {
    try {
      const userCredential = await this.auth.signInWithEmailAndPassword(
        email,
        password
      );
      return {
        success: true,
        data: userCredential.user,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: this._handleError(error),
      };
    }
  }

  async signOut() {
    try {
      await this.auth.signOut();
      return {
        success: true,
        data: null,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || "Erro ao fazer logout",
      };
    }
  }

  getCurrentUser() {
    try {
      const user = this.auth.currentUser;
      return {
        success: true,
        data: user,
        error: null,
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
      const unsubscribe = this.auth.onAuthStateChanged((user) => {
        callback(user);
      });
      return unsubscribe;
    } catch (error) {
      console.error("Erro ao observar mudanças de auth:", error);
      return () => {};
    }
  }

  async createUserWithEmailPassword(email, password) {
    try {
      const userCredential = await this.auth.createUserWithEmailAndPassword(
        email,
        password
      );
      return {
        success: true,
        data: userCredential.user,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: this._handleError(error),
      };
    }
  }

  async sendPasswordResetEmail(email) {
    try {
      await this.auth.sendPasswordResetEmail(email);
      return {
        success: true,
        data: null,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: this._handleError(error),
      };
    }
  }

  async updateProfile(profileData) {
    try {
      const user = this.auth.currentUser;
      if (!user) {
        return {
          success: false,
          data: null,
          error: "Nenhum usuário autenticado",
        };
      }

      await user.updateProfile(profileData);
      return {
        success: true,
        data: this.auth.currentUser,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || "Erro ao atualizar perfil",
      };
    }
  }

  _handleError(error) {
    const errorMap = {
      "auth/user-not-found": "Usuário não encontrado",
      "auth/wrong-password": "Senha incorreta",
      "auth/email-already-in-use": "Email já está em uso",
      "auth/weak-password": "Senha muito fraca",
      "auth/invalid-email": "Email inválido",
      "auth/user-disabled": "Usuário desabilitado",
      "auth/too-many-requests": "Muitas tentativas. Tente mais tarde",
      "auth/network-request-failed": "Erro de conexão",
    };

    return errorMap[error.code] || error.message || "Erro de autenticação";
  }
}

export const authClient = new AuthClient();
