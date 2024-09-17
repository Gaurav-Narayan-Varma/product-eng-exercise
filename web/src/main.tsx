import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

export const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  // TODO: Turn strictmode back on
  // <React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
  // </React.StrictMode>
);
