import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import { AppLayout } from "@/app/layout";
import { FormBuilderPage } from "@/features/form-lab/components/FormBuilderPage";
import { HomePage } from "@/features/form-lab/components/HomePage";
import { ErrorFallback } from "@/features/error-pages/components/ErrorFallback";

const MyFormsPage = lazy(() =>
  import("@/features/form-lab/components/MyFormsPage").then((m) => ({
    default: m.MyFormsPage,
  }))
);
const FormPreviewPage = lazy(() =>
  import("@/features/form-lab/components/FormPreviewPage").then((m) => ({
    default: m.FormPreviewPage,
  }))
);
const SharePage = lazy(() =>
  import("@/features/form-lab/components/SharePage").then((m) => ({
    default: m.SharePage,
  }))
);
const TemplateGalleryPage = lazy(() =>
  import("@/features/form-lab/components/TemplateGalleryPage").then((m) => ({
    default: m.TemplateGalleryPage,
  }))
);
const NotFoundPage = lazy(() =>
  import("@/features/error-pages/components/NotFoundPage").then((m) => ({
    default: m.NotFoundPage,
  }))
);

function RouteSuspense({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div
          className="flex min-h-[50vh] items-center justify-center"
          aria-live="polite"
        >
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

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
        element: (
          <RouteSuspense>
            <MyFormsPage />
          </RouteSuspense>
        ),
      },
      {
        path: "/builder",
        element: <FormBuilderRoute />,
      },
      {
        path: "/preview/:id",
        element: (
          <RouteSuspense>
            <FormPreviewPage />
          </RouteSuspense>
        ),
      },
      {
        path: "/share",
        element: (
          <RouteSuspense>
            <SharePage />
          </RouteSuspense>
        ),
      },
      {
        path: "/templates",
        element: (
          <RouteSuspense>
            <TemplateGalleryPage />
          </RouteSuspense>
        ),
      },
      {
        path: "*",
        element: (
          <RouteSuspense>
            <NotFoundPage />
          </RouteSuspense>
        ),
      },
    ],
    errorElement: <ErrorFallback />,
  },
]);

function FormBuilderRoute() {
  const { search } = useLocation();
  return <FormBuilderPage key={search} />;
}

export function Router() {
  return <RouterProvider router={router} />;
}
