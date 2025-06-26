import firebase from "firebase/compat/app";

// Add the Firebase products that you want to use
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/messaging";

async function saveFcmToken(userId) {
  try {
    const messaging = firebase.messaging();

    const token = await messaging.getToken({
      vapidKey: import.meta.env.VITE_APP_FCM_VAPID_KEY,
    });

    if (token) {
      await firebase.firestore().collection("users").doc(userId).update({
        fcmToken: token,
        fcmTokenUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
  } catch (err) {
    console.error("Erro ao obter/salvar token FCM:", err);
  }
}

class FirebaseAuthBackend {
  constructor(firebaseConfig) {
    if (firebaseConfig) {
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          localStorage.setItem("authUser", JSON.stringify(user));
        } else {
          localStorage.removeItem("authUser");
        }
      });
    }
  }

  /**
   * Registers the user with given details
   */
  registerUser = (email, password) => {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(
          (user) => {
            resolve(firebase.auth().currentUser);
          },
          (error) => {
            reject(this._handleError(error));
          }
        );
    });
  };

  /**
   * Edits the user profile
   */
  editProfileAPI = (data) => {
    return new Promise((resolve, reject) => {
      const user = firebase.auth().currentUser;

      if (user) {
        try {
          const updateData = typeof data === "string" ? JSON.parse(data) : data;

          if (!updateData || typeof updateData !== "object") {
            reject("Dados inválidos para atualização: não é um objeto");
            return;
          }

          if (!updateData.username) {
            reject("Dados inválidos para atualização: username não fornecido");
            return;
          }

          firebase
            .firestore()
            .collection("users")
            .doc(user.uid)
            .get()
            .then((doc) => {
              if (doc.exists) {
                const currentData = doc.data();

                return user
                  .updateProfile({
                    displayName: updateData.username,
                  })
                  .then(() => {
                    return firebase
                      .firestore()
                      .collection("users")
                      .doc(user.uid)
                      .update({
                        "personalInfo.name": updateData.username,
                        "personalInfo.displayName": updateData.username,
                        "metadata.updatedAt":
                          firebase.firestore.FieldValue.serverTimestamp(),
                      });
                  });
              } else {
                throw new Error("Documento do usuário não encontrado");
              }
            })
            .then(() => {
              const updatedUser = firebase.auth().currentUser;
              localStorage.setItem("authUser", JSON.stringify(updatedUser));
              resolve(updatedUser);
            })
            .catch((error) => {
              reject(this._handleError(error));
            });
        } catch (error) {
          reject("Erro ao processar dados de atualização");
        }
      } else {
        reject("Nenhum usuário autenticado");
      }
    });
  };

  /**
   * Busca os dados do usuário no Firestore
   */
  getUserData = async (uid) => {
    try {
      const doc = await firebase.firestore().collection("users").doc(uid).get();

      if (doc.exists) {
        const userData = doc.data();
        localStorage.setItem("firestoreUser", JSON.stringify(userData));
        return userData;
      }
      return null;
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
      return null;
    }
  };

  /**
   * Login user with given details
   */
  loginUser = (email, password) => {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(async (userCredential) => {
          const user = userCredential.user;
          // Busca os dados do Firestore

          await saveFcmToken(user.uid);

          const userData = await this.getUserData(user.uid);
          resolve(user);
        })
        .catch((error) => {
          reject(this._handleError(error));
        });
    });
  };

  /**
   * forget Password user with given details
   */
  forgetPassword = (email) => {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .sendPasswordResetEmail(email, {
          url:
            window.location.protocol + "//" + window.location.host + "/login",
        })
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          reject(this._handleError(error));
        });
    });
  };

  /**
   * Logout the user
   */
  logout = () => {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signOut()
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          reject(this._handleError(error));
        });
    });
  };

  /**
   * Social Login user with given details
   */

  socialLoginUser = async (type) => {
    let provider;
    if (type === "google") {
      provider = new firebase.auth.GoogleAuthProvider();
    } else if (type === "facebook") {
      provider = new firebase.auth.FacebookAuthProvider();
    }
    try {
      const result = await firebase.auth().signInWithPopup(provider);
      const user = result.user;
      return user;
    } catch (error) {
      throw this._handleError(error);
    }
  };

  addNewUserToFirestore = (user) => {
    const collection = firebase.firestore().collection("users");
    const { profile } = user.additionalUserInfo;
    const details = {
      firstName: profile.given_name ? profile.given_name : profile.first_name,
      lastName: profile.family_name ? profile.family_name : profile.last_name,
      fullName: profile.name,
      email: profile.email,
      picture: profile.picture,
      createdDtm: firebase.firestore.FieldValue.serverTimestamp(),
      lastLoginTime: firebase.firestore.FieldValue.serverTimestamp(),
    };
    collection.doc(firebase.auth().currentUser.uid).set(details);
    return { user, details };
  };

  setLoggeedInUser = (user) => {
    localStorage.setItem("authUser", JSON.stringify(user));
  };

  /**
   * Returns the authenticated user
   */
  getAuthenticatedUser = () => {
    if (!localStorage.getItem("authUser")) return null;
    return JSON.parse(localStorage.getItem("authUser"));
  };

  /**
   * Handle the error
   * @param {*} error
   */
  _handleError(error) {
    // var errorCode = error.code;
    var errorMessage = error.message;
    return errorMessage;
  }

  updateUserData = async (uid, data) => {
    try {
      await firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .update({
          ...data,
          "metadata.updatedAt": firebase.firestore.FieldValue.serverTimestamp(),
        });

      return true;
    } catch (error) {
      console.error("Erro ao atualizar dados do usuário:", error);
      throw error;
    }
  };

  getSchools = async () => {
    try {
      const snapshot = await firebase.firestore().collection("schools").get();

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Erro ao buscar escolas:", error);
      throw error;
    }
  };
}

let _fireBaseBackend = null;

/**
 * Initilize the backend
 * @param {*} config
 */
const initFirebaseBackend = (config) => {
  if (!_fireBaseBackend) {
    _fireBaseBackend = new FirebaseAuthBackend(config);
  }
  return _fireBaseBackend;
};

/**
 * Returns the firebase backend
 */
const getFirebaseBackend = () => {
  return _fireBaseBackend;
};

export { initFirebaseBackend, getFirebaseBackend };
