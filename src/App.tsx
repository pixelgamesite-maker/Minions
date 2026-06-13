import { Router as WouterRouter, Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";

function App() {
  return (
    <TooltipProvider>
      <WouterRouter>
        <Switch>
          <Route path="/" component={Home} />
          <Route>
            <div
              style={{
                background: "#a8c8e8",
                width: "100vw",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Segoe UI', Arial, sans-serif",
                fontWeight: 900,
                fontSize: "2rem",
                color: "#1a2a3a",
              }}
            >
              404 — NOT FOUND
            </div>
          </Route>
        </Switch>
      </WouterRouter>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
