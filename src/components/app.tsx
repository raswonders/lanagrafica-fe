import { SignIn } from "./sign-in";
import { ThemeProvider } from "./theme-provider";
import { ModeToggle } from "./mode-toggle";
import bgImage from "/public/test-bg.svg";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div style={{ backgroundImage: `url(${bgImage})`}}>
        <div className="absolute m-4">
          <ModeToggle />
        </div>
        <SignIn />
      </div>
    </ThemeProvider>
  );
}

export default App;
