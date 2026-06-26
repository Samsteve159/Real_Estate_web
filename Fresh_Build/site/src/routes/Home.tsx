import MotionHero from "../components/MotionHero";
import ToolsShowcase from "../components/ToolsShowcase";
import ListingsPreview from "../components/ListingsPreview";
import TrustBand from "../components/TrustBand";
import ContactCTA from "../components/ContactCTA";

export default function Home() {
  return (
    <>
      <MotionHero />
      <ListingsPreview />
      <ToolsShowcase />
      <TrustBand />
      <ContactCTA />
    </>
  );
}
