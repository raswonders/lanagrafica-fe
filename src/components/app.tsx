import { SignIn } from "./sign-in";
import { ModeToggle } from "./mode-toggle";
import bgImage from "/public/test-bg.svg";
import { useTheme } from "./theme-provider";

function App() {
  const { theme } = useTheme();

  return (
    <div
      style={theme === "light" ? {} : { backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute m-4">
        <ModeToggle />
      </div>
      <SignIn />
    </div>
  );
}

export default App;
