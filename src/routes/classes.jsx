import React from "react";
import { Navigate } from "react-router-dom";

// Classes pages
import CreateClass from "../pages/Classes/CreateClass";
import ListClasses from "../pages/Classes/ListClasses";

const classesRoutes = [
  { path: "/create-class", component: <CreateClass /> },
  { path: "/classes", component: <ListClasses /> },
]

export default classesRoutes;
