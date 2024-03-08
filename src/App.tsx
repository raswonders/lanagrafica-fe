import "./App.css";
import { SignIn } from "./components/SignIn";
import { ThemeProvider } from "./components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="absolute m-4">
        <ModeToggle />
      </div>
      <SignIn />
    </ThemeProvider>
  );
}

export default App;
