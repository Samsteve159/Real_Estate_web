import MotionHero from "../components/MotionHero";
import ServicesShowcase from "../components/ServicesShowcase";
import ListingsPreview from "../components/ListingsPreview";
import TrustBand from "../components/TrustBand";
import ContactCTA from "../components/ContactCTA";

export default function Home() {
  return (
    <>
      <MotionHero />
      <ServicesShowcase />
      <ListingsPreview />
      <TrustBand />
      <ContactCTA />
    </>
  );
}
