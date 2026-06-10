import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppLayout } from "@/app/layout";
import { FormBuilderPage } from "@/features/form-lab/components/FormBuilderPage";
import { FormPreviewPage } from "@/features/form-lab/components/FormPreviewPage";
import { HomePage } from "@/features/form-lab/components/HomePage";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/builder",
        element: <FormBuilderPage />,
      },
      {
        path: "/preview/:id",
        element: <FormPreviewPage />,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
