import { SignIn } from "./sign-in";
import { AuthProvider } from "./auth-provider";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { RootLayout } from "./layouts/root-layout";
import { Background } from "./background";
import { Members } from "./pages/members";
import { ProtectedRoute } from "./protectedRoute";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route path="login" element={<SignIn />} />
      <Route
        path="members"
        element={
          <ProtectedRoute>
            <Members />
          </ProtectedRoute>
        }
      />
    </Route>,
  ),
);

function App() {
  return (
    <>
      <Background
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: "-9999",
        }}
      />

      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  );
}

export default App;
