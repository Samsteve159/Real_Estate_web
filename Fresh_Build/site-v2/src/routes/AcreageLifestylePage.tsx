import ServicePage from "../components/ServicePage";

export default function AcreageLifestylePage() {
  return (
    <ServicePage
      eyebrow="Acreage & Lifestyle"
      title={<>Lifestyle &amp;<br />acreage property.</>}
      intro={[
        "Lifestyle properties require a different approach to traditional residential real estate.",
        "Our experience in acreage sales allows us to connect buyers seeking space, lifestyle and investment opportunities with properties that meet their long-term goals.",
        "From hobby farms to large rural holdings, we provide specialist advice throughout the sales process.",
      ]}
      listLabel="What we handle"
      items={[
        "Hobby Farms & Small Acreage",
        "Large Rural Holdings",
        "Lifestyle & Rural Marketing",
        "Buyer & Seller Advisory",
        "Skilled Negotiation",
        "End-to-End Sales Management",
      ]}
      ctaTitle="Buying or selling acreage? Let's talk."
      ctaLabel="Get in touch"
    />
  );
}
