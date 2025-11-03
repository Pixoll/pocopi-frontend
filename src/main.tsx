import { App } from "@/App";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import {AuthProvider} from "@/contexts/AuthContext.tsx";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";


createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
      <App/>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);
