import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import { AuthModalProvider } from "@/hooks/use-auth-modal";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
    <AuthModalProvider>
      <App />
    </AuthModalProvider>
  </ThemeProvider>
);
