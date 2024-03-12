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
import { Home } from "./pages/home";
import { Cards } from "./pages/cards";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route path="login" element={<Login />} />
      <Route path="home" element={<Home />} />
      <Route path="members" element={<Members />} />
      <Route path="cards" element={<Cards />} />
    </Route>,
  ),
);

function App() {
  return (
    <>
      <Background
        style={{
          position: "fixed",
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
