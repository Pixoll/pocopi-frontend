import { BrowserRouter } from "react-router";
import { AppRoutes } from "@/routes/AppRoutes";
import { ThemeProvider } from "./contexts/ThemeProvider";
import { ThemeSwitcher } from "./components/ThemeSwitcher";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="app-container">
          <AppRoutes />
          <ThemeSwitcher />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
