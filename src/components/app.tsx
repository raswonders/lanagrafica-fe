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
import { NewMember } from "./pages/new-member";
import { Toaster } from "./ui/sonner";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Members />} />
      <Route path="login" element={<Login />} />
      <Route path="new-member" element={<NewMember />} />
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
      <Toaster position="bottom-center" />
    </>
  );
}

export default App;
