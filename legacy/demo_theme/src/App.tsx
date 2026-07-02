import { Routes, Route, useLocation } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import ConciergeWidget from "./components/ConciergeWidget";
import ErrorBoundary from "./components/ErrorBoundary";
import Landing from "./routes/Landing";
import Valuation from "./routes/Valuation";
import NotFound from "./routes/NotFound";
import EmbedValuation from "./routes/EmbedValuation";
import EmbedConcierge from "./routes/EmbedConcierge";

export default function App() {
  const { pathname } = useLocation();

  // Embed routes render chrome-less (no nav/footer/floating widget) so each tool
  // can be dropped into an external site via an iframe — see web/public/embed.js.
  if (pathname.startsWith("/embed")) {
    return (
      <ErrorBoundary>
        <Routes>
          <Route path="/embed/valuation" element={<EmbedValuation />} />
          <Route path="/embed/concierge" element={<EmbedConcierge />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/valuation" element={<Valuation />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </main>
      <Footer />
      <ConciergeWidget />
    </div>
  );
}
