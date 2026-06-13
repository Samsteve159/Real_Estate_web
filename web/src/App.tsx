import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import ConciergeWidget from "./components/ConciergeWidget";
import ErrorBoundary from "./components/ErrorBoundary";
import Landing from "./routes/Landing";
import Valuation from "./routes/Valuation";
import NotFound from "./routes/NotFound";

export default function App() {
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
