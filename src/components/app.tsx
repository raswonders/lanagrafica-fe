import { SignIn } from "./sign-in";
import { ModeToggle } from "./mode-toggle";
import { Background } from "./background";

function App() {
  return (
    <div>
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
    </div>
  );
}

export default App;
