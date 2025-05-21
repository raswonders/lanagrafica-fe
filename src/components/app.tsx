import { Login } from "./pages/login";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { RootLayout } from "./layouts/root-layout";
import { Background } from "./ui/background";
import { Members } from "./pages/members";
import { Toaster } from "./ui/sonner";
import { Cards } from "./pages/cards";
import { ProtectedRoute } from "./providers/protected-route";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route
        path="login"
        element={
          <ProtectedRoute publicOnly>
            <Login />
          </ProtectedRoute>
        }
      />
      <Route
        index
        element={
          <ProtectedRoute>
            <Members />
          </ProtectedRoute>
        }
      />
      <Route
        path="cards"
        element={
          <ProtectedRoute adminOnly>
            <Cards />
          </ProtectedRoute>
        }
      />
    </Route>,
  ),
);

function App() {
  return (
    <>
      <Background />
      <RouterProvider router={router} />
      <Toaster position="bottom-center" />
    </>
  );
}

export default App;
