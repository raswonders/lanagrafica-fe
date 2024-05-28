import { Login } from "./ui/login";
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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Members />} />
      <Route path="login" element={<Login />} />
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
