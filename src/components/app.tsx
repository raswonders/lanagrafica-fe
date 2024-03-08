import { SignIn } from "./sign-in";
import { ThemeProvider } from "./theme-provider";
import { ModeToggle } from "./mode-toggle";

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
