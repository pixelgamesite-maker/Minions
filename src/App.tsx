import { Router as WouterRouter, Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Register from "@/pages/register";
import Media from "@/pages/media";
import Checker from "@/pages/checker";

function NotFound() {
  return (
    <div
      style={{
        backgroundColor: "#FF2222",
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Arial Black', Arial, sans-serif",
        fontWeight: 900,
        fontSize: "2rem",
        color: "#000",
      }}
    >
      404 — NOT FOUND
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/register" component={Register} />
      <Route path="/media" component={Media} />
      <Route path="/checker" component={Checker} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <WouterRouter>
        <Router />
      </WouterRouter>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
