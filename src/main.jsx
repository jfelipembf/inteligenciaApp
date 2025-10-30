import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";
import "./i18n";
import { Provider } from "react-redux";
import store from "./store/index.js";
import { AuthProvider as OldAuthProvider } from "./contexts/AuthContext";
import { AppProvider } from "./hooks";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.Fragment>
    <Provider store={store}>
      <BrowserRouter>
        {/* AuthProvider antigo mantido temporariamente para compatibilidade */}
        <OldAuthProvider>
          {/* Novo AppProvider com nova arquitetura DDD */}
          <AppProvider>
            <App />
          </AppProvider>
        </OldAuthProvider>
      </BrowserRouter>
    </Provider>
  </React.Fragment>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((registration) => {
        console.log("Service Worker registrado para FCM:", registration);
      })
      .catch((err) => {
        console.error("Erro ao registrar o Service Worker do FCM:", err);
      });
  });
}

//serviceWorker.unregister();
