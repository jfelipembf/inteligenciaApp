import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

let app;
let db;
let auth;

try {
  if (firebase.apps.length === 0) {
    db = null;
    auth = null;
  } else {
    db = firebase.firestore();
    auth = firebase.auth();
  }
} catch (error) {
  console.error("Erro ao configurar Firebase:", error);
  db = null;
  auth = null;
}

export const getFirestoreInstance = () => {
  if (!db && firebase.apps.length > 0) {
    db = firebase.firestore();
  }
  return db;
};

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
