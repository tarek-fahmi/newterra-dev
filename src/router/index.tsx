import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage.tsx";
import DashboardPage from "../pages/DashboardPage.tsx";
import OnboardingPage from "../pages/OnboardingPage.tsx";
import DevUtilsPage from "../pages/DevUtilsPage.tsx";
import NotFoundPage from "../pages/404Page.tsx";
import AuthDashboardRoute from "../router/AuthDashboardRoute.tsx";
import Providers from "../Providers.tsx";
import { AuthPage } from "@/pages/AuthPage.tsx";

const router = createBrowserRouter([
  // I recommend you reflect the routes here in the pages folder
  {
    path: "/",
    element: <Providers />,
    children: [
      // Public routes
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/auth",
        element: <AuthPage />,
      },
      // Development utilities (only in development)
      ...(import.meta.env.DEV ? [{
        path: "/dev-utils",
        element: <DevUtilsPage />,
      }] : []),
      // Auth dashboard routes
      {
        path: "/",
        element: <AuthDashboardRoute />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },
          {
            path: "/onboarding",
            element: <OnboardingPage />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
