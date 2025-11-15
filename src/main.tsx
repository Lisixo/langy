import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router'
import Root, { RootErrorBoundary } from './root';
import HomePage from './pages/home';

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    ErrorBoundary: RootErrorBoundary,
    children: [
      {
        index: true,
        Component: HomePage
      },
      {
        path: "editor",
        element: "Not implemented"
      },
      {
        path: "files",
        element: "Not implemented"
      },
      {
        path: "settings",
        element: "Not implemented"
      }
    ]
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
