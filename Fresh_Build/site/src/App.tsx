import { BrowserRouter, Routes, Route } from "react-router-dom";
import Shell from "./components/Shell";
import Home from "./routes/Home";
import ListingsPage from "./routes/ListingsPage";
import ValuationPage from "./routes/ValuationPage";
import ConciergePage from "./routes/ConciergePage";
import StampDutyPage from "./routes/StampDutyPage";
import PreBuyingPage from "./routes/PreBuyingPage";
import PortfolioPage from "./routes/PortfolioPage";
import RentalPage from "./routes/RentalPage";
import AboutPage from "./routes/AboutPage";
import ContactPage from "./routes/ContactPage";
import NotFound from "./routes/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Shell />}>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<ListingsPage />} />
          <Route path="/tools/valuation" element={<ValuationPage />} />
          <Route path="/tools/concierge" element={<ConciergePage />} />
          <Route path="/tools/stamp-duty" element={<StampDutyPage />} />
          <Route path="/tools/pre-buying" element={<PreBuyingPage />} />
          <Route path="/tools/portfolio" element={<PortfolioPage />} />
          <Route path="/tools/rental" element={<RentalPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
