importScripts(
  "https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyCDlgPjZGpQmbkrr3OKEhW95gkbs2Xsrko",
  authDomain: "inteligenciaapp-520e3.firebaseapp.com",
  projectId: "inteligenciaapp-520e3",
  messagingSenderId: "538089643335",
  appId: "1:538089643335:web:432d1f0a060c1889d68062",
});

const messaging = firebase.messaging();
