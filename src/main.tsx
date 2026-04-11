import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/index.css";
import "@/modules/localization";
import { createBrowserRouter, RouterProvider } from "react-router";
import Root, { RootErrorBoundary } from "@/root";
import SettingsPage from "@/pages/settings";
import HomePrePage from "@/pages/home";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    ErrorBoundary: RootErrorBoundary,
    children: [
      {
        index: true,
        Component: HomePrePage,
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
  // <StrictMode>
    <RouterProvider router={router} />
  // </StrictMode>,
);
