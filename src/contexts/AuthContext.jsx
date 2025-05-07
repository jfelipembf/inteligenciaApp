import React, { createContext, useContext, useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// Criando o contexto
const AuthContext = createContext();

// Hook personalizado para usar o contexto de autenticação
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext deve ser usado dentro de um AuthProvider");
  }
  return context;
};

// Provedor do contexto de autenticação
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para fazer login
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const result = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      setCurrentUser(result.user);
      await fetchUserDetails(result.user.uid);
      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Função para fazer logout
  const logout = async () => {
    try {
      setError(null);
      setLoading(true);
      await firebase.auth().signOut();
      setCurrentUser(null);
      setUserDetails(null);
      localStorage.removeItem("authUser");
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Função para criar um novo usuário
  const signup = async (email, password, userData = {}) => {
    try {
      setError(null);
      setLoading(true);
      const result = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      // Se tiver dados adicionais do usuário, salvar no Firestore
      if (Object.keys(userData).length > 0) {
        await firebase
          .firestore()
          .collection("users")
          .doc(result.user.uid)
          .set({
            ...userData,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          });
      }

      setCurrentUser(result.user);
      await fetchUserDetails(result.user.uid);
      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Função para recuperar senha
  const resetPassword = async (email) => {
    try {
      setError(null);
      setLoading(true);
      return await firebase.auth().sendPasswordResetEmail(email);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar detalhes do usuário
  const fetchUserDetails = async (uid) => {
    if (!uid && !currentUser) {
      return null;
    }

    const userId = uid || currentUser.uid;

    try {
      const userDoc = await firebase
        .firestore()
        .collection("users")
        .doc(userId)
        .get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        setUserDetails(userData);
        return userData;
      }

      return null;
    } catch (err) {
      console.error("Erro ao buscar detalhes do usuário:", err);
      return null;
    }
  };

  // Função para atualizar detalhes do usuário
  const updateUserDetails = async (data) => {
    if (!currentUser) {
      throw new Error("Usuário não autenticado");
    }

    try {
      setLoading(true);
      await firebase
        .firestore()
        .collection("users")
        .doc(currentUser.uid)
        .update({
          ...data,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        });

      // Atualizar o estado local
      setUserDetails((prev) => ({
        ...prev,
        ...data,
      }));

      setLoading(false);
      return true;
    } catch (err) {
      console.error("Erro ao atualizar detalhes do usuário:", err);
      setLoading(false);
      throw err;
    }
  };

  // Função para buscar detalhes da escola do usuário
  const fetchSchoolDetails = async (schoolId) => {
    if (!schoolId && (!userDetails || !userDetails.schoolId)) {
      return null;
    }

    const targetSchoolId = schoolId || userDetails.schoolId;

    try {
      const schoolDoc = await firebase
        .firestore()
        .collection("schools")
        .doc(targetSchoolId)
        .get();

      if (schoolDoc.exists) {
        return schoolDoc.data();
      }

      return null;
    } catch (err) {
      console.error("Erro ao buscar detalhes da escola:", err);
      return null;
    }
  };

  // Efeito para monitorar o estado de autenticação
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      setCurrentUser(user);

      if (user) {
        // Armazenar o usuário no localStorage
        localStorage.setItem("authUser", JSON.stringify(user));

        // Buscar detalhes do usuário
        await fetchUserDetails(user.uid);
      } else {
        // Remover o usuário do localStorage
        localStorage.removeItem("authUser");
        setUserDetails(null);
      }

      setLoading(false);
    });

    // Verificar se já existe um usuário no localStorage
    const storedUser = localStorage.getItem("authUser");
    if (storedUser && !currentUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        fetchUserDetails(user.uid);
      } catch (err) {
        localStorage.removeItem("authUser");
      }
    }

    return () => unsubscribe();
  }, []);

  // Valor do contexto
  const value = {
    currentUser,
    userDetails,
    loading,
    error,
    isAuthenticated: !!currentUser,
    login,
    logout,
    signup,
    resetPassword,
    fetchUserDetails,
    updateUserDetails,
    fetchSchoolDetails,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
