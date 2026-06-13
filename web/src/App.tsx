import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import ConciergeWidget from "./components/ConciergeWidget";
import Landing from "./routes/Landing";
import Valuation from "./routes/Valuation";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/valuation" element={<Valuation />} />
        </Routes>
      </main>
      <Footer />
      <ConciergeWidget />
    </div>
  );
}
