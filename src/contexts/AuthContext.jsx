import React, { createContext, useContext, useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const AuthContext = createContext();

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext deve ser usado dentro de um AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const signup = async (email, password, userData = {}) => {
    try {
      setError(null);
      setLoading(true);
      const result = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

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

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      setCurrentUser(user);

      if (user) {
        localStorage.setItem("authUser", JSON.stringify(user));

        await fetchUserDetails(user.uid);
      } else {
        localStorage.removeItem("authUser");
        setUserDetails(null);
      }

      setLoading(false);
    });

    const storedUser = localStorage.getItem("authUser");
    if (storedUser && !currentUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        fetchUserDetails(user.uid);
      } catch (err) {
        localStorage.removeItem("authUser");
      }
    } else {
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

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
