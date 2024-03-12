import { Login } from "./login";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { RootLayout } from "./layouts/root-layout";
import { Background } from "./background";
import { Members } from "./pages/members";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route path="login" element={<Login />} />
      <Route path="members" element={<Members />} />
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
      <RouterProvider router={router} />
    </>
  );
}

export default App;
