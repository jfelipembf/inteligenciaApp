import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";
import "./i18n";
import { Provider } from "react-redux";
import store from "./store/index.js";
import { AuthProvider } from "./contexts/AuthContext";
import { ClassProvider } from "./contexts/ClassContext";
import { LessonsProvider } from "./contexts/LessonContext.jsx";
import { StudentsProvider } from "./contexts/StudentsContext.jsx";
import { TeachersProvider } from "./contexts/TeachersContext.jsx";
import { ProfessorDashboardProvider } from "./contexts/ProfessorDashboardContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.Fragment>
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </React.Fragment>
);

serviceWorker.unregister();
