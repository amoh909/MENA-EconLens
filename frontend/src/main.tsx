import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { createBrowserRouter, Route, RouterProvider } from "react-router-dom";
import "./index.css";

import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import Indicators from "./Pages/Indicators";
import CountryDetail from "./Pages/CountryDetail";
import Compare from "./Pages/Compare";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/indicators", element: <Indicators /> },
  { path: "/countrydetail", element: <CountryDetail /> },
  { path: "/compare", element: <Compare /> },
  { path: "*", element: <div className="p-8 text-center text-xl font-bold">404 - Page Not Found</div> },
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
