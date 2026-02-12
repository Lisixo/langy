import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./modules/localization";
import { createBrowserRouter, RouterProvider } from "react-router";
import Root, { RootErrorBoundary } from "./root";
import HomePage from "./pages/home";
import SettingsPage from "./pages/settings";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    ErrorBoundary: RootErrorBoundary,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: "editor",
        element: "Not implemented",
      },
      {
        path: "files",
        element: "Not implemented",
      },
      {
        path: "settings",
        Component: SettingsPage,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
