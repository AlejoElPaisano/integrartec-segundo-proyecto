import { createBrowserRouter, RouterProvider, useLocation } from "react-router-dom";
import { AppLayout } from "@/app/layout";
import { FormBuilderPage } from "@/features/form-lab/components/FormBuilderPage";
import { FormPreviewPage } from "@/features/form-lab/components/FormPreviewPage";
import { HomePage } from "@/features/form-lab/components/HomePage";
import { MyFormsPage } from "@/features/form-lab/components/MyFormsPage";
import { TemplateGalleryPage } from "@/features/form-lab/components/TemplateGalleryPage";
import { NotFoundPage } from "@/features/error-pages/components/NotFoundPage";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/forms",
        element: <MyFormsPage />,
      },
      {
        path: "/builder",
        element: <FormBuilderRoute />,
      },
      {
        path: "/preview/:id",
        element: <FormPreviewPage />,
      },
      {
        path: "/templates",
        element: <TemplateGalleryPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
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
