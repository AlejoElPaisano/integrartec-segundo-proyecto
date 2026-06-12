import { createBrowserRouter, RouterProvider, useLocation } from "react-router-dom";
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
        element: <FormBuilderRoute />,
      },
      {
        path: "/preview/:id",
        element: <FormPreviewPage />,
      },
    ],
  },
]);

function FormBuilderRoute() {
  const { search } = useLocation();
  return <FormBuilderPage key={search} />;
}

export function Router() {
  return <RouterProvider router={router} />;
}
