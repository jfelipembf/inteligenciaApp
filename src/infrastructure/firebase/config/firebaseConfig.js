import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

export const getFirestoreInstance = () => {
  if (firebase.apps.length === 0) {
    return null;
  }
  return firebase.firestore();
};

export const getAuthInstance = () => {
  if (firebase.apps.length === 0) {
    return null;
  }
  return firebase.auth();
};

export default {
  getFirestoreInstance,
  getAuthInstance,
};
