import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import App from "@/router/App";
import Providers from "@/providers";
import "katex/dist/katex.min.css";
import "@/styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Providers>
          <Suspense fallback={<div className="grid min-h-screen place-items-center text-accent-400">Loading…</div>}>
            <App />
          </Suspense>
        </Providers>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
);
