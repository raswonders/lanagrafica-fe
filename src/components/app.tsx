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
import { Auth0Provider } from "@auth0/auth0-react";

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
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      }}
    >
      <Background />
      <RouterProvider router={router} />
      <Toaster position="bottom-center" />
    </Auth0Provider>
  );
}

export default App;
