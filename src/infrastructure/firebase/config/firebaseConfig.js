/**
 * Configuração do Firebase
 * Centraliza a inicialização do Firebase para uso nos clients
 */

import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

// Configuração do Firebase (pega das variáveis de ambiente)
// Se já está inicializado via firebase_helper, reutiliza
let app;
let db;
let auth;

try {
  // Verificar se Firebase já foi inicializado (compat mode)
  if (firebase.apps.length === 0) {
    // Se não está inicializado, precisa inicializar (será feito pelo firebase_helper)
    // Por enquanto, exportamos null e os clients vão usar firebase/compat
    db = null;
    auth = null;
  } else {
    // Já está inicializado, usar compat mode
    db = firebase.firestore();
    auth = firebase.auth();
  }
} catch (error) {
  console.error("Erro ao configurar Firebase:", error);
  db = null;
  auth = null;
}

/**
 * Get Firestore instance (compat mode para compatibilidade)
 */
export const getFirestoreInstance = () => {
  if (!db && firebase.apps.length > 0) {
    db = firebase.firestore();
  }
  return db;
};

/**
 * Get Auth instance (compat mode para compatibilidade)
 */
export const getAuthInstance = () => {
  if (!auth && firebase.apps.length > 0) {
    auth = firebase.auth();
  }
  return auth;
};

export default {
  getFirestoreInstance,
  getAuthInstance,
};
