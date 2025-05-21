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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Members />} />
      <Route path="login" element={<Login />} />
      <Route path="cards" element={<Cards />} />
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
