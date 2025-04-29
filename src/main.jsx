import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";
import "./i18n";
import { Provider } from "react-redux";
import store from "./store/index.js";
import { AuthProvider } from "./contexts/AuthContext"; // Certifique-se de importar o AuthProvider
import { ClassProvider } from "./contexts/ClassContext"; // Importar o ClassProvider

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.Fragment>
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          {" "}
          {/* AuthProvider deve envolver o ClassProvider */}
          <ClassProvider>
            <App />
          </ClassProvider>
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </React.Fragment>
);

serviceWorker.unregister();
