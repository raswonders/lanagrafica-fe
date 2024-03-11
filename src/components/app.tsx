import { SignIn } from "./sign-in";
import { ModeToggle } from "./mode-toggle";
import { Background } from "./background";
import { AuthProvider } from "./auth-provider";

function App() {
  return (
    <AuthProvider>
      <Background
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: "-9999",
        }}
      />
      <div className="absolute m-4">
        <ModeToggle />
      </div>
      <SignIn />
    </AuthProvider>
  );
}

export default App;
